import {  snakeCase, kebabCase } from '../src/formatters'

describe('formatters', () => {
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

    describe('kebabCase', () => {
        test('should convert camelCase to kebab-case', () => {
            const text = 'thisIsCamelCase'
            const expected = 'this-is-camel-case'
            const result = kebabCase(text)
            expect(result).toEqual(expected)
        })

        test('should convert consecutive uppercase to kebab-case', () => {
            const text = 'thisIsCostUSD'
            const expected = 'this-is-cost-usd'
            const result = kebabCase(text)
            expect(result).toEqual(expected)
        })

        test('should convert PascalCase to kebab-case', () => {
            const text = 'ThisIsPascalCase'
            const expected = 'this-is-pascal-case'
            const result = kebabCase(text)
            expect(result).toEqual(expected)
        })
    })
})
