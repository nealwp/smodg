import ts from 'typescript';
import { snakeCase } from './formatters';

export const generateModelInputs = (fileContent: string, schemaName: string) => {
    const tokens = readTokensFromSource(fileContent);
    const { modelName, types } = parseTypeObjects(tokens)
    
    let columnDecorators = ``
    let columnDefinitions = ``

    types.forEach(obj => {
        columnDecorators = `${columnDecorators}\n\t@Column(columnDefinition.${obj.key})\n\t${obj.key}!: ${obj.type}\n`
        columnDefinitions = `${columnDefinitions}\t${obj.key}: {\n\tfield: '${snakeCase(obj.key)}',\n\ttype: DataType.${getSequelizeType(obj.type)}\n\t},\n`
    })

    const tableDefinition = generateTableDefinition(modelName, schemaName)

    return {modelName, columnDecorators, columnDefinitions, tableDefinition}

}

const generateTableDefinition = (modelName: string, schemaName: string) => {
   return `\ttableName: '${snakeCase(modelName)}', ${schemaName ? `\n\tschema: '${snakeCase(schemaName)}',`: ''}` 
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
    let modelName = ''
    const allowedDatatypes = ['StringKeyword', 'NumberKeyword', 'BooleanKeyword', 'Identifier']

    for (const token of tokens) {
        if (skipIdentifier) {
            if (token.kind === 'Identifier') {
                if (!modelName) {
                    modelName = token.text;
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

    return { modelName, types };
}

const getSequelizeType = (jsType: string) => {
    switch (jsType) {
        case 'string':
            return 'STRING'
        case 'boolean':
            return 'BOOLEAN'
        case 'Date':
            return 'DATE'
        case 'number':
            return 'FLOAT'
        default:
            break;
    }
}

export {
    readTokensFromSource,
	parseTypeObjects,
	getSequelizeType,
	generateTableDefinition
}
