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
        NodeHandler.createAllFileDescriptors();
        console.log("Finding Nodes... \n");
        NodeHandler.traverseFilesForNodes();
        console.log("Found ", NodeHandler.fileNameNodes.length, " mutatable nodes. ");
        console.log("In ", ConfigManager.filesToMutate.length, " Files \n");
        console.log("Filename nodes ", NodeHandler.fileNameNodes);
        this.supervisor = new Supervisor(NodeHandler.fileNameNodes);
        this.supervisor.spawnWorkers();
    }
}
const x = new ProfessorX();
x.main();
