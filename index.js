#!/usr/bin/env node
const { program } = require('commander');
const imgen = require('./libs/imgen');
const webopen = require('./libs/webopen');

// 版本号
program.version('1.0.1');

// img generate
// imgen -s 100x200 -t png -f
program.command('imgen')
  .description('generate img by custom size')
  .requiredOption('-s, --size <size>', 'custom size')
  .option('-t, --type <type>', 'generate img type', 'jpg')
  .option('-f, --force', 'force generate although img exist', false)
  .action(({ size, type, force }) => {
    imgen(size, type, force);
  });

// web open
// 直接打开 webopen https://baidu.com
// 设置别名 webopen alias baidu https://www.baidu.com/s?wd=${keyword}
// 别名打开 webopen baidu "今天吃什么"
// 获取别名 webopen alias baidu
program.command('webopen')
  .description('open url quickly')
  .arguments('<args...>')
  .action(args => {
    webopen(args);
  });

// parse args
program.parse(process.argv);
