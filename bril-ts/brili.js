#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var util_1 = require("./util");
var ffi = require('ffi');
var libPath = '../native/target/release/libthread_count';
var ref = require('ref');
var ArrayType = require('ref-array');
var IntArray = ArrayType(ref.types.int32);
var ByteArray = ArrayType(ref.types.uint8);
var libWeb = ffi.Library(libPath, {
    'add': ['int32', ['int32', 'int32']],
    'vadd': ['int32', [IntArray, IntArray, IntArray, 'int']],
    'vmul': ['int32', [IntArray, IntArray, IntArray, 'int']],
    'vsub': ['int32', [IntArray, IntArray, IntArray, 'int']]
});
var add = libWeb.add, vadd = libWeb.vadd;
var array = [1, 2, 3, 4];
var array1 = new IntArray(4);
array1[1] = 7;
array1[2] = 7;
array1[0] = 7;
array1[3] = 7;
var array2 = new IntArray(4);
console.log(array[0]);
(function (js_array, js_array1, js_array2) {
    console.log("length", js_array.length);
    var a = vadd(js_array, js_array1, js_array2, js_array.length);
    console.log(array2[0]);
    console.log(array2[1]);
    console.log(array2[2]);
    console.log(array2[3]);
})(array, array1, array2);
var argCounts = {
    add: 2,
    mul: 2,
    sub: 2,
    div: 2,
    id: 1,
    lt: 2,
    le: 2,
    gt: 2,
    ge: 2,
    eq: 2,
    not: 2,
    and: 2,
    or: 2,
    print: null,
    br: 3,
    jmp: 1,
    ret: 0,
    nop: 0,
    lw: 1,
    sw: 2,
    vadd: 2,
    vsub: 2,
    vmul: 2,
    vdiv: 2,
    vload: 1,
    vstore: 2
};
/*
 * Declare an array of memory to represent a stack-like memory structure.
 * Locations of memory dictated by software and freed if ever change stack frame/function
 * The freeing isn't supported yet because there is only one function
 */
var stackSize = 24576;
var stack = new Int32Array(stackSize);
/*
 * We're doing fixed array size of 4 so set this here
 * It's all my computer support natively so don't go beyond
 */
var fixedVecSize = 4;
/*
 * Initialize the binding
 */
function get(env, ident) {
    var val = env.get(ident);
    if (typeof val === 'undefined') {
        throw "undefined variable " + ident;
    }
    return val;
}
/**
 * Ensure that the instruction has exactly `count` arguments,
 * throwing an exception otherwise.
 */
function checkArgs(instr, count) {
    if (instr.args.length != count) {
        throw instr.op + " takes " + count + " argument(s); got " + instr.args.length;
    }
}
function getInt(instr, env, index) {
    var val = get(env, instr.args[index]);
    if (typeof val !== 'number') {
        throw instr.op + " argument " + index + " must be a number";
    }
    return val;
}
function getBool(instr, env, index) {
    var val = get(env, instr.args[index]);
    if (typeof val !== 'boolean') {
        throw instr.op + " argument " + index + " must be a boolean";
    }
    return val;
}
// memory lookup
function getMem(addr) {
    if (addr < stackSize) {
        var val = stack[addr];
        return val;
    }
    else {
        throw "load with addr " + addr + " out of range of stack";
    }
}
// memory write
function setMem(val, addr) {
    if (addr < stackSize) {
        stack[addr] = val;
    }
    else {
        throw "store addr " + addr + " out of range of stack";
    }
}
// get vector value from vector register file
function getVec(instr, env, index) {
    var val = get(env, instr.args[index]);
    if (!(val instanceof Int32Array)) {
        throw instr.op + " argument " + index + " must be a Int32Array";
    }
    return val;
}
var NEXT = { "next": true };
var END = { "end": true };
/**
 * Interpret an instruction in a given environment, possibly updating the
 * environment. If the instruction branches to a new label, return that label;
 * otherwise, return "next" to indicate that we should proceed to the next
 * instruction or "end" to terminate the function.
 */
