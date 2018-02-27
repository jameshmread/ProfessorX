export interface IMutatableNode {
     syntaxType: number;
     plainText: string;
     positions: {pos: number, end: number};
     parentFileName: string;
}
