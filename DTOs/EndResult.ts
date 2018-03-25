import { MutationResult } from "./MutationResult";
import { IDurationFormat } from "../interfaces/IDurationFormat";
import { IMutationScoresPerFile } from "../interfaces/IMutationScoresPerFile";

export class EndResult {

    constructor (
        public readonly runner: string,
        public readonly runnerConf: Object,
        public readonly duration: IDurationFormat,
        public readonly mutationScoresPerFile: IMutationScoresPerFile,
        public readonly overallScores: {
            totalKilledMutants: number,
            totalSurvivingMutants: number,
            mutationScore: number
        },
        public readonly results: Array<MutationResult>
    ){}
}
