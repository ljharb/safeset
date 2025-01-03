'use strict';

var $Set = require('es-set');
var defineDataProperty = require('define-data-property');
var mirrorOwn = require('mirror-own');
var setProto = require('set-proto');
var $Object = require('es-object-atoms');
var setToStringTag = require('es-set-tostringtag');

var $freeze = $Object.freeze;

function SafeSet() {
	var set = arguments.length > 0 ? new $Set(arguments[0]) : new $Set();

	// @ts-expect-error let this throw
	setProto(set, SafeSet.prototype);
	// todo: Define constructor to Set
	Object.defineProperty(set, 'constructor', {
		configurable: false,
		enumerable: false,
		value: SafeSet,
		writable: false
	});

	if ($freeze) {
		$freeze(set);
	}

	return set;
}
// @ts-expect-error let this throw if getProto is not available
setProto(SafeSet, $Set);
// @ts-expect-error let this throw if getProto is not available
setProto(SafeSet.prototype, $Set.prototype);

defineDataProperty(SafeSet.prototype, 'constructor', SafeSet, true, true, true, true);
setToStringTag(SafeSet.prototype, 'SafeSet', { force: true });

mirrorOwn($Set.prototype, SafeSet.prototype, {
	omit: function (key) { return typeof Symbol === 'function' && key === Symbol.toStringTag; },
	skipFailures: true
});
mirrorOwn($Set, SafeSet, {
	omit: function (key) {
		// @ts-expect-error i think the `keyof SetConstructor` type is incorrect
		return (key === 'prototype' || key === 'constructor' || key === 'name' || key === 'length' || key === 'arguments' || key === 'caller')
			|| (typeof Symbol === 'function' && key === Symbol.species);
	},
	skipFailures: true
});

if ($freeze) {
	$freeze(SafeSet.prototype);
	$freeze(SafeSet);
}

/** @type {import('.')} */
module.exports = SafeSet;
