import { OutputStore } from "./OutputStore";

export class EndResult {

    constructor (
        public readonly runner: string,
        public readonly runnerConf: Object,
        public readonly duration: IDurationFormat,
        public readonly results: Array<OutputStore>
    ){}
}
