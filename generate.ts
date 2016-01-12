#!/usr/bin/env node

/// <reference path='./typings/tsd.d.ts' />
import {DeclarationType} from './DeclarationType';
var moduleName = process.argv[2];
if (moduleName) {
    var dts = new DeclarationType(moduleName);
    dts.printDeclarations();
}
else {
    console.error('Call with the module name parameter.');
}
