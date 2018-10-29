install:
	npm install hexlet-project-lvl1-mh

start:
	npm run babel-node -- src/bin/diff-calc.js

publish:
	npm publish

lint:
	npm run eslint .
