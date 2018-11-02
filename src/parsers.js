import yaml from 'js-yaml';

const mapping = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
};

export default (str, type) => mapping[type](str);
