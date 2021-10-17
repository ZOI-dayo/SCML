#!/usr/bin/env node
import main from "../dist/main.js";
import {program} from "commander";
// const scml = require('../dist/main');
program.option("-l, --lang <test>", "set build language").parse(process.argv);
let currentPath = process.cwd();
// let argv = process.argv.slice(2);
main.onCommand(currentPath, program);