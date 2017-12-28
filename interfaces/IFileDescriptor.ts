import { FileObject } from "../DTOs/FileObject";
import { FileHandler } from "../src/FileHandler/FileHandler";
import { SourceObject } from "../DTOs/SourceObject";
import { CodeInspector } from "../src/CodeInspector/CodeInspector";

export interface IFileDescriptor {
    fileName: string;
    fileObject: FileObject;
    fileHandler: FileHandler;
    sourceObject: SourceObject;
    codeInspector: CodeInspector;
}
