import fs from 'fs';
import path from 'path';
import generateDiff from '../src';

test('json test', () => {
  const expected = fs.readFileSync(path.resolve(__dirname, '__fixtures__/test-diff-json.txt'), 'utf8');
  expect(generateDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json')).toBe(expected);
});

test('yaml test', () => {
  const expected = fs.readFileSync(path.resolve(__dirname, '__fixtures__/test-diff-yml.txt'), 'utf8');
  expect(generateDiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml')).toBe(expected);
});

test('ini test', () => {
  const expected = fs.readFileSync(path.resolve(__dirname, '__fixtures__/test-diff-ini.txt'), 'utf8');
  expect(generateDiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.ini')).toBe(expected);
});

test('yaml test, plain render', () => {
  const expected = fs.readFileSync(path.resolve(__dirname, '__fixtures__/test-diff-yml_plain-res.txt'), 'utf8');
  expect(generateDiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml', 'plain')).toBe(expected);
});
