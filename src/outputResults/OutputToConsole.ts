import { EndResult } from "../../DTOs/EndResult";
import { MathFunctions } from "../maths/MathFunctions";
import { basename } from "path";
import { ConfigManager } from "../configManager/ConfigManager";

export class OutputToConsole {

      private static mutationResults: EndResult;

      public static printResults (endResult: EndResult) {
            this.mutationResults = endResult;
            this.printTotalMutationScore();
            this.printIndividualFileResults();
      }

      private static printTotalMutationScore () {
            console.log("Mutation Score:", this.mutationResults.overallScores.mutationScore);
            console.log("");
      }

      private static printIndividualFileResults () {
            console.table(this.createTableFormat());
      }

      private static createTableFormat () {
            const tableResults = [];
            for (let i = 0; i < this.mutationResults.mutationScoresPerFile.files.length; i++) {
                  const killedMutants =
                  this.mutationResults.mutationScoresPerFile.totalMutationsForEach[i] -
                  this.mutationResults.mutationScoresPerFile.mutantsSurvivedForEach[i];
                  tableResults.push({
                        "File Name": basename(this.mutationResults.mutationScoresPerFile.files[i]),
                        "Mutation Score": MathFunctions.calculatePercentage(killedMutants,
                              this.mutationResults.mutationScoresPerFile.totalMutationsForEach[i]),
                        "Killed Mutants": killedMutants,
                        "Surviving Mutants" : this.mutationResults.mutationScoresPerFile.mutantsSurvivedForEach[i]
                  });
            }
            return tableResults;
      }
}
