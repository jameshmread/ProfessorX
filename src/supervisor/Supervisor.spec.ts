import { expect } from "chai";
import { mock, when, anyString, anyNumber, verify, instance } from "ts-mockito";

import { Supervisor } from "./Supervisor";
import { MutatableNode } from "../../DTOs/MutatableNode";
import { CreateMutatableNodes } from "../../testUtilities/CreateMutatableNodes";
import { IMutationResult } from "../../interfaces/IMutationResult";
import { IMutationScoresPerFile } from "../../interfaces/IMutationScoresPerFile";
import { ConfigManager } from "../configManager/ConfigManager";
import { ProgressDisplay } from "../progressDisplay/ProgressDisplay";

describe("Supervisor", () => {
    let sup: Supervisor;
    const threadResultsFileOne: IMutationResult = {
        SRC_FILE: "FileOne.ts", mutatedCode: [], mutationType: "",
        mutationAttemptFailure: {
            reasonForFailure: "",
            attemptedMutation: "",
            nodeToBeMutated:
            CreateMutatableNodes.createMutatableNodes(1)[0]}, nodeModification: "",
        origionalCode: [], testFilePath: CreateMutatableNodes.testPath,
        targetNode: "", SRC_FILE_PATH: "/src/FileOne.ts"
    };
    const threadResultsFileTwo: IMutationResult = {
        SRC_FILE: "FileTwo.ts", mutatedCode: [],  mutationType: "",
        mutationAttemptFailure: {
            reasonForFailure: "",
            attemptedMutation: "",
            nodeToBeMutated:
            CreateMutatableNodes.createMutatableNodes(1)[0]}, nodeModification: "",
        origionalCode: [], testFilePath: CreateMutatableNodes.testPath,
        targetNode: "", SRC_FILE_PATH: "/src/FileTwo.ts"
    };
    const threadResultsFileThree: IMutationResult = {
        SRC_FILE: "FileThree.ts", mutatedCode: null,  mutationType: "",
        mutationAttemptFailure: {
            reasonForFailure: "",
            attemptedMutation: "",
            nodeToBeMutated:
            CreateMutatableNodes.createMutatableNodes(1)[0]}, nodeModification: "",
        origionalCode: [], testFilePath: CreateMutatableNodes.testPath,
        targetNode: "", SRC_FILE_PATH: "/src/FileThree.ts"
    };
    const fileOneMutatableNode = new MutatableNode(1, { pos: 1, end: 2 }, "FileOne.ts",
        "/src/FileOne.ts", "./FileOne.ts", "");
    const fileTwoMutatableNode = new MutatableNode(1, { pos: 1, end: 2 }, "FileTwo.ts",
        "/src/FileTwo.ts", "./FileTwo.ts", "");
    const fileThreeMutatableNode = new MutatableNode(1, { pos: 1, end: 2 }, "FileThree.ts",
        "/src/FileThree.ts", "./FileThree.ts", "");

    beforeEach(() => {
        sup = new Supervisor([fileOneMutatableNode]);
        ConfigManager.filesToMutate = [];
        mockOutProgressDisplay(sup);
    });

    it("should return one file with a count of surviving + all mutations", () => {
        ConfigManager.filesToMutate = ["FileOne.ts"];
        sup.threadResults = [threadResultsFileOne];
        expect(sup.getIndividualFileResults()).to.eql({
            files: ["FileOne.ts"],
            mutantsSurvivedForEach: [1],
            totalMutationsForEach: [1]
        });
    });

    it("should return one files with a count of surviving + all mutations when given 2 results", () => {
        ConfigManager.filesToMutate = ["FileOne.ts"];
        sup = new Supervisor(
            [fileOneMutatableNode, fileOneMutatableNode]);
        mockOutProgressDisplay(sup);
        sup.threadResults = [threadResultsFileOne, threadResultsFileOne];
        expect(sup.getIndividualFileResults()).to.eql({
            files: ["FileOne.ts"],
            mutantsSurvivedForEach: [2],
            totalMutationsForEach: [2]
        });
    });

    it(`should return two files with a count of surviving +
    all mutations when given 2 different results`, () => {
        ConfigManager.filesToMutate = ["FileOne.ts", "FileTwo.ts"];
        sup = new Supervisor([fileOneMutatableNode, fileTwoMutatableNode]);
        mockOutProgressDisplay(sup);
        sup.threadResults = [threadResultsFileOne, threadResultsFileTwo];
        expect(sup.getIndividualFileResults()).to.eql({
            files: ["FileOne.ts", "FileTwo.ts"],
            mutantsSurvivedForEach: [1, 1],
            totalMutationsForEach: [1, 1]
        });
    });

    it(`should return three files with a count of surviving +
    all mutations when given 3 different results`, () => {
        ConfigManager.filesToMutate = ["FileOne.ts", "FileTwo.ts", "FileThree.ts"];
        sup = new Supervisor([fileOneMutatableNode, fileTwoMutatableNode, fileThreeMutatableNode]);
        sup.threadResults = [threadResultsFileOne, threadResultsFileTwo, threadResultsFileOne, threadResultsFileThree];
        mockOutProgressDisplay(sup);
        expect(sup.getIndividualFileResults()).to.eql({
            files: ["FileOne.ts", "FileTwo.ts", "FileThree.ts"],
            mutantsSurvivedForEach: [2, 1, 0],
            totalMutationsForEach: [2, 1, 1]
        });
    });

    it("should return the overall mutation score of 0 when given 0 individual file results", () => {
        ConfigManager.filesToMutate = ["FileOne.ts"];
        sup = new Supervisor(
            [fileOneMutatableNode, fileOneMutatableNode]);
        sup.individualFileResults = {
            files: ["One.ts"],
            mutantsSurvivedForEach: [0],
            totalMutationsForEach: [0]
        };
        expect(sup.getOverallMutationScore()).to.eql({
            totalKilledMutants: 0,
            totalSurvivingMutants: 0,
            mutationScore: 0
        });
    });

    it("should return the overall mutation score of 100 when given 0 survived and 1 totalmutations", () => {
        ConfigManager.filesToMutate = ["FileOne.ts"];
        sup = new Supervisor(
            [fileOneMutatableNode, fileOneMutatableNode]);
        sup.individualFileResults = {
            files: ["One.ts"],
            mutantsSurvivedForEach: [0],
            totalMutationsForEach: [1]
        };
        expect(sup.getOverallMutationScore()).to.eql({
            totalKilledMutants: 1,
            totalSurvivingMutants: 0,
            mutationScore: 100
        });
    });

    it("should return the overall mutation score of 50 when given 1 survived and 2 totalmutations", () => {
        ConfigManager.filesToMutate = ["FileOne.ts"];
        sup = new Supervisor(
            [fileOneMutatableNode, fileOneMutatableNode]);
        sup.individualFileResults = {
            files: ["One.ts"],
            mutantsSurvivedForEach: [1],
            totalMutationsForEach: [2]
        };
        expect(sup.getOverallMutationScore()).to.eql({
            totalKilledMutants: 1,
            totalSurvivingMutants: 1,
            mutationScore: 50
        });
    });

    it("should return the overall mutation score of 100 when given 0, 0 survived and 10, 10 totalmutations", () => {
        ConfigManager.filesToMutate = ["FileOne.ts"];
        sup = new Supervisor(
            [fileOneMutatableNode, fileOneMutatableNode]);
        sup.individualFileResults = {
            files: ["One.ts", "Two.ts"],
            mutantsSurvivedForEach: [0, 0],
            totalMutationsForEach: [10, 10]
        };
        expect(sup.getOverallMutationScore()).to.eql({
            totalKilledMutants: 20,
            totalSurvivingMutants: 0,
            mutationScore: 100
        });
    });

    it("should return the overall mutation score of 40 when given 1, 0, 2 survived and 1, 2, 2 totalmutations", () => {
        ConfigManager.filesToMutate = ["FileOne.ts"];
        sup = new Supervisor(
            [fileOneMutatableNode, fileOneMutatableNode]);
        sup.individualFileResults = {
            files: ["One.ts", "Two.ts", "Three.ts"],
            mutantsSurvivedForEach: [1, 0, 2],
            totalMutationsForEach: [1, 2, 2]
        };
        expect(sup.getOverallMutationScore()).to.eql({
            totalKilledMutants: 2,
            totalSurvivingMutants: 3,
            mutationScore: 40
        });
    });
});

function mockOutProgressDisplay (sup: Supervisor) {
    const progressDisplayMock = mock(ProgressDisplay);
    const progressDisplayInstance = instance(progressDisplayMock);
    sup.progressDisplay = progressDisplayInstance;
    when(progressDisplayMock.createProgressBar(anyString(), anyNumber())).thenReturn(void 0);
}
