import ts from 'typescript'
import minimist from 'minimist'
import fs from 'node:fs'

const tokenize = (sourceCode: string) => {
    const sourceFile = ts.createSourceFile("_test.ts", sourceCode, ts.ScriptTarget.Latest)

    let typeDeclarations: any = []
    let child = 0;
    ts.forEachChild(sourceFile, function recur(node) {
        console.log(child += 1)
        // this will get called when the node is a `type`
        if (ts.isTypeAliasDeclaration(node)) {
            let tokens: { text: string, kind: string }[] = [];
            const scanner = ts.createScanner(ts.ScriptTarget.Latest, true);
           // will need this write types into model file 
            console.log(node.getText(sourceFile)) 
            scanner.setText(node.getText(sourceFile));
            let token = scanner.scan();
            while (token !== ts.SyntaxKind.EndOfFileToken) {
                //console.log(ts.SyntaxKind[token]) 
                tokens.push({
                    text: scanner.getTokenText(),
                    kind: ts.SyntaxKind[token],
                });
                token = scanner.scan();
            }
            typeDeclarations.push(tokens)
        } else {
            ts.forEachChild(node, recur);
        }
    });
    console.log(typeDeclarations);
}

const args = minimist(process.argv.slice(2), {
    stopEarly: true,
    boolean: true
}) 

const filePath = args._[0]
const fileContents = fs.readFileSync(filePath, 'utf-8')
tokenize(fileContents)

