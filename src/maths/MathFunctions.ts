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
}
