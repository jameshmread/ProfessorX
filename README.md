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
<h4 align="center">
This is the main development fork of Professor X
</h4>
<br>

<h3> Using the Professor X Configuration File </h3>

- **filePath** `string`
  - The relative file path from this config file to the root of the **source** file directory.
- **testFilePath** `string`
  - The relative file path from this config file to the root of the **test** file directory.
- **testFileExtension** `string`
  - The file extension which is on all tests in the project. (e.g. a test file called `HelloWorld.spec.ts` would give the **testFileExtension** of `.spec`
- **mutateAllFiles** `boolean`
  - `True`: All files found in the **filePath** root directory will be included. All directories and files from this root will also be recursively included. `filesToSkip` will remove selected files from the list.
  - `False`: Uses the `filesToMutate` section. Ignores `filesToSkip`.
- **filesToMutate** `Array<string>`
  - A list of files in the `filePath` directory to be targeted by the mutation tester.
- **filesToSkip** `Array<string>`
  - A list of files in the `filePath` directory to be **skipped** by the mutation tester.

- **testRunner** `string`
  - The test runner you are using in your project. **Note**. Currently only Mocha is supported.
- **runnerConfig** `Object`
  - An object containing the runner configuration for the test runner.
  - This is used by the test runner itself so see the configuration for your chosen test runner.
  - Mocha Runner Config Options can be found here https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
  - **WARNING** : Not all of these options have been tested and so may cause issues.
    
- **outputFormat** `Array<string>`
  - The type of output the algorithm should produce.
  - Current options are:
    - `console`: Produces a "Per File" output in the console after analysis.
    - `app` : Produces a JSON file for the Professor X - App.
<h3> Example Configuration File. </h3> 

`profx.config.ts`

```Typescript
export class Config {
        public static readonly CONFIG = {
        filePath: "./testProject/src/",
        testFilePath: "./testProject/src/",
        testFileExtension: ".spec",
        mutateAllFiles: false,
        filesToMutate: ["HelloWorld.ts"],
        filesToSkip: ["FileTwo.ts"],
        testRunner: "mocha",
        runnerConfig: {
            reporter: "dot"
        },
        outputFormat: ["console", "app"]
    };
}

```
