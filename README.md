# safeset <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

Set, but safe from prototype modifications.

## Getting started

```sh
npm install --save safeset
```

## Usage/Examples

```js
const assert = require('assert');
const SafeSet = require('safeset');

delete Set.prototype.has;
delete Set.prototype.size;
delete Set.prototype[Symbol.iterator];

const set = new Set([1, 2]);
assert.equal('has' in set, false, 'set has no `has`!');
assert.equal(set.size, undefined, 'set size is not 2!');
assert.deepEqual(Array.from(set), [], 'set is missing expected values!');

const ss = new SafeSet([1, 2]);
assert.equal(ss.has(1), true, 'safe set has 1');
assert.equal(ss.size, 2, 'safe set size is 2');
assert.deepEqual(Array.from(ss), [1, 2], 'safe set has expected values');
```

## Tests

Clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.org/package/safeset
[npm-version-svg]: https://versionbadg.es/ljharb/safeset.svg
[deps-svg]: https://david-dm.org/ljharb/safeset.svg
[deps-url]: https://david-dm.org/ljharb/safeset
[dev-deps-svg]: https://david-dm.org/ljharb/safeset/dev-status.svg
[dev-deps-url]: https://david-dm.org/ljharb/safeset#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/safeset.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/safeset.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/safeset.svg
[downloads-url]: https://npm-stat.com/charts.html?package=safeset
[codecov-image]: https://codecov.io/gh/ljharb/safeset/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/ljharb/safeset/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/ljharb/safeset
[actions-url]: https://github.com/ljharb/safeset/actions
