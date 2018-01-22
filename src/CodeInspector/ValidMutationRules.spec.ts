import { expect } from "chai";
import { ValidMutationRules } from "./ValidMutationRules";
import { SpecificNodeFinder } from "../../testUtilities/SpecificNodeFinder";
import { SourceObjCreator } from "../../testUtilities/SourceObjCreator";
import { SyntaxKind, Node } from "typescript";

describe("Testing ValidMutationRules", () => {
      let validMutationRules: ValidMutationRules;
      let nodeFinder: SpecificNodeFinder;
      beforeEach(() => {
            validMutationRules = new ValidMutationRules();
            nodeFinder = new SpecificNodeFinder();
      });

      it("should return true if node is part of binary expression", () => {
            const code = "const x = a + b";
            const sourceObj = new SourceObjCreator(code).sourceObj;
            const plusTokens = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.PlusToken, sourceObj);
            const tokenOfInterest = plusTokens[0];
            expect(ValidMutationRules.isInBinaryExpression(tokenOfInterest)).to.equal(true);
      });

      it("should return false if node is NOT part of binary expression", () => {
            const code = "return true;";
            const sourceObj = new SourceObjCreator(code).sourceObj;
            const tokens = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.TrueKeyword, sourceObj);
            const tokenOfInterest = tokens[0];
            expect(ValidMutationRules.isInBinaryExpression(tokenOfInterest)).to.equal(false);
      });

      it("should return true when + token is between two strings", () => {
            const code = "'hello' + 'world';";
            const sourceObj = new SourceObjCreator(code).sourceObj;

            const allPlusNodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.PlusToken, sourceObj);
            const plusNode: Node = allPlusNodes[0];
            const actual = ValidMutationRules.hasStringLiteralChild(plusNode);
            expect(actual).to.equal(true);
      });

      it("should return false when + token is between two numbers", () => {
            const code = "2 + 2;";
            const sourceObj = new SourceObjCreator(code).sourceObj;

            const allPlusNodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.PlusToken, sourceObj);
            const plusNode: Node = allPlusNodes[0];
            const actual = ValidMutationRules.hasStringLiteralChild(plusNode);
            expect(actual).to.equal(false);
      });

      it("should set the nodes kind to 37, parent to 194, neighbour to 8 with 3+2", () => {
            const code = "3 + 2;";
            const sourceObj = new SourceObjCreator(code).sourceObj;
            const allPlusNodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.PlusToken, sourceObj);
            const plusNode: Node = allPlusNodes[0];
            ValidMutationRules.setNodeFamily(plusNode, plusNode.parent, plusNode.parent.getChildAt(0));
            expect(ValidMutationRules.ruleDepth)
            .to.eql([SyntaxKind.PlusToken, SyntaxKind.BinaryExpression, SyntaxKind.NumericLiteral]);
      });

      it("should get the nodes parent's children (node's neighbours) kinds ", () => {
            const code = "3 + 2;";
            const sourceObj = new SourceObjCreator(code).sourceObj;
            const allPlusNodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.PlusToken, sourceObj);
            const plusNode: Node = allPlusNodes[0];
            const actual = ValidMutationRules.getNeighbourKinds(plusNode);
            expect(actual).to.eql([8, 8]);
      });

      it("should get two neighbours when in a larger expression", () => {
            const code = "3 + 2 + 4 + 6;";
            const sourceObj = new SourceObjCreator(code).sourceObj;
            const allPlusNodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.PlusToken, sourceObj);
            const plusNode: Node = allPlusNodes[1];
            const actual = ValidMutationRules.getNeighbourKinds(plusNode);
            expect(actual.length).to.equal(2);
      });

      xit("should return false when given a string addition expression", () => {
            const code = "'hello' + 'hey';";
            const sourceObj = new SourceObjCreator(code).sourceObj;
            const nodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.PlusToken, sourceObj);
            const node: Node = nodes[0];
            ValidMutationRules.setNodeFamily(node, node.parent, node.parent.getChildAt(0));
            console.log(ValidMutationRules.ruleDepth);
            const actual = ValidMutationRules.traverseRuleTree(ValidMutationRules.RULETREE, 0);
            expect(actual).to.equal(false);
      });
});
