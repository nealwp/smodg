jest.mock('../package.json', () => ({
    version: '1.2.3'
}), {virtual: true})

import {
    printVersion
} from '../src/index'

describe('cli', () => {
    describe('printVersion', () => {
        test('should print the current app version', () => {
            console.log = jest.fn()
            printVersion()
            expect(console.log).toHaveBeenCalledWith('smodg v1.2.3')
        })
    })
})
