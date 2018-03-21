import { expect } from "chai";
import { Supervisor } from "./Supervisor";
import { MutatableNode } from "../../DTOs/MutatableNode";
import { CreateMutatableNodes } from "../../testUtilities/CreateMutatableNodes";
import { IMutationResult } from "../../interfaces/IMutationResult";

describe("Supervisor", () => {
    let sup: Supervisor;
    const threadResultsFileOne = {
        SRC_FILE: "FileOne.ts", mutatedCode: [],
        mutationAttemptFailure: {
            reasonForFailure: "",
            attemptedMutation: "",
            nodeToBeMutated:
            CreateMutatableNodes.createMutatableNodes(1)[0]}, nodeModification: "",
        origionalCode: [], testFilePath: CreateMutatableNodes.testPath,
        targetNode: "", SRC_FILE_PATH: "/src/FileOne.ts"
    };
    const threadResultsFileTwo = {
        SRC_FILE: "FileTwo.ts", mutatedCode: [],
        mutationAttemptFailure: {
            reasonForFailure: "",
            attemptedMutation: "",
            nodeToBeMutated:
            CreateMutatableNodes.createMutatableNodes(1)[0]}, nodeModification: "",
        origionalCode: [], testFilePath: CreateMutatableNodes.testPath,
        targetNode: "", SRC_FILE_PATH: "/src/FileTwo.ts"
    };
    const fileOneMutatableNode = new MutatableNode(1, { pos: 1, end: 2 }, "FileOne.ts",
        "/src/FileOne.ts", "./FileOne.ts", "");
    const fileTwoMutatableNode = new MutatableNode(1, { pos: 1, end: 2 }, "FileTwo.ts",
        "/src/FileTwo.ts", "./FileTwo.ts", "");

    beforeEach(() => {
        sup = new Supervisor([fileOneMutatableNode]);
    });

    it("should return one file object with a count of surviving + all mutations", () => {
        sup.threadResults = [threadResultsFileOne];
        expect(sup.getIndividualFileResults()).to.eql([{
            fileName: "FileOne.ts",
            mutantsSurvived: 1,
            totalMutationsOnFile: 1
        }]);
    });

    it("should return one file object with a count of surviving + all mutations when given 2 results", () => {
        sup = new Supervisor(
            [fileOneMutatableNode, fileOneMutatableNode]);
        sup.threadResults = [threadResultsFileOne, threadResultsFileOne];
        expect(sup.getIndividualFileResults()).to.eql([{
            fileName: "FileOne.ts",
            mutantsSurvived: 2,
            totalMutationsOnFile: 2
        }]);
    });

    it(`should return two file objects with a count of surviving +
    all mutations when given 2 different results`, () => {
        sup = new Supervisor([fileOneMutatableNode, fileTwoMutatableNode]);
        sup.threadResults = [threadResultsFileOne, threadResultsFileTwo];
        expect(sup.getIndividualFileResults()).to.eql([{
            fileName: "FileOne.ts",
            mutantsSurvived: 1,
            totalMutationsOnFile: 1
        }, {
            fileName: "FileTwo.ts",
            mutantsSurvived: 1,
            totalMutationsOnFile: 1
        }]);
    });
});
