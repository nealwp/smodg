const fs = require('node:fs')

jest.mock('node:fs')

jest.mock('../package.json', () => ({
    version: '1.2.3'
}), {virtual: true})

import {
    printVersion,
    printHelp,
    writeModelToFile,
    main
} from '../src/index'

describe('cli', () => {
    describe('printVersion', () => {
        test('should print the current app version', () => {
            console.log = jest.fn()
            printVersion()
            expect(console.log).toHaveBeenCalledWith('smodg v1.2.3')
        })
    })
    describe('printHelp', () => {
        test('should print help text', () => {
            console.log = jest.fn()
            printHelp()
            expect(console.log).toHaveBeenCalled()
        })
    })

    describe('writeModelToFile', () => {
       
        beforeEach(() => {
            jest.resetAllMocks()
        })

        test('should create the output directory if not exists', () => {
            fs.existsSync.mockReturnValue(false)
            
            const options = {
                outputDir: 'non_existent_dir',
                modelName: 'doesntMatter'
            }

            writeModelToFile('blah', options)
            expect(fs.mkdirSync).toHaveBeenCalled()
            expect(fs.mkdirSync).toHaveBeenCalledWith(`./${options.outputDir}`)
            
        })

        test('should not create the output directory if it already exists', () => {
            fs.existsSync.mockReturnValue(true)
            
            const options = {
                outputDir: 'existent_dir',
                modelName: 'doesntMatter'
            }

            writeModelToFile('blah', options)
            expect(fs.mkdirSync).not.toHaveBeenCalled() 
        })


        test('should write model content to file path', () => {
            fs.writeFileSync = jest.fn()
    
            const modelData = 'blah'

            const options = {
                outputDir: 'a/path/to/a/directory',
                modelName: 'importantModelName'
            }

            const expectedFileName = 'important-model-name.model.ts'

            writeModelToFile(modelData, options)

            expect(fs.writeFileSync).toHaveBeenCalledWith(`./${options.outputDir}/${expectedFileName}`, modelData)

        })

        test('should print error if thrown', () => {
            fs.writeFileSync.mockImplementation(() => {
                throw new Error('borked')
            })
            
            console.error = jest.fn()

            const options = {
                outputDir: 'dont_matter_dir',
                modelName: 'doesntMatterEither'
            }

            writeModelToFile('blah', options)

            expect(console.error).toHaveBeenCalledWith(new Error('borked'))

        })
    })

    describe('command line arguments', () => {
        test('-v and --version should print the version', () => {
      
            console.log = jest.fn()

            let args: any;

            // smodg -v
            args = {_: [], v: true}
            main(args)
            expect(console.log).toHaveBeenCalledWith('smodg v1.2.3')

            jest.resetAllMocks()

            // smodg --version
            args = {_: [], version: true}
            main(args)
            expect(console.log).toHaveBeenCalledWith('smodg v1.2.3')

        })

        test('-h and --help should print helptext', () => {

            console.log = jest.fn()

            let args: any;

            // smodg -h
            args = {_: [], h: true}
            main(args)
            expect(console.log).toHaveBeenCalled()

            jest.resetAllMocks()

            // smodg --help
            args = {_: [], help: true}
            main(args)
            expect(console.log).toHaveBeenCalled()
        })
        
        test('-m and --migration should trigger a migration generation', () => {})
        test('-s and --schema should set a schema name', () => {})
        test('-o and --outputDir should set the output directory', () => {})
        test('should pass filepath to readFileSync', () => {})
        test('should probably be implemented differently because these tests are getting wacky', () => {})
    })
})
