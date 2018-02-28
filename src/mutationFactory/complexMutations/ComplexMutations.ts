import { IComplexMutation } from "../../../interfaces/IComplexMutation";

export abstract class ComplexMutations implements IComplexMutation {
    constructor (protected plainText: string) {}
    public abstract getComplexMutation (): Array<string>;
    public abstract isNodeValidForMutation (nodeText: string): boolean;
    public removeDuplicateMutations (mutationArray: Array<string>): Array<string> {
        return mutationArray.filter((value, index, array) => array.indexOf(value) === index);
    }
}
