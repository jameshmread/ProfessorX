import { Node, SyntaxKind, Type } from "typescript";

export class ValidMutationRules {

      public static readonly RULETREE = {
            [SyntaxKind.PlusToken]: {
                  [SyntaxKind.BinaryExpression]: {
                        [SyntaxKind.StringLiteral]: false
                  }
            },
            [SyntaxKind.GreaterThanToken || SyntaxKind.LessThanToken]: {
                  [SyntaxKind.BinaryExpression]: true
            }
      };

      public static nodeKind: SyntaxKind;
      public static parentKind: SyntaxKind;
      public static neighbourKind: SyntaxKind;
      public static ruleDepth;

      public static setNodeFamily (node: Node, parent: Node, neighbour: Node) {
            this.nodeKind = node.kind;
            this.parentKind = node.parent.kind;
            this.neighbourKind = node.parent.getChildAt(0).kind;
            this.ruleDepth = [
                  ValidMutationRules.nodeKind,
                  ValidMutationRules.parentKind,
                  ValidMutationRules.neighbourKind
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

      public static traverseRuleTree (kind: Object, ruleDepth): boolean {
            console.log("kind", kind);
            if (typeof kind === "boolean") {
                  console.log("hello", kind);
                  return kind;
            }
            Object.keys(kind).forEach((syntaxKind) => {
                  if (ValidMutationRules.ruleDepth[ruleDepth] === Number(syntaxKind)) {
                        return ValidMutationRules.traverseRuleTree(kind[syntaxKind], ruleDepth + 1);
                  }
            });
            console.log("depth", ruleDepth);
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
