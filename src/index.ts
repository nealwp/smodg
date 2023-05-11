#!/usr/bin/env node 
import fs from 'node:fs'
import { generateModelInputs } from './parser';
import { modelTemplate } from './templates/model.smodg';
import { kebabCase } from './formatters';
import minimist from 'minimist';

const main = () => {
    const args = minimist(process.argv.slice(2)) 
    const filePath = args._[0] 

    let generateMigrationFile = false
    let schema = ""    
    let outputDir = './src/models'

    if(args.h || args.help){
        printHelp()
        return
    }

    if(args.v || args.version){
        printVersion()
        return
    }

    if(args.m || args.migration){
        generateMigrationFile = true
    }

    if(args.s){
        schema = args.s
    } else if (args.schema) {
        schema = args.schema
    }

    if(args.o){
        outputDir = args.o
    } else if (args.outputDir) {
        outputDir = args.outputDir
    }

    try {
        generateModel(filePath, schema)
        if (generateMigrationFile) {
            console.log('generating migration')
            //generateMigration()
        }
    } catch(error) {
        console.error(error)
    }
        
}

const generateModel = (filePath: string, schema: string) => {
    const sourceCode = fs.readFileSync(filePath, 'utf-8')
    const modelInputs = generateModelInputs(sourceCode)

    const model = modelTemplate({...modelInputs, schemaName: schema})

    if (!fs.existsSync('./src/models')) {
        fs.mkdirSync('./src/models')
    }

    try {
        fs.writeFileSync(`./src/models/${kebabCase(modelInputs.modelName)}.model.ts`, model)
    } catch (error) {
        console.error(error)
    }
}

const printHelp = () => {
    const helpText = `
=================================
    Sequelize Model Generator    
=================================

Usage:

    smodg [options] <filepath> 

Options:

    -h, --help        show help
    -m, --migration   create an Umzug migration. default false
    -o, --outputDir   model output directory. default ./src/models
    -s, --schema      specify a schema. default is none/public 
    -v, --version     print installed version
` 

    console.log(helpText)
}

const printVersion = () => {
    const packageVersion = require('./package.json').version
    console.log(packageVersion)
}

main()
