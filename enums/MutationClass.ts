export enum MutationClass {
    NumericLiteral_ConstantChange = "Modification of Numeric Literal",
    Block_Empty = "Remove all content from a block of code",
    Block_Null = "Remove all content from a block of code and replace with null",
    Binary_Substitution = "Replacing one Binary Operator with another",
    Boolean_Substitution = "Inverting a Boolean",
    MethodVisibility_Modifier = "Changing the scope / visibility of a method",
    Unary_Substitution = "Replacing one Unary Operator with another",
    Parenthesis_Removal = "Removal of Parenthesis in a statement",
    Return_Null = "Modifying a Return Statement to return null"
}
