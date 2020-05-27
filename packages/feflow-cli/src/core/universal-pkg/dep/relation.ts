import { toInstalled } from './base';

export class PkgRelation {
  dependencies: Map<string, string>;

  dependedOn: Map<string, string>;

  constructor(oRelation: any) {
    this.dependencies = toInstalled(oRelation?.dependencies);
    this.dependedOn = toInstalled(oRelation?.dependedOn);
  }
}
