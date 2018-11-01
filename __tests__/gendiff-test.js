import fs from 'fs';
import path from 'path';
import generateDiff from '../src';

test('json test', () => {
  const expected = fs.readFileSync(path.resolve(__dirname, './__fixtures__/test-diff-json.txt'), 'utf8');
  expect(generateDiff('../__tests__/__fixtures__/before.json', '../__tests__/__fixtures__/after.json')).toBe(expected);
});

test('yaml test', () => {
  const expected = fs.readFileSync(path.resolve(__dirname, './__fixtures__/test-diff-yml.txt'), 'utf8');
  expect(generateDiff('../__tests__/__fixtures__/before.yml', '../__tests__/__fixtures__/after.yml')).toBe(expected);
});
