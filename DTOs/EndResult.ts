import { OutputStore } from "./OutputStore";

export class EndResult {

    public readonly RUNNER: string;
    public readonly RUNNER_CONFIG: Object;

    public readonly RESULTS_ARRAY: Array<OutputStore>;

    constructor (
        runner: string,
        runnerConf: Object,
        results: Array<OutputStore>
    ){
        this.RUNNER = runner;
        this.RUNNER_CONFIG = runnerConf;
        this.RESULTS_ARRAY = results;
    }
}