function evalInstr(instr, env) {
    // Check that we have the right number of arguments.
    if (instr.op !== "const") {
        var count = argCounts[instr.op];
        if (count === undefined) {
            throw "unknown opcode " + instr.op;
        }
        else if (count !== null) {
            checkArgs(instr, count);
        }
    }
    switch (instr.op) {
        case "const":
            env.set(instr.dest, instr.value);
            return NEXT;
        case "id": {
            var val = get(env, instr.args[0]);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "add": {
            var l = getInt(instr, env, 0);
            var r = getInt(instr, env, 1);
            var val = add(l, r);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "mul": {
            var val = getInt(instr, env, 0) * getInt(instr, env, 1);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "sub": {
            var val = getInt(instr, env, 0) - getInt(instr, env, 1);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "div": {
            var val = getInt(instr, env, 0) / getInt(instr, env, 1);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "le": {
            var val = getInt(instr, env, 0) <= getInt(instr, env, 1);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "lt": {
            var val = getInt(instr, env, 0) < getInt(instr, env, 1);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "gt": {
            var val = getInt(instr, env, 0) > getInt(instr, env, 1);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "ge": {
            var val = getInt(instr, env, 0) >= getInt(instr, env, 1);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "eq": {
            var val = getInt(instr, env, 0) === getInt(instr, env, 1);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "not": {
            var val = !getBool(instr, env, 0);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "and": {
            var val = getBool(instr, env, 0) && getBool(instr, env, 1);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "or": {
            var val = getBool(instr, env, 0) || getBool(instr, env, 1);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "print": {
            var values = instr.args.map(function (i) { return get(env, i); });
            console.log.apply(console, values);
            return NEXT;
        }
        case "jmp": {
            return { "label": instr.args[0] };
        }
        case "br": {
            var cond = getBool(instr, env, 0);
            if (cond) {
                return { "label": instr.args[1] };
            }
            else {
                return { "label": instr.args[2] };
            }
        }
        case "ret": {
            return END;
        }
        case "nop": {
            return NEXT;
        }
        case "lw": {
            // lookup memory based on value in register
            var addr = getInt(instr, env, 0);
            var val = getMem(addr);
            env.set(instr.dest, val);
            return NEXT;
        }
        case "sw": {
            var val = getInt(instr, env, 0);
            var addr = getInt(instr, env, 1);
            setMem(val, addr);
            return NEXT;
        }
        case "vadd": {
            // serialized version
            var vecA = getVec(instr, env, 0);
            var vecB = getVec(instr, env, 1);
            var vecC = new Int32Array(fixedVecSize);
            for (var i = 0; i < fixedVecSize; i++) {
                vecC[i] = vecA[i] + vecB[i];
            }
            env.set(instr.dest, vecC);
            return NEXT;
        }
        case "vmul": {
            // serialized version
            var vecA = getVec(instr, env, 0);
            var vecB = getVec(instr, env, 1);
            var vecC = new Int32Array(fixedVecSize);
            for (var i = 0; i < fixedVecSize; i++) {
                vecC[i] = vecA[i] * vecB[i];
            }
            env.set(instr.dest, vecC);
            return NEXT;
        }
        case "vsub": {
            // serialized version
            var vecA = getVec(instr, env, 0);
            var vecB = getVec(instr, env, 1);
            var vecC = new Int32Array(fixedVecSize);
            for (var i = 0; i < fixedVecSize; i++) {
                vecC[i] = vecA[i] - vecB[i];
            }
            env.set(instr.dest, vecC);
            return NEXT;
        }
        case "vdiv": {
            // serialized version
            var vecA = getVec(instr, env, 0);
            var vecB = getVec(instr, env, 1);
            var vecC = new Int32Array(fixedVecSize);
            for (var i = 0; i < fixedVecSize; i++) {
                vecC[i] = vecA[i] / vecB[i];
            }
            env.set(instr.dest, vecC);
            return NEXT;
        }
        case "vload": {
            // serialized version
            var addr = getInt(instr, env, 0);
            var vec = new Int32Array(fixedVecSize);
            for (var i = 0; i < fixedVecSize; i++) {
                vec[i] = getMem(addr + i);
            }
            env.set(instr.dest, vec);
            return NEXT;
        }
        case "vstore": {
            // serialized version
            var val = getVec(instr, env, 0);
            var addr = getInt(instr, env, 1);
            for (var i = 0; i < fixedVecSize; i++) {
                setMem(val[i], addr + i);
            }
            return NEXT;
        }
    }
    util_1.unreachable(instr);
    throw "unhandled opcode " + instr.op;
}
function evalFunc(func) {
    var env = new Map();
    for (var i = 0; i < func.instrs.length; ++i) {
        var line = func.instrs[i];
        if ('op' in line) {
            var action = evalInstr(line, env);
            if ('label' in action) {
                // Search for the label and transfer control.
                for (i = 0; i < func.instrs.length; ++i) {
                    var sLine = func.instrs[i];
                    if ('label' in sLine && sLine.label === action.label) {
                        break;
                    }
                }
                if (i === func.instrs.length) {
                    throw "label " + action.label + " not found";
                }
            }
            else if ('end' in action) {
                return;
            }
        }
    }
}
function evalProg(prog) {
    for (var _i = 0, _a = prog.functions; _i < _a.length; _i++) {
        var func = _a[_i];
        if (func.name === "main") {
            evalFunc(func);
        }
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var prog, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, util_1.readStdin()];
                case 1:
                    prog = _b.apply(_a, [_c.sent()]);
                    // time the execution here, b/c file io is picked up by python
                    //console.time("brili");
                    evalProg(prog);
                    return [2 /*return*/];
            }
        });
    });
}
// Make unhandled promise rejections terminate.
process.on('unhandledRejection', function (e) { throw e; });
main();
