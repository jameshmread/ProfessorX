import { Supervisor } from "./Supervisor";
import { CreateMutatableNodes } from "../../testUtilities/CreateMutatableNodes";
import { IMutationResult } from "../../interfaces/IMutationResult";
import { expect } from "chai";

describe("Supervisor", () => {
    let sup: Supervisor;
    beforeEach(() => {
        sup = new Supervisor(
            CreateMutatableNodes.createMutatableNodes(10));
    });

    it("should return one file name with a count of surviving + all mutations", () => {
        sup.threadResults = [{
            SRC_FILE: CreateMutatableNodes.filename, mutatedCode: [],
            mutationAttemptFailure: {
                reasonForFailure: "",
                attemptedMutation: "",
                nodeToBeMutated:
                CreateMutatableNodes.createMutatableNodes(1)[0]}, nodeModification: "",
            origionalCode: [], testFilePath: CreateMutatableNodes.testPath,
            targetNode: "", SRC_FILE_PATH: CreateMutatableNodes.filePath
        }];
        console.log(sup.getIndividualFileResults());
        expect(sup.getIndividualFileResults()).to.eql([{
            fileName: CreateMutatableNodes.filename,
            totalSurvivingMutants: 1,
            allGeneratedMutationsForFile: 10
        }]);
    });
});
