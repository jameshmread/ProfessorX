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
import { FileObject } from "../DTOs/FileObject";
import { MutationFactory } from "./mutationFactory/MutationFactory";

export class ProfessorX {
    public logicalCores: number = os.cpus().length;
    public workers = [];
    public startTimestamp: number;
    public fileHandler: FileHandler;
    public sourceObj: SourceObject;
    public fileObj: FileObject;
    public codeInspector: CodeInspector;
    public nodes = new Array<IMutatableNode>();
    public multiNodeHandler: MultipleNodeHandler;

    public constructor () {
        const configManager = new ConfigManager();
        this.startTimestamp = new Date().getTime();
        this.fileObj = new FileObject(ConfigManager.filePath, ConfigManager.fileToMutate);
        this.fileHandler = new FileHandler(this.fileObj);
        this.sourceObj = new SourceObject(this.fileHandler.getSourceObject());
        this.codeInspector = new CodeInspector(this.sourceObj.origionalSourceObject);
        // above two will need to be given a new source object / file path for every file

    }

    public  main () {
        // will be mutateFiles -> mutateNodesInsideFiles
        // JSON.stringify(new OutputStore("path", "file", "runner", {}))
        // for (let i = 0; i < this.logicalCores; i++){
        //     this.workers.push(worker.fork("./src/Worker.ts"));
        //     this.workers[i].addListener("message", () => {});
        // }
       
        // this.multiNodeHandler = new MultipleNodeHandler(
        //     this.sourceObj,
        //     this.fileObj
        // );
        this.nodes = this.getAllNodes();
        this.splitNodes();
        // await this.mutateAllNodeTypes();
        // this.finishRun();
    }

    public getAllNodes () {
        MutationFactory.mutatableTokens.forEach((syntaxItem) => {
            this.codeInspector.findObjectsOfSyntaxKind(syntaxItem).forEach((token) => {
                this.nodes.push({
                    syntaxType : syntaxItem,
                    positions : token
                });
            });
        });
        return this.nodes;
  }

    private splitNodes () {
        const splitNodes = [];
        let coreChosen = 0;
        const tempNodes = this.nodes;
        for (let i = 0; i < this.logicalCores; i++) {
            splitNodes.push([]);
        }
        for (let i = 0; i < tempNodes.length; i++) {
            if (coreChosen >= splitNodes.length) {
                coreChosen = 0;
            }
            splitNodes[coreChosen].push(tempNodes[i]);
            coreChosen++;
        }
        console.log(splitNodes);
        return splitNodes;
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
