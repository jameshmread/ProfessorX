import { IMutatableNode } from "../../interfaces/IMutatableNode";
import { MutationFactory } from "../mutationFactory/MutationFactory";
import { OutputStoreManager } from "../output/OutputStoreManager";
import { ConfigManager } from "../configManager/ConfigManager";
import { SourceCodeHandler } from "../SourceCodeHandler/SourceCodeHandler";
import { CodeInspector } from "../CodeInspector/CodeInspector";
import { Cleaner } from "../cleanup/Cleaner";
import { FileHandler } from "../FileHandler/FileHandler";
import { OutputStore } from "../../DTOs/OutputStore";
import { MochaTestRunner } from "../mocha-testRunner/Mocha-TestRunner";

export class MultipleNodeHandler {
      private outputStoreManager: OutputStoreManager;
      private outputStore: OutputStore;
      private mochaRunner: MochaTestRunner;

      constructor (
            public sourceObj: SourceCodeHandler,
            public codeInspector: CodeInspector,
            public fileHandler: FileHandler
      ) {
            this.outputStoreManager = new OutputStoreManager();
            this.outputStore = new OutputStore(
                  ConfigManager.filePath,
                  ConfigManager.fileToMutate,
                  ConfigManager.testRunner,
                  ConfigManager.runnerConfig
            );
      }

      public async mutateAllNodesOfType (currentNode: IMutatableNode) {
            const mutationOptions = MutationFactory.getMultipleMutations(currentNode.syntaxType);
            for (let i = 0; i < currentNode.positions.length; i++) {
                  await this.mutateSingleNodeType(mutationOptions, currentNode, i);
            }
      }

      public async mutateSingleNodeType (mutationOptions: Array<string>, currentNode: IMutatableNode, i: number) {
            for (let j = 0; j < mutationOptions.length; j++) {
                  this.outputStoreManager.setCurrentOutputStore(this.outputStore);
                  // possibly need to make new output store?
                  // resets modified code after a mutation
                  this.sourceObj.resetModified();
                  // performs the modification at a specific position
                  this.sourceObj.modifyCode(
                        currentNode.positions[i]["pos"],
                        currentNode.positions[i]["end"],
                        mutationOptions[j]
                  );
                  // writes this change to a NEW src file
                  const srcFile = this.fileHandler.writeTempSourceModifiedFile(this.sourceObj.getModifiedSourceCode());
                  // creates a new test file with a reference to the NEW source file
                  const testFile = this.fileHandler.createTempTestModifiedFile();

                  this.outputStoreManager.configureStoreData(testFile, currentNode, i, this.sourceObj);

                  this.mochaRunner = new MochaTestRunner(ConfigManager.runnerConfig);
                  await this.mochaRunner.runTests(this.outputStoreManager, testFile);
                  // dont like how im deleting and re creating the test file for every node
                  Cleaner.deleteTestFile(testFile);
                  Cleaner.deleteSourceFile(srcFile);
                  this.outputStoreManager.addStoreToList();
            }
      }

      public getAllNodes () {
            const nodes: Array<IMutatableNode> = new Array<IMutatableNode>();
            MutationFactory.mutatableTokens.forEach((syntaxItem) => {
                nodes.push({
                    syntaxType : syntaxItem,
                    positions : this.codeInspector.findObjectsOfSyntaxKind(syntaxItem)
                });
            });
            return nodes;
        }
}
