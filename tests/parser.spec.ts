import { 
    readTokensFromSource,
	parseTypeObjects,
	getSequelizeType,
	generateTableDefinition,
	generateModelInputs
} from '../src/parser'

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

            const expectedOutput = { modelName: 'SmallTest', types: [{key: "name", type: "string"}] }
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

            const expectedOutput = {
                modelName: 'SmallTest',
                types: [
                    {key: "name", type: "string"},
                    {key: "anotherName", type: "string"}
                ]
            }
            const typeObjects = parseTypeObjects(tokens)
            expect(typeObjects).toEqual(expectedOutput)
        })
    })

    describe('getSequelizeType', () => {
        test('should return STRING for string', () => {
            const result = getSequelizeType('string')
            expect(result).toEqual('STRING')
        })
        test('should return BOOLEAN for boolean', () => {
            const result = getSequelizeType('boolean')
            expect(result).toEqual('BOOLEAN')
        })
        test('should return DATE for Date', () => {
            const result = getSequelizeType('Date')
            expect(result).toEqual('DATE')
        })
        test('should return DECIMAL for number', () => {
            const result = getSequelizeType('number')
            expect(result).toEqual('FLOAT')
        })
        test('should return undefined for unknown type', () => {
            const result = getSequelizeType('FooBar')
            expect(result).toBe(undefined)
        })
    })

    describe('generateTableDefinition', () => {
        test('should return a table def string with no schema if schema is blank', () => {
            const expected = `\ttableName: 'my_model', `
            const result = generateTableDefinition("MyModel", "")
            expect(result).toEqual(expected)
        })
        test('should return a table def string with schema if schema is not blank', () => {
            const expected = `\ttableName: 'my_model', \n\tschema: 'my_schema',`
            const result = generateTableDefinition("MyModel", "MySchema")
            expect(result).toEqual(expected)
        })
    })

    describe('generateModelInputs', () => {
        test('should return the model name', () => {
            const fileContent = `export type SmallTest = {
                name: string;
                anotherName: string;
            }`

            const result = generateModelInputs(fileContent, '')
            expect(result.modelName).toEqual('SmallTest')
        })

        test('should return the table definition', () => {
            const fileContent = `export type SmallTest = {
                name: string;
                anotherName: string;
            }`

            const expected = `\ttableName: 'small_test', `

            const result = generateModelInputs(fileContent, '')
            expect(result.tableDefinition).toEqual(expected)
        })

        test('should return the column definitions', () => {
           const fileContent = `export type SmallTest = {
                name: string;
                anotherName: string;
            }`

            const expected = `\tname: {\n\t\tfield: 'name',\n\t\ttype: DataType.STRING\n\t},\n\tanotherName: {\n\t\tfield: 'another_name',\n\t\ttype: DataType.STRING\n\t},\n`
            const result = generateModelInputs(fileContent, '')
            expect(result.columnDefinitions).toEqual(expected)

        })

        test('should return column decorators', () => {
            const fileContent = `export type SmallTest = {
                name: string;
                anotherName: string;
            }`

            const expected = `\n\t@Column(columnDefinition.name)\n\tname!: string\n\n\t@Column(columnDefinition.anotherName)\n\tanotherName!: string\n`
            const result = generateModelInputs(fileContent, '')

            expect(result.columnDecorators).toEqual(expected)
        })
    })
})
