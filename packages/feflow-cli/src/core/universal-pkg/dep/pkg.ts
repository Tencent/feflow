import { PkgRelation } from './relation';
import fs from 'fs';
import { toInstalled } from './base';
import versionImpl from './version';
import path from 'path';

export class UniversalPkg {
  private pkgFile: string;

  private version = '0.0.0';

  // pkg: version
  private installed: Map<string, string> = new Map();

  private dependencies: Map<string, Map<string, PkgRelation>> = new Map();

  constructor(pkgFile: string) {
    this.pkgFile = pkgFile;
    if (!fs.existsSync(pkgFile)) {
      this.saveChange();
      return;
    }
    try {
      const data = fs.readFileSync(pkgFile, 'utf-8');
      const universalPkg = JSON.parse(data);
      this.version = universalPkg?.version || this.version;
      this.installed = toInstalled(universalPkg?.installed);
      this.dependencies = this.toDependencies(universalPkg?.dependencies);
    } catch (error) {
      throw new Error(error);
    }
  }

  getInstalled(): Map<string, string> {
    return this.installed;
  }

  getAllDependencies(): Map<string, Map<string, PkgRelation>> {
    return this.dependencies;
  }

  getDepended(pkg: string, version: string): Map<string, string> | undefined {
    const r = this.getPkgRelation(pkg, version);
    if (!r) {
      return;
    }
    return r.dependedOn;
  }

  getDependencies(pkg: string, version: string): Map<string, string> | undefined {
    const r = this.getPkgRelation(pkg, version);
    if (!r) {
      return;
    }
    return r.dependencies;
  }

  isInstalled(pkg: string, version?: string, includeDep?: boolean): boolean {
    if (!version && !includeDep) {
      return this.installed.has(pkg);
    }
    if (version && includeDep) {
      return this.getPkgRelation(pkg, version) !== undefined;
    }
    const v = this.installed.get(pkg);
    if (v && version === v) {
      return true;
    }
    return false;
  }

  install(pkg: string, version: string) {
    this.installed.set(pkg, version);
    let versionMap = this.dependencies.get(pkg);
    if (!versionMap) {
      versionMap = new Map<string, PkgRelation>();
    }
    let r = versionMap.get(version);
    if (!r) {
      r = new PkgRelation(null);
    }
    versionMap.set(version, r);
    this.dependencies.set(pkg, versionMap);
  }

  isDependedOnOnOther(pkg: string, version: string): boolean {
    const vRelation = this.dependencies.get(pkg);
    if (vRelation) {
      const r = vRelation.get(version);
      if (r && r.dependedOn.size > 0) {
        return true;
      }
    }
    return false;
  }

  depend(pkg: string, version: string, dependPkg: string, dependPkgVersion: string) {
    let versionMap = this.dependencies.get(pkg);
    if (!versionMap) {
      versionMap = new Map<string, PkgRelation>();
    }
    let r = versionMap.get(version);
    if (!r) {
      r = new PkgRelation(null);
    }
    r.dependencies.set(dependPkg, dependPkgVersion);
    versionMap.set(version, r);
    this.dependencies.set(pkg, versionMap);
    this.dependedOn(dependPkg, dependPkgVersion, pkg, version);
  }

  removeInvalidDependencies(): [string, string][] {
    const invalidDep: [string, string][] = [];
    for (const [pkg, versionRelation] of this.dependencies) {
      for (const [version] of versionRelation) {
        if (!this.isValid(pkg, version)) {
          invalidDep.push([pkg, version]);
        }
      }
    }
    for (const [pkg, version] of invalidDep) {
      const versionRelation = this.dependencies.get(pkg);
      if (versionRelation) {
        versionRelation.delete(version);
        if (versionRelation.size === 0) {
          this.dependencies.delete(pkg);
        }
      }
    }
    this.saveChange();
    return invalidDep;
  }

  removeDepend(pkg: string, version: string, dependPkg: string, dependPkgVersion: string) {
    const dependencies = this.getDependencies(pkg, version);
    if (dependencies) {
      dependencies.delete(dependPkg);
    }
    const depended = this.getDepended(dependPkg, dependPkgVersion);
    if (depended) {
      depended.delete(pkg);
    }
    return depended ? depended.size : 0;
  }

