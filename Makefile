install:
	npm install hexlet-project-lvl1-mh

start:
	npm run babel-node -- src/bin/gendiff.js

publish:
	npm publish

lint:
	npm run eslint .

test:
	yarn test
