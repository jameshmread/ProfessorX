import { MutationResult } from "./MutationResult";
import { IDurationFormat } from "../interfaces/IDurationFormat";

export class EndResult {

    constructor (
        public readonly runner: string,
        public readonly runnerConf: Object,
        public readonly duration: IDurationFormat,
        public readonly fileList: Array<{
            fileName: string, mutantsKilled: number,
            mutantsSurvived: number, fileMutationScore: number
        }>,
        public readonly overallScores: {
            totalKilledMutants: number,
            totalSurvivingMutants: number,
            mutationScore: number
        },
        public readonly results: Array<MutationResult>
    ){}
}
