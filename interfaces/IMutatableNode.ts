export interface IMutatableNode {
     syntaxType: number;
     positions: {pos: number, end: number};
     parentFileName: string;
}
