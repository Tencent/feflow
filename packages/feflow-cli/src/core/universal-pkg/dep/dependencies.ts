import { Relation } from './relation';
import fs from 'fs';
import { toPkg } from './base';
import versionImpl from './version';
import path from 'path';

export class UniversalPkg {

    private pkgFile: string;

    private version: string = '0.0.0';

    // pkg: version
    private installed: Map<string, string> = new Map();

    private relation: Map<string, Map<string, Relation>> = new Map();

    constructor(pkgFile: string) {
        this.pkgFile = pkgFile;
        if (!fs.existsSync(pkgFile)) {
            const d = path.resolve(pkgFile, '..');
            if (!fs.existsSync(d)) {
                fs.mkdirSync(d, {
                    recursive: true
                });
            }
            this.saveChange();
            return;
        }
        const universalPkg = require(pkgFile);
        this.version = universalPkg?.version || this.version;
        this.installed = toPkg(universalPkg?.installed);
        this.relation = this.toRelation(universalPkg?.relation);
    }

    private toRelation(oRelation: any): Map<string, Map<string, Relation>> {
        let relation = new Map<string, Map<string, Relation>>();
        if (!oRelation) {
            return relation;
        }
        for (const pkg in oRelation) {
            const versionRelationMap = oRelation[pkg];
            if (!versionRelationMap) {
                continue;
            }
            let pkgRelation = new Map<string, Relation>();
            for (const version in versionRelationMap) {
                const oVersionRelation = versionRelationMap[version];
                if (versionImpl.check(version)) {
                    pkgRelation[version] = new Relation(oVersionRelation);
                }
            }
            if (pkgRelation.size > 0) {
                relation[pkg] = pkgRelation;
            }
        }
        return relation;
    }

    isInstalled(pkg: string, version?: string): boolean {
        const v = this.installed.get(pkg);
        if (v) {
            return version ? v === version : true;
        }
        return false;
    }

    isRequiredByOther(pkg: string, version: string): boolean {
        const vRelation = this.relation.get(pkg);
        if (vRelation) {
            const r = vRelation.get(version);
            if (r && r.requiredBy.size > 0) {
                return true;
            }
        }
        return false;
    }

    install(pkg: string, version: string) {
        this.installed.set(pkg, version);
        this.saveChange();
    }

    require(pkg: string, version: string, requirePkg: string, requirePkgVersion: string) {
        let versionMap = this.relation.get(pkg);
        if (!versionMap) {
            versionMap = new Map<string, Relation>();
        }
        let r = versionMap.get(version);
        if (!r) {
            r = new Relation(null);
        }
        r.required.set(requirePkg, requirePkgVersion);
        versionMap.set(version, r);
        this.relation.set(pkg, versionMap);
        this.requireBy(requirePkg, requirePkgVersion, pkg, version);
        this.saveChange();
    }

    private requireBy(pkg: string, version: string, requireByPkg: string, requireByPkgVersion: string) {
        let versionMap = this.relation.get(pkg);
        if (!versionMap) {
            versionMap = new Map<string, Relation>();
        }
        let r = versionMap.get(version);
        if (!r) {
            r = new Relation(null);
        }
        r.requiredBy.set(requireByPkg, requireByPkgVersion);
        versionMap.set(version, r);
        this.relation.set(pkg, versionMap);
    }

    uninstall(pkg: string, version: string, skipError?: boolean) {
        const requireBy = this.getRequireBy(pkg, version);
        if (!requireBy || requireBy.size === 0) {
            if (skipError) {
                return;
            }
            throw `refusing to uninstall ${pkg}@${version} because it is required by
            ${requireBy?.keys[0]}@${requireBy?.values[0]} ...`;
        }
        const required = this.getRequired(pkg, version);
        if (required) {
            for (const r in required.keys()) {
                const v = required.get(r) || '';
                const curRequireBy = this.getRequireBy(pkg, version);
                if (!curRequireBy || curRequireBy.size === 0) {
                    return
                }
                this.uninstall(r, v, true);
            }
        }
        if (this.installed.get(pkg) === version) {
            this.installed.delete(pkg);
        }
        const versionRelation = this.relation.get(pkg);
        if (versionRelation) {
            const r = versionRelation.get(version);
            if (r) {
                versionRelation.delete(version);
            }
        }
        this.saveChange();
    }

    getRequireBy(pkg: string, version: string): Map<string, string> | undefined {
        const r = this.getRelation(pkg, version);
        if (!r) {
            return;
        }
        return r.requiredBy;
    }

    getRequired(pkg: string, version: string): Map<string, string> | undefined {
        const r = this.getRelation(pkg, version);
        if (!r) {
            return;
        }
        return r.required;
    }

    getRelation(pkg: string, version: string): Relation | undefined {
        const versionRelation = this.relation.get(pkg);
        if (!versionRelation) {
            return;
        }
        return versionRelation.get(version);
    }

    private saveChange() {
        fs.writeFileSync(this.pkgFile, JSON.stringify({
            version: this.version,
            installed: this._mapToObject(this.installed),
            relation: this._mapToObject(this.relation)
        }, null, 4))
    }

    private _mapToObject(m: Map<any, any>): object {
        let o = Object.create(null);
        if (!m) {
            return o;
        }
        const keys = m.keys();
        for (const k of keys) {
            let v = m.get(k);
            v = v instanceof Map ? this._mapToObject(v) : v;
            o[k] = v;
        }
        return o;
    }

}
