export class ProgressDisplay {

    public static mutationProgressBar;
    public static summaryProgressBar;

    constructor () {
        // ProgressDisplay.createProgressBar();
    }

    public static createProgressBar (barFormat: string, length: number) {
        const green = "\u001b[42m \u001b[0m";
        const red = "\u001b[41m \u001b[0m";
        const ProgressBar = require("node-progress-3");
        // only works using require syntax
        const bar = new ProgressBar({
            format: barFormat,
            complete: green,
            incomplete: red,
            total: length,
            width: 60
        });
        bar.onComplete = () => { console.log(""); };
        return bar;
    }

    public static tickBar (bar) {
        bar.tick(1);
    }
}
