/// <reference path='./typings/tsd.d.ts' />
export class DeclarationType {
	private identation: number = 0;
	constructor(private moduleName: string) {
	}

	getIdentation() : string {
		let ret = '';
		for (let i = 0; i < this.identation; i++) {
			ret += '\t';
		}
		return ret;
	}

	discoverElement(ele : any, name: string, ignoreClassDefinition: boolean) : void {
		switch (typeof ele) {
			case 'object':
				this.processObject(<Object>ele, name, ignoreClassDefinition);
				break;
			case 'function':
				this.processFunction(<Function>ele, name);
				break;
			default:
				console.log(this.getIdentation() + (this.identation < 2 ? 'var ' : '') + name + ' : ' + typeof ele + ';');
		}
	}

	processFunction(func : Function, name : string) : void {
		let paramsRegExp = /function\s*[^\(]*\(([^\)]*)\)/g;
		let parameters = paramsRegExp.exec(func.prototype.constructor + '')[1].split(',');
		let decl = this.getIdentation() + (this.identation < 2 ? 'function ' : '') + name + '(';
		parameters.forEach(function(param, index) {
			decl = decl + ((param && typeof param === 'string' && param.length > 0) ? param : 'param_' + index) + ' : any, ';
		});
		decl = decl.substring(0, decl.length - 2);
		decl = decl + ') : any;';
		console.log(decl);
	}

	processObject(obj : Object, name : string, ignoreClassDefinition: boolean) : void {
		let properties = Object.getOwnPropertyNames(obj);
		let descriptor;
		if (!ignoreClassDefinition) {
			console.log(this.getIdentation() + 'class ' + name + ' {');
			this.identation++;
		}
		properties.forEach(function(property) {
			descriptor = Object.getOwnPropertyDescriptor(obj, property);
			this.discoverElement(descriptor.value, property, false);
		}, this);
		if (!ignoreClassDefinition) {
			this.identation--;
			console.log(this.getIdentation() + '}');
		}
	}

	printDeclarations() {
		let module = require(this.moduleName);
		console.log('declare module "' + this.moduleName + '" {');
		this.identation++;
		this.discoverElement(module, this.moduleName, true);
		this.identation--;
		console.log('}');
	}

}
