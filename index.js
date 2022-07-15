#!/usr/bin/env node
const { program } = require('commander');
const imgen = require('./libs/imgen');

// 版本号
program.version('1.0.1');

// img generate
program.command('imgen')
  .description('generate img by custom size')
  .requiredOption('-s, --size <size>', 'custom size')
  .option('-t, --type <type>', 'generate img type', 'jpg')
  .option('-f, --force', 'force generate although img exist', false)
  .action(({ size, type, force }) => {
    imgen(size, type, force);
  });

// parse args
program.parse(process.argv);
