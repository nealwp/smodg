import ts from 'typescript';

const generateModel = (fileContent: string) => {
    const tokens = readTokensFromSource(fileContent);
    const types = parseTypeObjects(tokens)

    let modelString = ''
    types.forEach(obj => {
        modelString = `${modelString}@Column({ field: '${snakeCase(obj.key)}', type: Sequelize.${getSequelizeType(obj.type)} })\n${obj.key}!: ${obj.type}\n\n`
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
    const result: { key: string, type: string }[] = [];
    let skipIdentifier = true;
  
    for (const token of tokens) {
      if (skipIdentifier) {
        if (token.kind === 'Identifier') {
          skipIdentifier = false;
        }
        continue;
      }
  
      if (token.kind === 'ColonToken') {
        const typeToken = tokens[tokens.indexOf(token) + 1];
        const propertyToken = tokens[tokens.indexOf(token) - 1];
        if (typeToken.kind === 'StringKeyword') {
          result.push({ key: propertyToken.text, type: typeToken.text });
        }
        skipIdentifier = true;
      }
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

const snakeCase = (str: string) => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export { generateModel, readTokensFromSource, parseTypeObjects, snakeCase }