import { expect } from "chai";
import { ValidMutationRules } from "./ValidMutationRules";
import { SpecificNodeFinder } from "../../testUtilities/SpecificNodeFinder";
import { SourceObjCreator } from "../../testUtilities/SourceObjCreator";
import { SyntaxKind, Node } from "typescript";

describe("Testing ValidMutationRules", () => {
      let mutationRules: ValidMutationRules;
      let nodeFinder: SpecificNodeFinder;
      const TEST_RULE_TREE = {
            [SyntaxKind.PlusToken]: {
                  [SyntaxKind.BinaryExpression]: {
                        [SyntaxKind.StringLiteral]: false
                  }
            },
            [SyntaxKind.GreaterThanToken || SyntaxKind.LessThanToken]: {
                  [SyntaxKind.BinaryExpression]: {
                        [SyntaxKind.BinaryExpression] : false
                  }
            },
            [SyntaxKind.ParenthesizedExpression]: {
                  [SyntaxKind.PropertyAccessExpression]: false
            }
      };
      beforeEach(() => {
            mutationRules = new ValidMutationRules();
            nodeFinder = new SpecificNodeFinder();
      });

      it("should set the nodes kind to 37, parent to 194, neighbours to 8 with 3+2", () => {
            const code = "3 + 2;";
            const sourceObj = new SourceObjCreator(code).sourceFile;
            const allPlusNodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.PlusToken, sourceObj);
            const plusNode: Node = allPlusNodes[0];
            mutationRules.setNodeFamily(plusNode);
            expect(mutationRules.nodeFamily)
            .to.eql([SyntaxKind.PlusToken, SyntaxKind.BinaryExpression, SyntaxKind.NumericLiteral,
                  SyntaxKind.NumericLiteral]);
      });

      it("should return false when given a string addition expression", () => {
            const code = "'hello' + 'hey';";
            const sourceObj = new SourceObjCreator(code).sourceFile;
            const nodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.PlusToken, sourceObj);
            const node: Node = nodes[0];
            mutationRules.setNodeFamily(node);
            const actual = mutationRules.traverseRuleTree(TEST_RULE_TREE, 0);
            expect(actual).to.equal(false);
      });

      it("should return true when given numeric literals with the operator >", () => {
            const code = "3 > 4;";
            const sourceObj = new SourceObjCreator(code).sourceFile;
            const nodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.GreaterThanToken, sourceObj);
            const node: Node = nodes[0];
            mutationRules.setNodeFamily(node);
            const actual = mutationRules.traverseRuleTree(TEST_RULE_TREE, 0);
            expect(actual).to.equal(true);
      });

      it("should return false when given no literals with the operator >", () => {
            const code = "public method: Array<hello>{}";
            const sourceObj = new SourceObjCreator(code).sourceFile;
            const nodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.GreaterThanToken, sourceObj);
            const node: Node = nodes[0];
            mutationRules.setNodeFamily(node);
            const actual = mutationRules.traverseRuleTree(TEST_RULE_TREE, 0);
            expect(actual).to.equal(false);
      });

      it("should return true when given a kind not in the tree", () => {
            const code = "const x = 'stringLiteral'";
            const sourceObj = new SourceObjCreator(code).sourceFile;
            const nodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.StringLiteral, sourceObj);
            const node: Node = nodes[0];
            mutationRules.setNodeFamily(node);
            const actual = mutationRules.traverseRuleTree(TEST_RULE_TREE, 0);
            expect(actual).to.equal(true);
      });

      it("should return true when given a kind which is an OR rule", () => {
            const code = "3 < 4;";
            const sourceObj = new SourceObjCreator(code).sourceFile;
            const nodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.LessThanToken, sourceObj);
            const node: Node = nodes[0];
            mutationRules.setNodeFamily(node);
            const actual = mutationRules.traverseRuleTree(TEST_RULE_TREE, 0);
            expect(actual).to.equal(true);
      });

      it("should return false when given a parenthesized expr attached to a property access expr", () => {
            const code = "(3 < 4).toString();";
            const sourceObj = new SourceObjCreator(code).sourceFile;
            const nodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.ParenthesizedExpression, sourceObj);
            const node: Node = nodes[0];
            mutationRules.setNodeFamily(node);
            const actual = mutationRules.traverseRuleTree(TEST_RULE_TREE, 0);
            expect(actual).to.equal(false);
      });

      it("should return true when given a parenthesized expr NOT attached to a property access expr", () => {
            const code = "const x = (3 < 4)";
            const sourceObj = new SourceObjCreator(code).sourceFile;
            const nodes = nodeFinder.findObjectsOfSyntaxKind(SyntaxKind.ParenthesizedExpression, sourceObj);
            const node: Node = nodes[0];
            mutationRules.setNodeFamily(node);
            const actual = mutationRules.traverseRuleTree(TEST_RULE_TREE, 0);
            expect(actual).to.equal(true);
      });
});
