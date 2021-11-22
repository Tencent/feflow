import semver from 'semver';

interface Version {
  check(version: unknown): boolean;
  valid(version: string): string;
  satisfies(version: string, range: string): boolean;
  gt(v1: string, v2: string): boolean;
}

class SemverVersion implements Version {
  latestVersion = 'latest';

  check(version: unknown): boolean {
    if (typeof version !== 'string') {
      return false;
    }
    if (version === this.latestVersion) {
      return true;
    }
    return /^v(0|[1-9]\d*).(0|[1-9]\d*).(0|[1-9]\d*)$/i.test(version);
  }

  valid(version: string): string {
    if (/^v.*/i.test(version)) {
      return version.substring(1);
    }
    return version;
  }

  toFull(version: string): string {
    if (!this.check(version)) {
      const fullVersion = `v${version}`;
      if (this.check(fullVersion)) {
        return fullVersion;
      }
    }
    return version;
  }

  satisfies(version: string, range: string): boolean {
    return semver.satisfies(this.valid(version), this.valid(range));
  }

  gt(v1: string, v2: string): boolean {
    return semver.gt(this.valid(v1), this.valid(v2));
  }
}

export default new SemverVersion();
