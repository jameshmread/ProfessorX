import { IComplexMutation } from "../../../interfaces/IComplexMutation";
import { IMutationArrayAndClass } from "../../../interfaces/IMutationArrayandClass";

export abstract class ComplexMutations implements IComplexMutation {
    constructor (protected plainText: string) {}
    public abstract getComplexMutation (): IMutationArrayAndClass;
    public abstract isNodeValidForMutation (nodeText: string): boolean;
    public removeDuplicateMutations (mutations: Array<string>): Array<string> {
        return mutations.filter((value, index, array) => array.indexOf(value) === index);
    }
}
