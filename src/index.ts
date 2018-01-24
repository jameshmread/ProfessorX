import { ConfigManager } from "./configManager/ConfigManager";
import { Supervisor } from "./supervisor/supervisor";
import { NodeHandler } from "./nodeHandler/NodeHandler";

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
        this.nodeHandler = new NodeHandler();
        console.log("Finding Nodes... \n");
        this.nodeHandler.createAllFileDescriptors();
        this.nodeHandler.traverseFilesForNodes();
        console.log("Found ", this.nodeHandler.fileNameNodes.length, " mutatable nodes. ");
        console.log("In ", ConfigManager.filesToMutate.length, " Files \n");
        console.log("Filename nodes ", this.nodeHandler.fileNameNodes);
        this.supervisor = new Supervisor(this.nodeHandler.fileNameNodes);
        this.supervisor.spawnWorkers();
    }
}
const x = new ProfessorX();
x.main();
