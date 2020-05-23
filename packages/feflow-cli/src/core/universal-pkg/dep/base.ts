import versionImpl from './version';

export function toPkg(oPkg: any): Map<string, string> {
    let installed = new Map<string, string>();
    if (!oPkg) {
        return installed;
    }
    for (const k in oPkg) {
        const version = oPkg[k];
        if (versionImpl.check(version)) {
            installed.set(k, version);
        }
    }
    return installed;
}
