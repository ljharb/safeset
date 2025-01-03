'use strict';

var test = require('tape');
var forEach = require('for-each');
var mockProperty = require('mock-property');
var ownKeys = require('own-keys');
var getProto = require('get-proto');
var hasToStringTag = require('has-tostringtag')();
var Set = require('es-set');
var hasSymbols = require('has-symbols')();
var gPO = require('get-proto');

var SafeSet = require('../');

test('Set', function (t) {
	t.equal(new SafeSet().size, 0);
	t.equal(new SafeSet([1]).size, 1);
	t.equal(new SafeSet([1, 2]).size, 2);
	t.equal(new SafeSet([1, 2, 3]).size, 3);

	t.equal(SafeSet.name, 'SafeSet', 'has expected name');
	t.equal(SafeSet.prototype.constructor, SafeSet, 'prototype has expected constructor');
	t.equal(new SafeSet().constructor, SafeSet, 'instance has expected constructor');

	t.notEqual(SafeSet.prototype, Set.prototype, 'SafeSet has a distinct prototype from Set');

	t.test('toStringTag', { skip: !hasToStringTag }, function (st) {
		st.equal(SafeSet.prototype[Symbol.toStringTag], 'SafeSet', 'prototype has expected toStringTag');
		st.equal(new SafeSet()[Symbol.toStringTag], 'SafeSet', 'instance has expected toStringTag');

		st.end();
	});

	t.test('toStringTag', { skip: typeof Symbol !== 'function' || !Symbol.species }, function (st) {
		st.equal(SafeSet[Symbol.species], SafeSet, 'constructor has expected species');

		st.end();
	});

	t.test('no Set.prototype methods', function (st) {
		if (getProto) {
			var setIterator = new Set().values();
			// eslint-disable-next-line no-extra-parens
			var IteratorPrototype = /** @type {Record<PropertyKey, unknown>} */ (getProto(setIterator));
			if (hasSymbols) {
				st.teardown(mockProperty(
					IteratorPrototype,
					Symbol.iterator,
					{ 'delete': true }
				));
			}
		}

		forEach(ownKeys(Set.prototype), function (key) {
			if (key !== 'add') {
				st.teardown(mockProperty(
					// eslint-disable-next-line no-extra-parens
					/** @type {Parameters<typeof mockProperty>[0]} */ (/** @type {unknown} */ (Set.prototype)),
					key,
					{ 'delete': true }
				));
				if (gPO && key in Set.prototype) {
					// `es-set` duplicates Set.prototype methods on its own prototype
					st.teardown(mockProperty(
						// eslint-disable-next-line no-extra-parens
						/** @type {Parameters<typeof mockProperty>[0]} */ (/** @type {unknown} */ (gPO(Set.prototype))),
						key,
						{ 'delete': true }
					));
				}
			}
		});

		var set = new Set([1, 2]);
		st.notOk('has' in set, 'set has no `has`!');
		st.equal(set.size, undefined, 'set size is not 2!');
		st.notOk('forEach' in set, 'set has no `forEach`!');

		var ss = new SafeSet([1, 2]);
		st.equal(ss.has(1), true, 'safe set has 1');
		st.equal(ss.size, 2, 'safe set size is 2');
		/** @type {number[]} */
		var ssActual = [];
		ss.forEach(function (value) {
			ssActual.push(value);
		});
		st.deepEqual(ssActual, [1, 2], 'safe set has expected values');

		st.end();
	});

	t.end();
});
