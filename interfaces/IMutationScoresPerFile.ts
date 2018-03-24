export interface IMutationScoresPerFile {
    files: Array<string>;
    mutantsSurvivedForEach: Array<number>;
    totalMutationsForEach: Array<number>;
}
