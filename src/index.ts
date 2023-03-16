#!/usr/bin/env node

import fs from 'node:fs'
import { argv } from 'node:process';
import { generateModelInputs } from './parser';
import { modelTemplate } from './templates/model.smodg';
import { kebabCase } from './formatters';

try {
    const sourceCode = fs.readFileSync(argv[2], 'utf-8')
    const modelInputs = generateModelInputs(sourceCode)
    
    const model = modelTemplate(modelInputs)

    if (!fs.existsSync('./src/models')) {
        fs.mkdirSync('./src/models')
    }

    try {
        fs.writeFileSync(`./src/models/${kebabCase(modelInputs.modelName)}.model.ts`, model)
    } catch (error) {
        console.error(error)
    }

} catch (error) {
    console.error(error)
}