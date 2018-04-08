import { Config } from "../DEVCONFIG";

import { ConfigManager } from "./configManager/ConfigManager";
import { Supervisor } from "./supervisor/supervisor";
import { NodeHandler } from "./nodeHandler/NodeHandler";
import { Logger } from "./logging/Logger";
import { IConfigFile } from "../interfaces/IConfigFile";
import { resolve } from "path";


export class ProfessorX {

    public static configuration: IConfigFile;

    public supervisor: Supervisor;
    public constructor (inputConfig: IConfigFile) {
        ProfessorX.configuration = inputConfig;
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
        const configManager = new ConfigManager(ProfessorX.configuration);
        Logger.info("Read Configuration File");
        configManager.getFilesToMutate();
    }
}
const algorithm = new ProfessorX(Config.SELF);
algorithm.main();
