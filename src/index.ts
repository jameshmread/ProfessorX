import { IMutatableNode } from "../interfaces/IMutatableNode";
import { ConfigManager } from "./configManager/ConfigManager";
import { FileHandler } from "./FileHandler/FileHandler";
import { CodeInspector } from "./CodeInspector/CodeInspector";
import { SourceCodeHandler } from "./SourceCodeHandler/SourceCodeHandler";
import { OutputStoreManager } from "./output/OutputStoreManager";
import { MutationFactory } from "./mutationFactory/MutationFactory";
import { Supervisor } from "./Supervisor";

import { SourceObject } from "../DTOs/SourceObject";
import { OutputStore } from "../DTOs/OutputStore";
import { FileObject } from "../DTOs/FileObject";

export class ProfessorX {

    public fileHandler: FileHandler;
    public sourceObj: SourceObject;
    public fileObj: FileObject;
    public codeInspector: CodeInspector;
    public nodes = new Array<IMutatableNode>();
    public supervisor: Supervisor;

    public constructor () {
        const configManager = new ConfigManager();
        this.fileObj = new FileObject(ConfigManager.filePath, ConfigManager.fileToMutate);
        this.fileHandler = new FileHandler(this.fileObj);
        this.sourceObj = new SourceObject(this.fileHandler.getSourceObject());
        this.codeInspector = new CodeInspector(this.sourceObj.origionalSourceObject);
        // above two will need to be given a new source object / file path for every file
    }

    public async main () {
        // will be mutateFiles -> mutateNodesInsideFiles
        this.nodes = this.getAllNodes();
        this.supervisor = new Supervisor(this.nodes);
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


}
const x = new ProfessorX();
x.main();
