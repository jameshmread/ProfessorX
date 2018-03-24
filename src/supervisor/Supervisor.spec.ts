import { expect } from "chai";
import { Supervisor } from "./Supervisor";
import { MutatableNode } from "../../DTOs/MutatableNode";
import { CreateMutatableNodes } from "../../testUtilities/CreateMutatableNodes";
import { IMutationResult } from "../../interfaces/IMutationResult";
import { ConfigManager } from "../configManager/ConfigManager";

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
        ConfigManager.filesToMutate = [];
    });

    it("should return one file object with a count of surviving + all mutations", () => {
        ConfigManager.filesToMutate = ["FileOne.ts"];
        sup.threadResults = [threadResultsFileOne];
        expect(sup.getIndividualFileResults()).to.eql({
            files: ["FileOne.ts"],
            mutantsSurvivedForEach: [1],
            totalMutationsForEach: [1]
        });
    });

    it("should return one file object with a count of surviving + all mutations when given 2 results", () => {
        ConfigManager.filesToMutate = ["FileOne.ts"];
        sup = new Supervisor(
            [fileOneMutatableNode, fileOneMutatableNode]);
        sup.threadResults = [threadResultsFileOne, threadResultsFileOne];
        expect(sup.getIndividualFileResults()).to.eql({
            files: ["FileOne.ts"],
            mutantsSurvivedForEach: [2],
            totalMutationsForEach: [2]
        });
    });

    it(`should return two file objects with a count of surviving +
    all mutations when given 2 different results`, () => {
        ConfigManager.filesToMutate = ["FileOne.ts", "FileTwo.ts"];
        sup = new Supervisor([fileOneMutatableNode, fileTwoMutatableNode]);
        sup.threadResults = [threadResultsFileOne, threadResultsFileTwo];
        expect(sup.getIndividualFileResults()).to.eql({
            files: ["FileOne.ts", "FileTwo.ts"],
            mutantsSurvivedForEach: [1, 1],
            totalMutationsForEach: [1, 1]
        });
    });
});
