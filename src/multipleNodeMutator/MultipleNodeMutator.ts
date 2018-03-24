import { IMutatableNode } from "../../interfaces/IMutatableNode";

import { MutationResult } from "../../DTOs/MutationResult";
import { SourceObject } from "../../DTOs/SourceObject";
import { FileObject } from "../../DTOs/FileObject";
import { MAttemptFail } from "../../DTOs/MAttemptFail";

import { MutationFactory } from "../mutationFactory/MutationFactory";
import { MutationResultManager } from "../mutationResultManager/MutationResultManager";
import { ConfigManager } from "../configManager/ConfigManager";
import { SourceCodeModifier } from "../sourceCodeModifier/SourceCodeModifier";
import { Cleaner } from "../cleanup/Cleaner";
import { FileHandler } from "../FileHandler/FileHandler";
import { MochaTestRunner } from "../mocha-testRunner/Mocha-TestRunner";
import { Worker } from "../Worker";
import { Logger } from "../logging/Logger";
import { Config } from "../../DEVCONFIG";


export class MultipleNodeMutator {

      private mutationResultManager: MutationResultManager;
      private mochaRunner: MochaTestRunner;
      private sourceCodeModifier: SourceCodeModifier;
      private fileHandler: FileHandler;
      private currentNode: IMutatableNode;
      private srcFile: string;
      private testFile: string;
      private errorString: string;

      constructor () {
            const configManager = new ConfigManager(Config.NEST);
            // CANNOT import from ProffessorX main class as this recursivley restarts the program
            // will need to wait till commandline instansiation is implemented
            this.mutationResultManager = new MutationResultManager();
      }

      public setCurrentNode (node: IMutatableNode) {
            this.currentNode = node;
      }

      public async mutateSingleNode () {
            const mutationOptions = MutationFactory.getAllMutations(this.currentNode);
            for (let i = 0; i < mutationOptions.length; i++) {
                  await this.doSingleMutation(mutationOptions[i]);
            }
            Worker.workerResults.push(MutationResultManager.mutationResults);
      }

      private async doSingleMutation (mutationOption: string) {
            this.mutationResultManager.setCurrentMutationResult(
                  new MutationResult(ConfigManager.filePath, this.currentNode.parentFilePath)
            );
            this.setFileInformation();
            if (!this.createSourceCodeModifier()) {
                  this.mutationResultManager.getCurrentMutationResult().mutationAttemptFailure =
                  new MAttemptFail(
                        this.errorString,
                        this.currentNode.syntaxType.toString() + "  -->  " +
                        mutationOption,
                        this.currentNode
                  );
            } else {
                  this.setSourceCodeInformation(mutationOption);
                  this.createMutatedFiles();

                  this.mochaRunner = new MochaTestRunner(ConfigManager.runnerConfig);
                  await this.mochaRunner.runTests(this.mutationResultManager, this.testFile)
                  .then((resolve) =>
                        {
                              if (resolve === "survived" || this.errorString.length > 0) {
                                    this.commitSurvivingMutant();
                              } else if (resolve === "killed" || this.errorString.length > 0) {
                                    this.commitKilledMutant();
                              } else {
                                    this.commitErroredMutant("Mocha Errored.");
                              }
                              this.mutationResultManager.setCurrentMutationResult(void 0);
                        });
                  this.cleanFiles();
            }
      }

      private setFileInformation (): void {
            const fileObject = new FileObject(this.currentNode.parentFilePath, this.currentNode.associatedTestFilePath);
            fileObject.coreNumber = process.pid;
            this.fileHandler = new FileHandler(fileObject);
      }

      private createSourceCodeModifier (): boolean {
            this.errorString = "";
            try {
                  this.sourceCodeModifier =
                  new SourceCodeModifier(new SourceObject(this.fileHandler.getSourceObject()));
                  return true;
            }catch (error) {
                  this.errorString = "Could not create source code modifier: " + error;
                  Logger.warn("Multiple Node Mutator could not create source code modifier ", this.errorString);
                  Logger.warn("Current info", this);
                  return false;
            }
      }

      private commitSurvivingMutant (): void {
            this.mutationResultManager.setCurrentSourceCodeModifierAndSourceObj(
                  this.sourceCodeModifier);
            this.mutationResultManager.setMutationResultData(this.testFile, this.currentNode);
            this.mutationResultManager.addMutationResultToList();
      }

      private commitKilledMutant (): void {
            this.mutationResultManager.addMutationResultToList();
      }

      private commitErroredMutant (errorReason: string) : void {
            this.mutationResultManager.setMutationResultData(this.testFile, this.currentNode);
            this.mutationResultManager.getCurrentMutationResult().mutationAttemptFailure =
            new MAttemptFail("Mutant Errored Due to: " + errorReason, "Unknown", this.currentNode);
            this.mutationResultManager.addMutationResultToList();
      }

      private setSourceCodeInformation (mutationOptions: string): void {
            this.sourceCodeModifier.resetModified();
            this.sourceCodeModifier.modifyCode(this.currentNode, mutationOptions);
      }

      private createMutatedFiles (): void {
            this.srcFile = this.fileHandler.writeTempSourceModifiedFile(
                  this.sourceCodeModifier.getModifiedSourceCode());
            this.testFile = this.fileHandler.createTempTestModifiedFile();
      }

      private cleanFiles (): void {
            Cleaner.deleteTestFile(this.testFile);
            Cleaner.deleteSourceFile(this.srcFile);
      }
}
