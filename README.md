<h1 align="center"> ProfessorX </h1>

<p align="center">
<img src="https://travis-ci.org/jameshmread/ProfessorX.svg?branch=master">

<img src="https://api.codacy.com/project/badge/Grade/befa3c5cfe664470b38d161d29990b4b"/>

<img src='https://bettercodehub.com/edge/badge/jameshmread/ProfessorX?branch=master'>
</p>
<p align="center">
<img src="https://snyk.io/test/github/jameshmread/professorx/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/jameshmread/professorx" style="max-width:100%;">
</p>

<h4 align="center">
A Typescript Mutation Testing program designed to give an indication to the quality of the tests in a project.
</h4>
<br>

<h3> Using the Professor X Configuration File </h3>

- **filePath** `string`
  - The relative path from the **configuration file** location to the target project directory.
- **mutateAllFiles** `boolean`
  - True: All files in the `filesToMutate` directory will be included. **Overrides** `filesToSkip`.
  - False: Uses the `filesToMutate` and `filesToSkip` options to specify files to include / not.
- **filesToMutate** `Array<string>`
  - A list of files in the `filePath` directory to be targeted by the mutation tester.
- **filesToSkip** `Array<string>`
  - A list of files in the `filePath` directory to be **skipped** by the mutation tester.
  - If files are mentioned in **both** `mutateAllFiles` and `filesToSkip`, they will **not** be included to mutate.

- **testRunner** `string`
  - The test runner you are using in your project. **Note**. Currently only Mocha is supported.
- **runnerConfig** `Object`
  - An object containing the runner configuration for the test runner.
  - This is used by the test runner itself so see the configuration for your chosen test runner.
  - Mocha Runner Config Options can be found here https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
  - **WARNING** : Not all of these options have been tested and so may cause issues.
    
<h3> Example Configuration File. </h3> 

`profx.config.ts`

```Typescript
export class Config {
    public static readonly CONFIG = {
        filePath: "./testProject/src/",
        mutateAllFiles: false,
        filesToMutate: [
            "HelloWorld.ts",
            "FileTwo.ts",
            "SkipMe.ts"
        ],
        filesToSkip: ["SkipMe.ts"],
        testRunner: "mocha",
        runnerConfig: {
            reporter: "dot"
        }
    };
}

```
