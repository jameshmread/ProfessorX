import { createSourceFile, ScriptTarget, SyntaxKind } from "typescript";
import { expect } from "chai";

import { NodeHandler } from "./NodeHandler";
import { CodeInspector } from "../CodeInspector/CodeInspector";
import { SourceObject } from "../../DTOs/SourceObject";
import { ConfigManager } from "../configManager/ConfigManager";
import { FileObject } from "../../DTOs/FileObject";
import { MutationFactory } from "../mutationFactory/MutationFactory";
import { StubConfigFile } from "../../testUtilities/StubConfigFile";

describe("Testing NodeHandler ", () => {

    const configManager = new ConfigManager(StubConfigFile.configFile);

    const fo = new FileObject("TestFile.ts", "TestTestFile.spec.ts");
    const code = `
            let x: number = 3 + 9;
            const y: boolean = true;
        `;
    const sourceFile = createSourceFile("TestFile", code, ScriptTarget.ES2015, true);
    const so = new SourceObject(sourceFile);
    const ci = new CodeInspector(so.origionalSourceObject);

    let nodeHandler: NodeHandler;
    beforeEach(() => {
        nodeHandler = new NodeHandler();
        NodeHandler.fileNameNodes = [];
    });

    it("should return a list of the + nodes in a file", () => {
        MutationFactory.mutatableTokens = [SyntaxKind.PlusToken];
        expect(NodeHandler.fileNameNodes.length).to.equal(0);
        NodeHandler.getAllNodesInFile(ci, 0);
        expect(NodeHandler.fileNameNodes.length).to.equal(1);
    });

    it("should return a list of the + and boolean nodes in a file", () => {
        MutationFactory.mutatableTokens = [SyntaxKind.PlusToken, SyntaxKind.TrueKeyword];
        expect(NodeHandler.fileNameNodes.length).to.equal(0);
        NodeHandler.getAllNodesInFile(ci, 0);
        expect(NodeHandler.fileNameNodes.length).to.equal(2);
    });
});
