import { Node, SyntaxKind, Type } from "typescript";

export class ValidMutationRules {

      public static readonly RULE_TREE = {
            [SyntaxKind.PlusToken]: {
                  [SyntaxKind.BinaryExpression]: {
                        [SyntaxKind.StringLiteral]: false
                  }
            },
            [SyntaxKind.GreaterThanToken || SyntaxKind.LessThanToken]: {
                  [SyntaxKind.BinaryExpression]: {
                        [SyntaxKind.BinaryExpression] : false
                  }
            }
      };
      public nodeFamily: Array<SyntaxKind>;

      public traverseRuleTree (tree: Object, nodeFamilyIndex: number): boolean {
            const currentTreePosition = Object.keys(tree);
            const indexOfFamilyMember =
            currentTreePosition.indexOf(this.nodeFamily[nodeFamilyIndex].toString());
            if (indexOfFamilyMember >= 0) {
                  if (typeof tree[currentTreePosition[0]] === "boolean") {
                        return tree[currentTreePosition[0]];
                  }
                  return this.traverseRuleTree(tree[currentTreePosition[indexOfFamilyMember]], nodeFamilyIndex + 1);
            }
            return true;
      }

      public setNodeFamily (node: Node) {
            this.nodeFamily = [
                  node.kind,
                  node.parent.kind,
                  node.parent.getChildAt(0).kind
            ];
      }
}
