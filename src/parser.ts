import ts from 'typescript';

const generateModel = (fileContent: string) => {
    const tokens = readTokensFromSource(fileContent);
    const types = parseTypeObjects(tokens)
    return types
}


const readTokensFromSource = (sourceCode: string) => {
    const sourceFile = ts.createSourceFile("test.ts", sourceCode, ts.ScriptTarget.Latest);
    let tokens: { text: string, kind: string }[] = [];
    ts.forEachChild(sourceFile, function recur(node) {
        if (ts.isTypeAliasDeclaration(node)) {
        const scanner = ts.createScanner(ts.ScriptTarget.Latest, true);
        scanner.setText(node.getText(sourceFile));
        let token = scanner.scan();
        while (token !== ts.SyntaxKind.EndOfFileToken) {
            tokens.push({
            text: scanner.getTokenText(),
            kind: ts.SyntaxKind[token],
            });
            token = scanner.scan();
        }
        } else {
        ts.forEachChild(node, recur);
        }
    });
    return tokens;
}

const parseTypeObjects = (tokens: { text: string, kind: string }[]) => {
    return tokens
}

export { generateModel, readTokensFromSource }