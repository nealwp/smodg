import ts from 'typescript';

const generateModel = (fileContent: string) => {
    const tokens = readTokensFromSource(fileContent);
    const { tableName, types } = parseTypeObjects(tokens)

    let modelString = ``
    types.forEach(obj => {
        modelString = `${modelString}\t@Column(columnDefinition.${obj.key})\n\t${obj.key}!: ${obj.type}\n\n`
    })

    return modelString + '}\n'
}

const generateColumnDefinition = (fileContent: string) => {
    const tokens = readTokensFromSource(fileContent);
    const { tableName, types } = parseTypeObjects(tokens)

    let modelString = ``
    types.forEach(obj => {
        modelString = `${modelString}\t${obj.key}: {\n\t\tfield: '${snakeCase(obj.key)}',\n\t\ttype: dataType.${getSequelizeType(obj.type)}\n},\n`
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
    const types: { key: string, type: string }[] = [];
    let skipIdentifier = true;
    let tableName = ''
    const allowedDatatypes = ['StringKeyword', 'NumberKeyword', 'BooleanKeyword', 'Identifier']

    for (const token of tokens) {
        if (skipIdentifier) {
            if (token.kind === 'Identifier') {
                if (!tableName) {
                    tableName = token.text;
                }
                skipIdentifier = false;
            }
            continue;
        }

        if (token.kind === 'ColonToken') {
            const typeToken = tokens[tokens.indexOf(token) + 1];
            const propertyToken = tokens[tokens.indexOf(token) - 1];
            if (allowedDatatypes.includes(typeToken.kind)) {
                types.push({ key: propertyToken.text, type: typeToken.text });
            }
            skipIdentifier = true;
        }
    }

    return { tableName, types };
}

const getSequelizeType = (jsType: string) => {
    switch (jsType) {
        case 'string':
            return 'STRING'
        case 'boolean':
            return 'BOOLEAN'
        case 'Date':
            return 'DATETIME'
        case 'number':
            return 'DECIMAL'
        default:
            break;
    }
}

const snakeCase = (str: string) => {
    return str.replace(/[A-Z]/g, (match, index) => {
        if (index === 0) {
          return match.toLowerCase();
        } else if (/[A-Z]/.test(str[index - 1])) {
          return match.toLowerCase();
        } else {
          return `_${match.toLowerCase()}`;
        }
      });
}

export { generateModel, readTokensFromSource, parseTypeObjects, snakeCase, getSequelizeType, generateColumnDefinition }