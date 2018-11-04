import _ from 'lodash';


const prefixes = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
  tab: '    ',
  indent: '  ',
};


const stringify = (obj, indent) => Object.keys(obj).reduce((acc, key) => `${acc}${indent}${prefixes.indent}${key}: ${obj[key]}\n`, '');


const render = (data, depth = 0) => {
  const getValStr = value => (_.isObject(value) ? render(value, depth + 1) : value);
  const indent = prefixes.tab.repeat(depth);

  const keysStr = _.isArray(data)
    ? data.reduce((acc, item) => {
      const {
        key,
        status,
      } = item;

      const keyDiff = status === 'changed'
        ? `${indent}${prefixes.removed}${key}: ${getValStr(item.val1)}\n${indent}${prefixes.added}${key}: ${getValStr(item.val2)}\n`
        : `${indent}${status ? prefixes[status] : prefixes.indent}${key}: ${getValStr(item.value)}\n`;

      return `${acc}${keyDiff}`;
    }, '')
    : stringify(data, indent);

  const closingBracketIndent = depth > 0 ? `${prefixes.indent}${prefixes.tab.repeat(depth - 1)}` : '';
  return `{\n${keysStr}${closingBracketIndent}}`;
};


const getValueText = val => (_.isObject(val) ? `[complex value]${renderPlain(value)}` : val);


const diffTexts = {
  unchanged: () => '',
  removed: key => `Property ${key} was removed\n`,
  added: (key, item) => `Property ${key} was added with value: ${getValueText(item.value)}\n`,
  changed: (key, item) => `Property ${key} was updated. From ${getValueText(item.val1)} to ${getValueText(item.val2)}\n`,
};



const renderPlain = data => data.reduce((acc, item) => {
  const {
    key,
    status
  } = item;

  return `${acc}${diffTexts[status](key, item)}`;
}, '');


export default (data, type) => {
  if (type === 'plain') {
    return renderPlain(data);
  } else if (type === 'json') {
    return JSON.stringify(data);
  }
  return `${render(data)}\n`;
};
