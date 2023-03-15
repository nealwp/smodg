import { generateModel, readTokensFromSource, parseTypeObjects, snakeCase, getSequelizeType } from '../src/parser'

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

            const expectedOutput = { tableName: 'SmallTest', types: [{key: "name", type: "string"}] }
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
                tableName: 'SmallTest',
                types: [
                    {key: "name", type: "string"},
                    {key: "anotherName", type: "string"}
                ]
            }
            const typeObjects = parseTypeObjects(tokens)
            expect(typeObjects).toEqual(expectedOutput)
        })
    })

    describe('generateModel', () => {
        test('should return a sequelize model', () => {
            const fileContent = `export type SmallTest = {
                name: string;
            }`

            const expectedOutput = `@Table({tableName: 'small_test'})\nclass SmallTest extends Model implements SmallTestAttributes {\n\t@Column({ field: 'name', type: Sequelize.STRING })\n\tname!: string\n\n}\n`

            const result = generateModel(fileContent)

            expect(result).toEqual(expectedOutput)
        })
        test('should handle a multiple properties', () => {
            const fileContent = `export type SmallTest = {
                name: string;
                anotherName: string;
            }`

            const expectedOutput = `@Table({tableName: 'small_test'})\nclass SmallTest extends Model implements SmallTestAttributes {\n\t@Column({ field: 'name', type: Sequelize.STRING })\n\tname!: string\n\n\t@Column({ field: 'another_name', type: Sequelize.STRING })\n\tanotherName!: string\n\n}\n`

            const result = generateModel(fileContent)

            expect(result).toEqual(expectedOutput)
        })
    })


    describe('snakeCase', () => {
        test('should convert a camelCase string to snake_case', () => {
            const text = 'thisIsCamelCase'
            const expected = 'this_is_camel_case'
            const result = snakeCase(text)
            expect(result).toEqual(expected)
        })

        test('should treat consecutive uppercase as a single word', () => {
            const text = 'thisIsCostUSD'
            const expected = 'this_is_cost_usd'
            const result = snakeCase(text)
            expect(result).toEqual(expected)
        })

        test('should convert PascalCase to snake_case', () => {
            const text = 'ThisIsPascalCase'
            const expected = 'this_is_pascal_case'
            const result = snakeCase(text)
            expect(result).toEqual(expected)
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
        test('should return DATETIME for Date', () => {
            const result = getSequelizeType('Date')
            expect(result).toEqual('DATETIME')
        })
        test('should return INTEGER for number', () => {
            const result = getSequelizeType('number')
            expect(result).toEqual('INTEGER')
        })
    })
})