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
            const configManager = new ConfigManager();
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
                  new MutationResult(ConfigManager.filePath, this.currentNode.parentFileName)
            );
            this.setFileInformation();
            if (!this.createSourceCodeModifier()) {
                  this.mutationResultManager.getCurrentMutationResult().mutationAttemptFailure =
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
                  await this.mochaRunner.runTests(this.mutationResultManager, this.testFile);
                  this.cleanFiles();
            }
            this.mutationResultManager.setCurrentSourceCodeModifierAndSourceObj(this.sourceCodeModifier);
            this.mutationResultManager.setMutationResultData(this.testFile, this.currentNode);
            this.mutationResultManager.addMutationResultToList();
      }

      private setFileInformation () {
            const fileObject = new FileObject(this.currentNode.parentFileName);
            fileObject.coreNumber = process.pid;
            this.fileHandler = new FileHandler(fileObject);
      }

      private createSourceCodeModifier (): boolean {
            try {
                  this.sourceCodeModifier =
                  new SourceCodeModifier(new SourceObject(this.fileHandler.getSourceObject()));
                  return true;
            }catch (error) {
                  this.errorString = "Could not create source code modifier: " + error;
                  console.log(this.errorString);
                  return false;
            }
      }

      private setSourceCodeInformation (mutationOptions: string) {
            this.sourceCodeModifier.resetModified();
            this.sourceCodeModifier.modifyCode(this.currentNode, mutationOptions);
      }

      private createMutatedFiles () {
            this.srcFile = this.fileHandler.writeTempSourceModifiedFile(
                  this.sourceCodeModifier.getModifiedSourceCode());
            this.testFile = this.fileHandler.createTempTestModifiedFile();
      }

      private cleanFiles () {
            Cleaner.deleteTestFile(this.testFile);
            Cleaner.deleteSourceFile(this.srcFile);
      }
}
