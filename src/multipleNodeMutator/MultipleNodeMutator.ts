import { IMutatableNode } from "../../interfaces/IMutatableNode";

import { MutationResult } from "../../DTOs/MutationResult";
import { SourceObject } from "../../DTOs/SourceObject";
import { FileObject } from "../../DTOs/FileObject";
import { MAttemptFail } from "../../DTOs/MAttemptFail";

import { MutationFactory } from "../mutationFactory/MutationFactory";
import { MutationResultManager } from "../mutationResultManager/MutationResultManager";
import { ConfigManager } from "../configManager/ConfigManager";
import { SourceCodeHandler } from "../SourceCodeHandler/SourceCodeHandler";
import { Cleaner } from "../cleanup/Cleaner";
import { FileHandler } from "../FileHandler/FileHandler";
import { MochaTestRunner } from "../mocha-testRunner/Mocha-TestRunner";
import { Worker } from "../Worker";

export class MultipleNodeMutator {
      private outputStoreManager: MutationResultManager;
      private mochaRunner: MochaTestRunner;
      private sourceCodeHandler: SourceCodeHandler;
      private fileHandler: FileHandler;
      private currentNode: IMutatableNode;
      private srcFile: string;
      private testFile: string;
      private errorString: string;

      constructor () {
            const configManager = new ConfigManager();
            this.outputStoreManager = new MutationResultManager();
      }

      public setCurrentNode (node: IMutatableNode) {
            this.currentNode = node;
      }

      public async mutateSingleNode () {
            const mutationOptions = MutationFactory.getMultipleMutations(this.currentNode.syntaxType);
            for (let i = 0; i < mutationOptions.length; i++) {
                  await this.doSingleMutation(mutationOptions[i]);
            }
            Worker.workerResults.push(MutationResultManager.mutationResults);
      }

      private async doSingleMutation (mutationOption: string) {
            this.outputStoreManager.setCurrentMutationResult(
                  new MutationResult(ConfigManager.filePath, this.currentNode.parentFileName)
            );
            this.setFileInformation();
            if (!this.createSourceCodeHandler()) {
                  this.outputStoreManager.getCurrentMutationResult().mutationAttemptFailure =
                  new MAttemptFail(
                        this.errorString,
                        this.currentNode.syntaxType.toString() + " => " +
                        mutationOption,
                        this.currentNode
                  );
            } else {
                  this.setSourceCodeInformation(mutationOption);
                  this.createMutatedFiles();
                  this.mochaRunner = new MochaTestRunner(ConfigManager.runnerConfig);
                  await this.mochaRunner.runTests(this.outputStoreManager, this.testFile);
                  this.cleanFiles();
            }
            this.outputStoreManager.setMutationResultData(this.testFile, this.currentNode, this.sourceCodeHandler);
            this.outputStoreManager.addMutationResultToList();
      }

      private setFileInformation () {
            const fileObject = new FileObject(this.currentNode.parentFileName);
            fileObject.coreNumber = process.pid;
            this.fileHandler = new FileHandler(fileObject);
      }

      private createSourceCodeHandler (): boolean {
            try {
                  this.sourceCodeHandler = new SourceCodeHandler(new SourceObject(this.fileHandler.getSourceObject()));
                  return true;
            }catch (error) {
                  this.errorString = "Could not create source code handler: " + error;
                  console.log(this.errorString);
                  return false;
            }
      }

      private setSourceCodeInformation (mutationOptions: string) {
            this.sourceCodeHandler.resetModified();
            this.sourceCodeHandler.modifyCode(this.currentNode, mutationOptions);
      }

      private createMutatedFiles () {
            this.srcFile = this.fileHandler.writeTempSourceModifiedFile(
                  this.sourceCodeHandler.getModifiedSourceCode());
            this.testFile = this.fileHandler.createTempTestModifiedFile();
      }

      private cleanFiles () {
            Cleaner.deleteTestFile(this.testFile);
            Cleaner.deleteSourceFile(this.srcFile);
      }
}
