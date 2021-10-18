#!/usr/bin/env node
import main from "../dist/main.js";
// const scml = require('../dist/main');
let currentPath = process.cwd();
// let argv = process.argv.slice(2);
main.onCommand(currentPath, process.argv);