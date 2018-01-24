import { IMutatableNode } from "./IMutatableNode";

export interface IMutationAttemptFailure {
      reasonForFailure: string;
      attemptedMutation: string;
      nodeToBeMutated: IMutatableNode;
}
