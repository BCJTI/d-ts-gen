'use strict';

function DeclarationType(moduleName) {
	this.moduleName = moduleName;
	this.identation = 0;
}

DeclarationType.prototype.getIdentation = function () {
	var ret = '';
	for (var i = 0; i < this.identation; i++) {
		ret += '\t';
	}
	return ret;
}

DeclarationType.prototype.discoverElement = function (ele, name) {
	switch (typeof ele) {
		case 'object':
			this.processObject(ele, name);
			break;
		case 'function':
			this.processFunction(ele, name);
			break;
		default:
			console.log(this.getIdentation() + name + ' : ' + typeof ele);
	}
}

DeclarationType.prototype.processFunction = function (func, name) {
	var paramsRegExp = /function\s*[^\(]*\(([^\)]*)\)/g;
	var parameters = paramsRegExp.exec(func.prototype.constructor + '')[1].split(',');
	var decl = this.getIdentation() + 'function ' + name + '(';
	parameters.forEach(function (param) {
		decl = decl + param + ' : any, '
	});
	decl = decl.substring(0, decl.length - 2);
	decl = decl + ') : any;';
	console.log(decl);
}

DeclarationType.prototype.processObject = function(obj, name) {
	var properties = Object.getOwnPropertyNames(obj);
	var descriptor;
	var self = this;
	console.log(this.getIdentation() + 'class ' + name + ' {');
	this.identation++;
	properties.forEach(function (property) {
		descriptor = Object.getOwnPropertyDescriptor(obj, property);
		self.discoverElement(descriptor.value, property);
	});
	var symbols = Object.getOwnPropertySymbols(obj);
	symbols.forEach(function (symbol) {
		descriptor = Object.getOwnPropertyDescriptor(obj, symbol);
		console.log(symbol);
		self.discoverElement(descriptor.value, symbol.toString());
	});
	this.identation--;
	console.log(this.getIdentation() + '}');
}

DeclarationType.prototype.printDeclarations = function () {
	var module = require(this.moduleName);
	console.log('declare module "' + this.moduleName + '" {');
	this.identation++;
	this.discoverElement(module, this.moduleName);
	this.identation--;
	console.log('}');
}

var moduleName = process.argv[2];
if (moduleName) {
	var dts = new DeclarationType(moduleName);
	dts.printDeclarations();
} else {
	console.error('Call with the module name parameter.')
}

