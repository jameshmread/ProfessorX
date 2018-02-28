import { expect } from "chai";
import { ParenthesesModifier } from "./ParenthesesModifier";

describe("Parentheses Modifier", () => {

    let pMod: ParenthesesModifier;
    beforeEach(() => {
        pMod = new ParenthesesModifier(null);
    });

    it("should return true when given empty parentheses", () => {
        expect(pMod.isNodeValidForMutation("()")).to.equal(true);
    });

    it("should return true when given parenthesis binary expression", () => {
        expect(pMod.isNodeValidForMutation("(3 + 4)")).to.equal(true);
    });

    it("should return false when given a square bracket set", () => {
        expect(pMod.isNodeValidForMutation("[(6 + 4)]")).to.equal(false);
    });

    it("should return true when given nested brackets", () => {
        expect(pMod.isNodeValidForMutation("((3 + 2) + 4)")).to.equal(true);
    });
});
