#!/usr/bin/env node
// import scml from '../dist/main';
const scml = require('../dist/main');
let argv = process.argv.slice(2);
scml.scml(argv);