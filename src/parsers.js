import yaml from 'js-yaml';

const mapping = {
  '.json': str => JSON.parse(str),
  '.yml': str => yaml.safeLoad(str),
};

export default ({ str, type }) => mapping[type](str);
