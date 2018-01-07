import { ConfigManager } from "./configManager/ConfigManager";
import { FileHandler } from "./FileHandler/FileHandler";
import { CodeInspector } from "./CodeInspector/CodeInspector";
import { Supervisor } from "./Supervisor";
import { NodeHandler } from "./nodeHandler/NodeHandler";
import { SourceObject } from "./../DTOs/SourceObject";
import { FileObject } from "./../DTOs/FileObject";
import { IFileDescriptor } from "./../interfaces/IFileDescriptor";

export class ProfessorX {

    public supervisor: Supervisor;
    public nodeHandler: NodeHandler;

    public constructor () {
        console.log("Setting up environment. \n");
        const configManager = new ConfigManager();
        ConfigManager.getFilesToMutate();
    }

    public async main () {
        console.log("Creating File Objects");
        this.nodeHandler = new NodeHandler(this.createAllFileDescriptors());
        console.log("Finding Nodes... \n");
        this.nodeHandler.traverseFilesForNodes();
        console.log("Found ", this.nodeHandler.fileNameNodes.length, " mutatable nodes. ");
        console.log("In ", ConfigManager.filesToMutate.length, " Files \n");
        console.log("filename nodes ", this.nodeHandler.fileNameNodes);
        this.supervisor = new Supervisor(this.nodeHandler.fileNameNodes);
    }

    // I want to put this somewhere else
    private createAllFileDescriptors (): Array<IFileDescriptor> {
        const fileDescriptors = new Array<IFileDescriptor>();
        for (let i = 0; i < ConfigManager.filesToMutate.length; i++) {
            const fo = new FileObject(ConfigManager.filePath, ConfigManager.filesToMutate[i]);
            const fh = new FileHandler(fo);
            const so = new SourceObject(fh.getSourceObject());
            const ci = new CodeInspector(so.origionalSourceObject);
            fileDescriptors.push({
                    fileName: ConfigManager.filesToMutate[i],
                    fileObject: fo, fileHandler: fh, sourceObject: so, codeInspector: ci
            });
        }
        return fileDescriptors;
    }

}
const x = new ProfessorX();
x.main();
