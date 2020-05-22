export const LATEST_VERSION = "latest"

export function checkVersion(version: any): boolean {
    if (typeof version !== 'string') {
        return false;
    }
    if (version === LATEST_VERSION) {
        return true;
    }
    return /^v?\d+.\d+.\d+$/i.test(version);
}

export function toPkg(oPkg: any): Map<string, string> {
    let installed = new Map<string, string>();
    if (!oPkg) {
        return installed;
    }
    for (const k in oPkg) {
        const version = oPkg[k];
        if (checkVersion(version)) {
            installed.set(k, version);
        }
    }
    return installed;
}