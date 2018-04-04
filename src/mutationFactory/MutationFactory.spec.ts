import * as ts from "typescript";
import { expect } from "chai";

import { MutationFactory } from "./MutationFactory";
import { IMutationArrayAndClass } from "../../interfaces/IMutationArrayAndClass";
import { MutationClass } from "../../enums/MutationClass";
import { CreateMutatableNodes } from "../../testUtilities/CreateMutatableNodes";

describe("Testing MutationFactory", () => {

    it("inputing a plus token value (37) should return binary substitution class for mutationClass", () => {
        const expected = MutationClass.Binary_Substitution;
        const actual = MutationFactory.getMultipleMutations(ts.SyntaxKind.PlusToken);
        expect(actual.mutationClass).to.equal(expected);
    });

    it("inputing a plus token value (37) should return an array of strings for mutations", () => {
        const actual = MutationFactory.getMultipleMutations(ts.SyntaxKind.PlusToken);
        expect(actual.mutations).to.not.equal(void 0);
    });

    it("should return a flat array of mutation classes", () => {
        const expected = [
            {
                mutationClass: "No Simple Mutations Found for this Syntax Kind",
                mutations: []
            },
            {
                mutationClass: "Modification of Numeric Literal",
                mutations: ["7", "5", "-6", "0", "1", "-1"]
            },
            {
                mutationClass: "Removal of Parenthesis in a statement",
                mutations: []
            }
        ];
        const node = CreateMutatableNodes.createMutatableNodes(1)[0];
        node.syntaxType = ts.SyntaxKind.NumericLiteral;
        node.plainText = "6";
        const actual = MutationFactory.getAllMutations(node);
        expect(actual).to.eql(expected);
    });
});