  uninstall(pkg: string, version: string, isDep?: boolean) {
    const depended = this.getDepended(pkg, version);
    if (depended && depended.size > 0) {
      if (isDep) {
        return;
      }
      for (const [dependedPkg, dependedVersion] of depended) {
        throw `refusing to uninstall ${pkg}@${version} because it is required by ${dependedPkg}@${dependedVersion} ...`;
      }
    }
    const dependencies = this.getDependencies(pkg, version);
    if (dependencies) {
      for (const [requiredPkg, requiredVersion] of dependencies) {
        this.removeDepended(requiredPkg, requiredVersion, pkg, version);
      }
    }
    if (isDep && this.isInstalled(pkg, version)) {
      return;
    }
    this.installed.delete(pkg);
    this.saveChange();
  }

  removeDepended(pkg: string, version: string, dependedPkg: string, dependedVersion: string) {
    const dependedOn = this.getDepended(pkg, version);
    if (!dependedOn) {
      return;
    }
    if (dependedOn.get(dependedPkg) === dependedVersion) {
      dependedOn.delete(dependedPkg);
    }
  }

  getPkgRelation(pkg: string, version: string): PkgRelation | undefined {
    const versionRelation = this.dependencies.get(pkg);
    if (!versionRelation) {
      return;
    }
    return versionRelation.get(version);
  }

  saveChange() {
    if (!fs.existsSync(this.pkgFile)) {
      const d = path.resolve(this.pkgFile, '..');
      if (!fs.existsSync(d)) {
        fs.mkdirSync(d, {
          recursive: true,
        });
      }
    }
    fs.writeFileSync(
      this.pkgFile,
      JSON.stringify(
        {
          version: this.version,
          installed: this.toObject(this.installed),
          dependencies: this.toObject(this.dependencies),
        },
        null,
        4,
      ),
    );
  }

  private isValid(pkg: string, version: string): boolean {
    if (this.isInstalled(pkg, version)) {
      return true;
    }
    const depended = this.getDepended(pkg, version);
    if (!depended || depended.size === 0) {
      return false;
    }
    for (const [dependedPkg, dependedVersion] of depended) {
      if (this.isValid(dependedPkg, dependedVersion)) {
        return true;
      }
    }
    return false;
  }

  private toDependencies(oDependencies: any): Map<string, Map<string, PkgRelation>> {
    const dependencies = new Map<string, Map<string, PkgRelation>>();
    if (!oDependencies) {
      return dependencies;
    }
    const oDependenciesKey = Object.keys(oDependencies);
    for (const pkg of oDependenciesKey) {
      const versionRelationMap = oDependencies[pkg];
      if (!versionRelationMap) {
        continue;
      }
      const pkgRelation = new Map<string, PkgRelation>();
      const versionRelationMapKey = Object.keys(versionRelationMap);
      for (const version of versionRelationMapKey) {
        const oVersionRelation = versionRelationMap[version];
        if (versionImpl.check(version)) {
          pkgRelation.set(version, new PkgRelation(oVersionRelation));
        }
      }
      if (pkgRelation.size > 0) {
        dependencies.set(pkg, pkgRelation);
      }
    }
    return dependencies;
  }

  private dependedOn(pkg: string, version: string, dependedOnPkg: string, dependedOnPkgVersion: string) {
    let versionMap = this.dependencies.get(pkg);
    if (!versionMap) {
      versionMap = new Map<string, PkgRelation>();
    }
    let r = versionMap.get(version);
    if (!r) {
      r = new PkgRelation(null);
    }
    r.dependedOn.set(dependedOnPkg, dependedOnPkgVersion);
    versionMap.set(version, r);
    this.dependencies.set(pkg, versionMap);
  }

  private toObject(obj: any): object {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }
    const newObj = Object.create(null);
    if (obj instanceof Map) {
      for (const item of obj) {
        const [k] = item;
        let v = item[1];
        v = typeof v === 'object' ? this.toObject(v) : v;
        newObj[k] = v;
      }
    } else {
      const objKeyArr = Object.keys(obj);
      for (const item of objKeyArr) {
        let v = obj[item];
        v = typeof v === 'object' ? this.toObject(v) : v;
        newObj[item] = v;
      }
    }
    return newObj;
  }
}
