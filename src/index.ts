#!/usr/bin/env node
import fs from 'node:fs'
import { argv } from 'node:process';
import { generateModel } from './parser';

try {
    const sourceCode = fs.readFileSync(argv[2], 'utf-8')
    const data = generateModel(sourceCode)
    console.log(data)
} catch (error) {
    console.error(error)
}

