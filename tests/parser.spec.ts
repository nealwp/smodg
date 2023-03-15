import { generateModel } from '../src/parser'

describe('parser', () => {
    describe('generateModel',  () => {
        test('should return a sequelize model', () => {
            const fileContent = `export type SmallTest = {
                name: string;
            }`
    
            const expectedOutput = `@Column({ field: 'name', type: Sequelize.STRING })\nname!: string`
    
            const result = generateModel(fileContent)
    
            expect(result).toEqual(expectedOutput)
        })
    })
})