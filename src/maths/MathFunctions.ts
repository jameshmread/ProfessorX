export class MathFunctions {

    public static divideItemsAmongArrays (input: Array<any>, divisionLength: number): Array<Array<any>> {
        const dividedResults = new Array<Array<any>>();
        for (let i = 0; i < input.length; i++) {
            if (dividedResults[i] === void 0 && i < divisionLength) {
                dividedResults[i % divisionLength] = [];
            }
            dividedResults[i % divisionLength].push(input[i]);
        }
        return dividedResults;
    }
    public static calculateRunTime (runTime: number): IDurationFormat {
        /*
        convert millis to date time adapted from
        https://gist.github.com/remino/1563878
        */
        let ms = runTime;
        ms = ms % 1000;
        let s = Math.floor(runTime / 1000);
        let m = Math.floor(s / 60);
        s = s % 60;
        let h = Math.floor(m / 60);
        m = m % 60;
        const d = Math.floor(h / 24);
        h = h % 24;
        return { d, h, m, s, ms };
    }
}
