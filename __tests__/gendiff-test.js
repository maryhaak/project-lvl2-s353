import * as fs from 'fs';
import * as path from 'path';
import generator from '../src';

test('generate diff (relative path)', () => {
  const expected = fs.readFileSync(path.resolve(__dirname, './__fixtures__/test-diff.txt'), 'utf8');
  expect(generator('../__tests__/__fixtures__/before.json', '../__tests__/__fixtures__/after.json')).toBe(expected);
});
