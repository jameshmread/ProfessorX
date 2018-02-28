export interface IComplexMutation {
    getComplexMutation (nodePlainText: string): Array<string>;
    isNodeValidForMutation (nodeText: string): boolean;
    removeDuplicateMutations (mutationArray: Array<string>): Array<string>;
}
