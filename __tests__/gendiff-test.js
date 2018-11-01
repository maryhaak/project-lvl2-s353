import * as fs from 'fs';
import * as path from 'path';
import generator from '../src';

test('json test', () => {
  const expected = fs.readFileSync(path.resolve(__dirname, './__fixtures__/test-diff-json.txt'), 'utf8');
  expect(generator('../__tests__/__fixtures__/before.json', '../__tests__/__fixtures__/after.json')).toBe(expected);
});

test('yaml test', () => {
  const expected = fs.readFileSync(path.resolve(__dirname, './__fixtures__/test-diff-yml.txt'), 'utf8');
  expect(generator('../__tests__/__fixtures__/before.yml', '../__tests__/__fixtures__/after.yml')).toBe(expected);
});
