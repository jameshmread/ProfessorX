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

      public static nodeFamily: Array<SyntaxKind>;

      public static setNodeFamily (node: Node, parent: Node, neighbour: Node) {
            this.nodeFamily = [
                  node.kind,
                  parent.kind,
                  neighbour.kind
            ];
      }

      public static getNeighbourKinds (node: Node) {
            const childKinds: Array<SyntaxKind> = [];
            node.parent.forEachChild((child) => {
                  if (child.kind !== node.kind) {
                        childKinds.push(child.kind);
                  }
            });
            return childKinds;
      }

      public static traverseRuleTree (tree: Object, nodeFamilyIndex: number): boolean {
            const currentTreePosition = Object.keys(tree);
            const indexOfFamilyMember = currentTreePosition.indexOf(this.nodeFamily[nodeFamilyIndex].toString());
            if (indexOfFamilyMember >= 0) {
                  if (typeof tree[currentTreePosition[0]] === "boolean") {
                        return tree[currentTreePosition[0]];
                  }
                  return this.traverseRuleTree(tree[currentTreePosition[indexOfFamilyMember]], nodeFamilyIndex + 1);
            }
            return true;
      }

      public static isInBinaryExpression (node: Node): boolean {
            return node.parent.kind === SyntaxKind.BinaryExpression;
      }

      public static hasStringLiteralChild (node: Node): boolean {
            let aChildIsStringLiteral = false;
            node.parent.forEachChild((child) => {
                  if (child.kind === SyntaxKind.StringLiteral) {
                      aChildIsStringLiteral = true;
                  }
            });
            return aChildIsStringLiteral;
      }
}
