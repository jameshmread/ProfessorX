import { IMutationAttemptFailure } from "../interfaces/IMutationAttemptFailure";
import { IMutatableNode } from "../interfaces/IMutatableNode";

export class MAttemptFail implements IMutationAttemptFailure {

      constructor (
            public reasonForFailure: string,
            public attemptedMutation: string,
            public nodeToBeMutated: IMutatableNode
      ){}
}
