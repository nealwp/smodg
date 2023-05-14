#!/usr/bin/env node

import fs from 'node:fs'
import minimist from 'minimist';
import { generateModelInputs } from './parser';
import { modelTemplate, migrationTemplate } from './templates';
import { kebabCase } from './formatters';

const main = () => {

    const args = minimist(process.argv.slice(2), {
        stopEarly: true,
        boolean: true
    }) 
    
    console.log(args)

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

    if(args.migration){
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
            writeMigrationToFile(migration, {modelName: modelInputs.modelName})
        }
    } catch(error) {
        console.error(error)
    }
        
}

const writeModelToFile = (model: string, options: {outputDir: string, modelName: string}) => {
    
    if (!fs.existsSync(`./${options.outputDir}`)) {
        fs.mkdirSync(`./${options.outputDir}`)
    }

    try {
        fs.writeFileSync(`./${options.outputDir}/${kebabCase(options.modelName)}.model.ts`, model)
    } catch (error) {
        console.error(error)
    }
}

const writeMigrationToFile = (migration: string, options: {modelName: string}) => {
     
    if (!fs.existsSync(`./src/migrations`)) {
        fs.mkdirSync(`./src/migrations`)
    }

    try {
        fs.writeFileSync(`./src/migrations/${dateFormatString()}-Create-Table-${options.modelName}.ts`, migration)
    } catch(error) {
        console.error(error)
    }
}


const dateFormatString = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    return `${year}.${month}.${day}T${hours}.${minutes}.${seconds}`;
}

const printHelp = () => {
    const helpText = `
=================================
    Sequelize Model Generator    
=================================

Generate a Sequelize model based on a TypeScript type declaration.

Usage:

    smodg [options] <filepath> 

Options:

    --help, -h          show help
    
    --migration         create an Umzug migration. default: false
   
    --outputDir=PATH,   model output directory, relative to current path. default: "src/models"
        -o PATH         
    
    --schema=NAME       specify a schema. default is no schema 
        -s NAME
    
    --version, -v       print installed version
` 

    console.log(helpText)
}

const printVersion = () => {
    const packageVersion = require('./package.json').version
    console.log(packageVersion)
}

main()
