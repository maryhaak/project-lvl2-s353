import generator from '../src';

test('generate diff (relative path)', () => {
  expect(generator('../__tests__/__fixtures__/before.json', '../__tests__/__fixtures__/after.json')).toBe('{\n\t  host: hexlet.io\n\t+ timeout: 20\n\t- timeout: 50\n\t- proxy: 123.234.53.22\n\t- follow: false\n\t+ verbose: true\n}');
});
