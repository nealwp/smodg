#!/usr/bin/env node
import fs from 'node:fs'
import { argv } from 'node:process';
console.log(argv[2]);
try {
    const data = fs.readFileSync(argv[2], 'utf-8')
    console.log(data)
} catch (error) {
    console.error(error)
}

