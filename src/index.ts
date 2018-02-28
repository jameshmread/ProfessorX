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
        if (NodeHandler.fileNameNodes.length === 0) {
            console.log("No nodes found to mutate, check Professor X config settings.");
            process.exit(1);
        }
        this.supervisor = new Supervisor(NodeHandler.fileNameNodes);
        this.supervisor.spawnWorkers();
    }
}
const x = new ProfessorX();
x.main();
