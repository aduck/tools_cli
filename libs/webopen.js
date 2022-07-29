// 打开浏览器
// webopen www.baidu.com
// webopen alias cidev https://vpc-dev-ci.yit.com/view/${env}/job/yit-${env}-${project}/
// webopen cidev --env=stage+i7 --project=boss-web
const os = require('os');
const { readFileSync, writeFileSync } = require('fs');
const { ensureFileSync } = require('fs-extra');
const { resolve } = require('path');
const chalk = require('chalk');
const open = require('open');

/**
 * 配置
 */
const config = {
  // 配置路径
  configPath: resolve(os.homedir(), '.toolcli/webopen'),
  // 读取配置文件
  _getConfigData() {
    ensureFileSync(this.configPath);
    return readFileSync(this.configPath, 'utf-8');
  },
  // 解析配置
  get(key) {
    const configData = this._getConfigData();
    const cfg = configData.split('\n').filter(v => v).reduce((prev, cur) => {
      const [k, v] = cur.split(/\s+/);
      prev.set(k, v);
      return prev;
    }, new Map());
    return key ? cfg.get(key) : cfg;
  },
  // 更新配置
  set(key, value) {
    const cfg = this.get();
    cfg.set(key, value);
    let cfgString = '';
    cfg.forEach((val, k) => {
      cfgString += `${k} ${val}\n`;
    })
    writeFileSync(this.configPath, cfgString, 'utf-8');
  }
};

/**
 * 处理别名
 * @param {...any} args 参数
 * @returns 
 */
function handleAlias(...args) {
  switch (args.length) {
    case 0:
      return console.log([...config.get().keys()].join('\n'));
    case 1:
      // get
      return console.log(config.get(args[0]));
    default:
      // set
      config.set(args[0], args[1]);
      console.log(chalk.green(`alias ${args[0]} set success`));
  }
}

/**
 * 解析url
 * @param {String} url url or alias
 * @param {Array<String>} args params
 */
function parseUrl(url, ...args) {
  const aliasUrl = config.get(url);
  // 防止死循环
  if (aliasUrl && aliasUrl !== url) {
    return parseUrl(aliasUrl, ...args);
  }
  // 获取变量map
  const reg = /\$\{([^\}]+)\}/g;
  let paramMap = new Map();
  let m
  while ((m = reg.exec(url)) !== null) {
    const [param, value = ''] = m[1].split(':');
    // 取第一个有值的默认值
    let defaultValue = paramMap.has(param) ? paramMap.get(param).defaultValue || value : value;
    paramMap.set(param, { defaultValue });
  }
  // 根据变量解析参数
  let params = [];
  try {
    params = parseParams(args, paramMap);
  } catch (e) {
    return console.log(chalk.red(e.message));
  }
  // 解析url
  if (!params.length) return [url];
  return params.map(v => {
    return url.replace(reg, (...match) => {
      return encodeURIComponent(v[match[1].split(':')[0]]);
    });
  });
}

/**
 * 解析参数
 * a=1 123 => [{a:1,b=123}]
 * b=123 => [{a:123,b:123}]
 * a=1 b=3 => [{a:1,b:3}]
 * b=134 a=1 => [{a:1,b=134}]
 * 123 345 => [{a:123,b:345}]
 * 123+33 111 => [{a:123,b:111},{a:33,b:111}]
 * b=4 1 => [{a:123,b:4}]
 * @param {Array<String>} params 参数列表
 * @param {Map} map url变量map
 */
function parseParams(params = [], map) {
  if (!map.size) return [];
  // 忽略多余参数
  params = params.slice(0, map.size);
  // map key列表
  const mapKeys = [...map.keys()];
  params.forEach((v, i) => {
    const [name, value] = v.split('=');
    // 是否命名参数
    const hasName = typeof value !== 'undefined';
    if (hasName && map.has(name)) {
      // 命名参数，取对应key赋值
      map.set(name, { ...map.get(name), value });
    } else {
      // 非命名参数，按顺序赋值
      map.set(mapKeys[i], { ...map.get(mapKeys[i]), value: name });
    }
  });
  // 二维数组
  let highArray = [];
  map.forEach((v, k) => {
    let value = v.value || v.defaultValue;
    highArray.push(value.split('+'));
  });
  // 生成笛卡尔数组
  let values = decareGenerator(...highArray);
  // 二维数组转换成object列表
  return values.reduce((prev, cur) => {
    let o = {};
    cur.forEach((v, i) => o[mapKeys[i]] = v);
    prev.push(o);
    return prev;
  }, []);
}

/**
 * 生成笛卡尔积
 * @returns 
 */
function decareGenerator() {
  return Array.prototype.reduce.call(arguments, (prev, cur) => {
    const result = [];
    prev.forEach(p => {
      cur.forEach(c => {
        result.push(p.concat([c]));
      });
    });
    return result;
  }, [[]]);
}

module.exports = function(args) {
  const isAlias = args[0] === 'alias';
  // 操作alias
  if (isAlias) {
    return handleAlias(...args.slice(1));
  }
  // 获取url列表
  const urls = parseUrl(...args);
  // 打开url
  urls.forEach(v => open(v));
}
