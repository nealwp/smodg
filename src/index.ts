#!/usr/bin/env node

import fs from 'node:fs'
import { argv } from 'node:process';
import { generateColumnDefinition, generateModel } from './parser';

try {
    const sourceCode = fs.readFileSync(argv[2], 'utf-8')
    const columnDecorators = generateModel(sourceCode)
    const columnDefintion = generateColumnDefinition(sourceCode)
    
    if (!fs.existsSync('./src/models')) {
        fs.mkdirSync('./src/models')
    }

    try {
        fs.writeFileSync('./src/models/test.model.ts', `${columnDefintion}\n${columnDecorators}`)
    } catch (error) {
        console.error(error)
    }

} catch (error) {
    console.error(error)
}