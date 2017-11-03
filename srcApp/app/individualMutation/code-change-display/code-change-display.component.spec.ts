import { CodeChangeDisplayComponent } from "./code-change-display.component";

describe("CodeChangeDisplayComponent", () => {
  let ccdc: CodeChangeDisplayComponent;

  beforeEach(() => {
    ccdc = new CodeChangeDisplayComponent();
  });

  it("should return line numbers ordered 1,2 when given 2,1", () => {
    ccdc.codeObject = [{
      lineNumber: 2,
      sourceFile: "s",
      origionalCode: "a+b",
      mutatedCode: "a - b"
    },
    {
      lineNumber: 1,
      sourceFile: "s",
      origionalCode: "a+2",
      mutatedCode: "a-2"
    }
    ];
    ccdc.sortCodeByLineNumber();
    expect(ccdc.codeObject[0].lineNumber).toEqual(1);
    expect(ccdc.codeObject[1].lineNumber).toEqual(2);
  });

  it("should return line numbers ordered 1,2 when given 1, 2", () => {
    ccdc.codeObject = [{
      lineNumber: 1,
      sourceFile: "s",
      origionalCode: "a+b",
      mutatedCode: "a - b"
    },
    {
      lineNumber: 2,
      sourceFile: "s",
      origionalCode: "a+2",
      mutatedCode: "a-2"
    }
    ];
    ccdc.sortCodeByLineNumber();
    expect(ccdc.codeObject[0].lineNumber).toEqual(1);
    expect(ccdc.codeObject[1].lineNumber).toEqual(2);
  });

  it("should return line numbers ordered 1,2,3 when given 2,3,1", () => {
    ccdc.codeObject = [{
      lineNumber: 2,
      sourceFile: "s",
      origionalCode: "a+b",
      mutatedCode: "a - b"
    },
    {
      lineNumber: 3,
      sourceFile: "s",
      origionalCode: "a+2",
      mutatedCode: "a-2"
    },
    {
      lineNumber: 1,
      sourceFile: "s",
      origionalCode: "a+2",
      mutatedCode: "a-2"
    }
    ];
    ccdc.sortCodeByLineNumber();
    expect(ccdc.codeObject[0].lineNumber).toEqual(1);
    expect(ccdc.codeObject[1].lineNumber).toEqual(2);
    expect(ccdc.codeObject[2].lineNumber).toEqual(3);
  });

  it("should return line numbers ordered 1,1 when given 1, 1", () => {
    ccdc.codeObject = [{
      lineNumber: 1,
      sourceFile: "s",
      origionalCode: "a+b",
      mutatedCode: "a - b"
    },
    {
      lineNumber: 1,
      sourceFile: "s",
      origionalCode: "a+2",
      mutatedCode: "a-2"
    }
    ];
    ccdc.sortCodeByLineNumber();
    expect(ccdc.codeObject[0].lineNumber).toEqual(1);
    expect(ccdc.codeObject[1].lineNumber).toEqual(1);
  });
});
