import { Node, SyntaxKind, Type } from "typescript";

export class ValidMutationRules {

      /*
      Rule tree format:
            Target Node for mutation ->
                  Parent Node Type ->
                        Child Type (Target node neighbour): Boolean
      */
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
            },
            [SyntaxKind.ParenthesizedExpression]: {
                  [SyntaxKind.PropertyAccessExpression]: false
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
            if (node.getChildAt(2) === null) {
                  this.nodeFamily = [
                        node.kind,
                        node.parent.kind,
                        node.parent.getChildAt(0).kind
                  ];
            } else {
                  this.nodeFamily = [
                        node.kind,
                        node.parent.kind,
                        node.parent.getChildAt(0).kind,
                        node.parent.getChildAt(2).kind
                  ];
            }
      }
}
