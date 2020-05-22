import { toPkg } from './base';

export class Relation {

    required: Map<string, string>;

    requiredBy: Map<string, string>;
    
    constructor(oRelation: any) {
        this.required = toPkg(oRelation?.required);
        this.requiredBy = toPkg(oRelation?.requiredBy);
    }

}