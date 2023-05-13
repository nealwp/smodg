#!/usr/bin/env node

import fs from 'node:fs'
import minimist from 'minimist';
import { generateModelInputs } from './parser';
import { modelTemplate, migrationTemplate } from './templates';
import { kebabCase } from './formatters';
import { version } from '../package.json'

export const main = (args: minimist.ParsedArgs) => {
    
    const filePath = args._[0] 
    
    let generateMigrationFile = false
    let schema = ""    
    let outputDir = 'src/models'

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

    if(!filePath){
        console.error('error: path to type file is required!')
        return
    }

    try {

        const sourceCode = fs.readFileSync(filePath, 'utf-8')        
        const modelInputs = generateModelInputs(sourceCode, schema)
        const model = modelTemplate(modelInputs)
        
        writeModelToFile(model, { outputDir, modelName: modelInputs.modelName })

        if (generateMigrationFile) {
            
            const migrationInputs = {
                tableDefinition: modelInputs.tableDefinition,
                columnDefinitions: modelInputs.columnDefinitions
            }

            const migration = migrationTemplate(migrationInputs)
            //writeMigrationToFile(migration)
        }
    } catch(error) {
        console.error(error)
    }
        
}

export const writeModelToFile = (model: string, options: {outputDir: string, modelName: string}) => {
    
    if (!fs.existsSync(`./${options.outputDir}`)) {
        fs.mkdirSync(`./${options.outputDir}`)
    }

    try {
        fs.writeFileSync(`./${options.outputDir}/${kebabCase(options.modelName)}.model.ts`, model)
    } catch (error) {
        console.error(error)
    }
}

export const printHelp = () => {
    const helpText = `
=================================
    Sequelize Model Generator    
=================================

Generate a Sequelize model based on a TypeScript type declaration.

Usage:

    smodg [options] <filepath> 

Options:

    -h, --help        show help
    -m, --migration   create an Umzug migration. default: false
    -o, --outputDir   model output directory, relative to current path. default: "src/models"
    -s, --schema      specify a schema. default: none 
    -v, --version     print installed version
` 

    console.log(helpText)
}

export const printVersion = () => {
    console.log(`smodg v${version}`)
}


const args = minimist(process.argv.slice(2)) 

main(args)
