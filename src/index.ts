import { ConfigManager } from "./configManager/ConfigManager";
import { Supervisor } from "./supervisor/supervisor";
import { NodeHandler } from "./nodeHandler/NodeHandler";
import { Logger } from "./logging/Logger";

export class ProfessorX {

    public supervisor: Supervisor;

    public constructor () {
       this.setupEnvironment();
    }

    public async main () {
        Logger.log("Creating File Objects");
        NodeHandler.createAllFileDescriptors();
        Logger.log("Finding Nodes...");
        NodeHandler.traverseFilesForNodes();

        this.supervisor = new Supervisor(NodeHandler.fileNameNodes);
        this.supervisor.spawnWorkers();
    }

    private setupEnvironment () {
        Logger.log("Setting Up Environment");
        const configManager = new ConfigManager();
        Logger.info("Read Configuration File", configManager);
        ConfigManager.getFilesToMutate();
    }
}
const x = new ProfessorX();
x.main();
