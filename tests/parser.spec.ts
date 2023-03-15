import { generateModel, readTokensFromSource, parseTypeObjects } from '../src/parser'

describe('parser', () => {

    describe('readTokensFromSource', () => {
        test('should return tokenized file content', () => {
            const fileContent = `export type SmallTest = {\nname: string;\n}`
            
            const expectedOutput = [
                { kind: "ExportKeyword", text: "export" }, 
                { kind: "TypeKeyword", text: "type" }, 
                { kind: "Identifier", text: "SmallTest" }, 
                { kind: "FirstAssignment", text: "=" }, 
                { kind: "FirstPunctuation", text: "{" }, 
                { kind: "Identifier", text: "name" }, 
                { kind: "ColonToken", text: ":" }, 
                { kind: "StringKeyword", text: "string" }, 
                { kind: "SemicolonToken", text: ";" }, 
                { kind: "CloseBraceToken", text: "}" }
            ]

            const tokens = readTokensFromSource(fileContent)
            expect(tokens).toEqual(expectedOutput)
        })
    })

    describe('parseTypeObjects', () => {
        test('should return an array of objects when there is a single type properties', () => {
            const tokens = [
                { kind: "ExportKeyword", text: "export" }, 
                { kind: "TypeKeyword", text: "type" }, 
                { kind: "Identifier", text: "SmallTest" }, 
                { kind: "FirstAssignment", text: "=" }, 
                { kind: "FirstPunctuation", text: "{" }, 
                { kind: "Identifier", text: "name" }, 
                { kind: "ColonToken", text: ":" }, 
                { kind: "StringKeyword", text: "string" }, 
                { kind: "SemicolonToken", text: ";" }, 
                { kind: "CloseBraceToken", text: "}" }
            ]

            const expectedOutput = [{key: "name", type: "string"}]
            const typeObjects = parseTypeObjects(tokens)
            expect(typeObjects).toEqual(expectedOutput)
        })

        test('should return an array of objects when there are multiple type properties', () => {
            const tokens = [
                { kind: "ExportKeyword", text: "export" }, 
                { kind: "TypeKeyword", text: "type" }, 
                { kind: "Identifier", text: "SmallTest" }, 
                { kind: "FirstAssignment", text: "=" }, 
                { kind: "FirstPunctuation", text: "{" }, 
                { kind: "Identifier", text: "name" }, 
                { kind: "ColonToken", text: ":" }, 
                { kind: "StringKeyword", text: "string" }, 
                { kind: "SemicolonToken", text: ";" }, 
                { kind: "Identifier", text: "anotherName" }, 
                { kind: "ColonToken", text: ":" }, 
                { kind: "StringKeyword", text: "string" }, 
                { kind: "SemicolonToken", text: ";" }, 
                { kind: "CloseBraceToken", text: "}" }
            ]

            const expectedOutput = [
                {key: "name", type: "string"},
                {key: "anotherName", type: "string"}
            ]
            const typeObjects = parseTypeObjects(tokens)
            expect(typeObjects).toEqual(expectedOutput)
        })
    })

    describe('generateModel', () => {
        test('should return a sequelize model', () => {
            const fileContent = `export type SmallTest = {
                name: string;
            }`

            const expectedOutput = `@Column({ field: 'name', type: Sequelize.STRING })\nname!: string\n\n`

            const result = generateModel(fileContent)

            expect(result).toEqual(expectedOutput)
        })
    })
})