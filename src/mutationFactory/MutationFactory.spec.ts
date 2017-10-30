import { MutationFactory } from "./MutationFactory";
import * as ts from "typescript";
import { expect } from "chai";

describe("Testing MutationFactory", () => {

    it("inputing a plus token value (37) should return a minus token value (38)", () => {
        const expected = " - ";
        const actual = MutationFactory.getSingleMutation(ts.SyntaxKind.PlusToken);
        expect(actual).to.equal(expected);
    });
    it("inputing a minus token value (38) should return a plus token value (37)", () => {
        const expected = " + ";
        const actual = MutationFactory.getSingleMutation(ts.SyntaxKind.MinusToken);
        expect(actual).to.equal(expected);
    });
    it("inputing a true keyword value (101) should return a false keyword value (86)", () => {
        const expected = " false";
        const actual = MutationFactory.getSingleMutation(ts.SyntaxKind.TrueKeyword);
        expect(actual).to.equal(expected);
    });
    it("inputing a false keyword value (86) should return a true keyword value (101)", () => {
        const expected = " true";
        const actual = MutationFactory.getSingleMutation(ts.SyntaxKind.FalseKeyword);
        expect(actual).to.equal(expected);
    });
});
