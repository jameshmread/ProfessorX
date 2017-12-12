import { FileHandler } from "./FileHandler/FileHandler";
import { CodeInspector } from "./CodeInspector/CodeInspector";
import { SourceCodeHandler } from "./SourceCodeHandler/SourceCodeHandler";
import { OutputStoreManager } from "./output/OutputStoreManager";
import { ConfigManager } from "./configManager/ConfigManager";
import { IMutatableNode } from "../interfaces/IMutatableNode";
import { MultipleNodeHandler } from "./multipleNodeHandler/MultipleNodeHandler";
import { OutputStore } from "../DTOs/OutputStore";

import * as worker from "child_process";
import * as os from "os";
import { SourceObject } from "../DTOs/SourceObject";

export class ProfessorX {
    public startTimestamp: number;
    public fileHandler: FileHandler;
    public sourceObj: SourceObject;
    public codeInspector: CodeInspector;
    public nodes: Array<IMutatableNode>;
    public multiNodeHandler: MultipleNodeHandler;

    public constructor () {
        const configManager = new ConfigManager();
        this.startTimestamp = new Date().getTime();
        this.fileHandler = new FileHandler(ConfigManager.filePath, ConfigManager.fileToMutate);
        this.sourceObj = new SourceObject(this.fileHandler.getSourceObject());
        // above two will need to be given a new source object for every file

    }

    public async main () {
        // will be mutateFiles -> mutateNodesInsideFiles
        // JSON.stringify(new OutputStore("path", "file", "runner", {}))
        const workers = [];
        for (let i = 0; i < 4; i++){
            workers.push(worker.fork("./src/Worker.ts"));
            workers[i].addListener("message", () => {});
            console.log("dd");
        }
        for (let i = 0; i < 4; i++) {
            workers[i].send("55");
        }

        // this.multiNodeHandler = new MultipleNodeHandler(
        //     this.sourceObj,
        //     this.fileHandler
        // );
        this.nodes = this.multiNodeHandler.getAllNodes();
        await this.mutateAllNodeTypes();
        this.finishRun();
    }

    private async mutateAllNodeTypes () {
        for (const currentNode of this.nodes) {
            await this.multiNodeHandler.mutateAllNodesOfType(currentNode);
        }
    }

    private finishRun () {
        const endTimestamp = new Date().getTime();
        const difference = new Date(endTimestamp - this.startTimestamp).getTime();
        OutputStoreManager.writeOutputStoreToJson();
        OutputStoreManager.setRunTime(difference);
    }
}
const x = new ProfessorX();
x.main();
