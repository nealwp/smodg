import ts from 'typescript';

const generateModel = (fileContent: string) => {
    const tokens = readTokensFromSource(fileContent);
    const types = parseTypeObjects(tokens)

    let modelString = ''
    types.forEach(obj => {
        modelString = `${modelString}@Column({ field: '${obj.key}', type: Sequelize.${getSequelizeType(obj.type)} })\n${obj.key}!: ${obj.type}\n\n`
    })

    return modelString
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
    let result: { key: string, type: string }[] = [];
    let index = 0;
    while (index < tokens.length) {
        if (tokens[index].kind === "TypeKeyword" && tokens[index].text === "type") {
            const keyIndex = index + 1;
            let skipNextIdentifier = true;
            let key = "";
            let type = "";
            for (let i = keyIndex; i < tokens.length; i++) {
                if (tokens[i].kind === "Identifier" && skipNextIdentifier) {
                    skipNextIdentifier = false;
                } else if (tokens[i].kind === "Identifier") {
                    key = tokens[i].text;
                    break;
                }
            }
            const typeIndex = index + 1;
            for (let i = typeIndex; i < tokens.length; i++) {
                if (tokens[i].kind === "StringKeyword") {
                    type = tokens[i].text;
                    break;
                }
            }
            result.push({ key, type });
        }
        index++;
    }
    return result;
}

const getSequelizeType = (jsType: string) => {
    switch (jsType) {
        case 'string':
            return 'STRING'
        default:
            break;
    }
}

export { generateModel, readTokensFromSource, parseTypeObjects }