import { IMutationArrayAndClass } from "./IMutationArrayandClass";

export interface IComplexMutation {
    getComplexMutation (nodePlainText: string): IMutationArrayAndClass;
    isNodeValidForMutation (nodeText: string): boolean;
    removeDuplicateMutations (mutationArray: Array<string>): Array<string>;
}
