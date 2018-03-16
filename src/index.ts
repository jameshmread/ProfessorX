import { Config } from "../profx.conf";

import { ConfigManager } from "./configManager/ConfigManager";
import { Supervisor } from "./supervisor/supervisor";
import { NodeHandler } from "./nodeHandler/NodeHandler";
import { Logger } from "./logging/Logger";
import { IConfigFile } from "../interfaces/IConfigFile";

export class ProfessorX {

    public static configuration: IConfigFile;

    public supervisor: Supervisor;
    public constructor () {
        ProfessorX.configuration = Config.CONFIG_STRYKER;
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
        Logger.info("Read Configuration File", configManager);
        configManager.getFilesToMutate();
        console.log("sourceFiles", ConfigManager.filesToMutate);
        console.log("testfiles", ConfigManager.testFiles);
        console.log("extension", ConfigManager.testFileExtension);
        // process.exit(0);
    }
}
const x = new ProfessorX();
x.main();
