// Note: Some Emscripten settings will significantly limit the speed of the generated code.
// Note: Some Emscripten settings may limit the speed of the generated code.
try {
  this['Module'] = Module;
  Module.test;
} catch(e) {
  this['Module'] = Module = {};
}
// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (typeof module === "object") {
  module.exports = Module;
}
if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  Module['print'] = function(x) {
    process['stdout'].write(x + '\n');
  };
  Module['printErr'] = function(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };
  Module['readBinary'] = function(filename) { return Module['read'](filename, true) };
  Module['load'] = function(f) {
    globalEval(read(f));
  };
  if (!Module['arguments']) {
    Module['arguments'] = process['argv'].slice(2);
  }
}
if (ENVIRONMENT_IS_SHELL) {
  Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  Module['read'] = read;
  Module['readBinary'] = function(f) {
    return read(f, 'binary');
  };
  if (!Module['arguments']) {
    if (typeof scriptArgs != 'undefined') {
      Module['arguments'] = scriptArgs;
    } else if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
  }
}
if (ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER) {
  if (!Module['print']) {
    Module['print'] = function(x) {
      console.log(x);
    };
  }
  if (!Module['printErr']) {
    Module['printErr'] = function(x) {
      console.log(x);
    };
  }
}
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (!Module['arguments']) {
    if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
  }
}
if (ENVIRONMENT_IS_WORKER) {
  // We can do very little here...
  var TRY_USE_DUMP = false;
  if (!Module['print']) {
    Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }
  Module['load'] = importScripts;
}
if (!ENVIRONMENT_IS_WORKER && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_SHELL) {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***
// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];
// Callbacks
if (!Module['preRun']) Module['preRun'] = [];
if (!Module['postRun']) Module['postRun'] = [];
// === Auto-generated preamble library stuff ===
//========================================
// Runtime code shared with compiler
//========================================
var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      var logg = log2(quantum);
      return '((((' +target + ')+' + (quantum-1) + ')>>' + logg + ')<<' + logg + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type, quantumSize) {
    if (Runtime.QUANTUM_SIZE == 1) return 1;
    var size = {
      '%i1': 1,
      '%i8': 1,
      '%i16': 2,
      '%i32': 4,
      '%i64': 8,
      "%float": 4,
      "%double": 8
    }['%'+type]; // add '%' since float and double confuse Closure compiler as keys, and also spidermonkey as a compiler will remove 's from '_i8' etc
    if (!size) {
      if (type.charAt(type.length-1) == '*') {
        size = Runtime.QUANTUM_SIZE; // A pointer
      } else if (type[0] == 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 == 0);
        size = bits/8;
      }
    }
    return size;
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (type == 'i64' || type == 'double' || vararg) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    type.flatIndexes = type.fields.map(function(field) {
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        size = Types.types[field].flatSize;
        alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else {
        throw 'Unclear type in struct: ' + field + ', in ' + type.name_ + ' :: ' + dump(Types.types[type.name_]);
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      assert(args.length == sig.length-1);
      return FUNCTION_TABLE[ptr].apply(null, args);
    } else {
      assert(sig.length == 1);
      return FUNCTION_TABLE[ptr]();
    }
  },
  addFunction: function (func) {
    var table = FUNCTION_TABLE;
    var ret = table.length;
    table.push(func);
    table.push(0);
    return ret;
  },
  removeFunction: function (index) {
    var table = FUNCTION_TABLE;
    table[index] = null;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xff;
      if (needed) {
        buffer.push(code);
        needed--;
      }
      if (buffer.length == 0) {
        if (code < 128) return String.fromCharCode(code);
        buffer.push(code);
        if (code > 191 && code < 224) {
          needed = 1;
        } else {
          needed = 2;
        }
        return '';
      }
      if (needed > 0) return '';
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var ret;
      if (c1 > 191 && c1 < 224) {
        ret = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      } else {
        ret = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = ((((STACKTOP)+7)>>3)<<3);(assert((STACKTOP|0) < (STACK_MAX|0))|0); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + (assert(!staticSealed),size))|0;STATICTOP = ((((STATICTOP)+7)>>3)<<3); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + (assert(DYNAMICTOP > 0),size))|0;DYNAMICTOP = ((((DYNAMICTOP)+7)>>3)<<3); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? (((low)>>>(0))+(((high)>>>(0))*4294967296)) : (((low)>>>(0))+(((high)|(0))*4294967296))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var setjmpId = 1; // Used in setjmp/longjmp
var setjmpLabels = {};
var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function abort(text) {
  Module.print(text + ':\n' + (new Error).stack);
  ABORT = true;
  throw "Assertion: " + text;
}
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}
var globalScope = this;
// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;
// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = globalScope['Module']['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}
// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length+1);
      writeStringToMemory(value, ret);
      return ret;
    } else if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}
// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;
// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,Math.min(Math.floor((value)/4294967296), 4294967295)>>>0],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;
// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;
// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === 'string' ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }
  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }
  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }
  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    assert(type, 'Must know what type to store in allocate!');
    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
    setValue(ret+i, curr, type);
    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
Module['allocate'] = allocate;
function Pointer_stringify(ptr, /* optional */ length) {
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = '';
  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    assert(ptr + i < TOTAL_MEMORY);
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return ((x+4095)>>12)<<12;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk
function enlargeMemory() {
  abort('Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value, (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 2048;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 65536;
var FAST_MEMORY = Module['FAST_MEMORY'] || 32768;
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(!!Int32Array && !!Float64Array && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');
var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATINIT__ = []; // functions called during startup
var __ATMAIN__ = []; // functions called when main() is to be run
var __ATEXIT__ = []; // functions called during shutdown
var runtimeInitialized = false;
function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}
// Tools
// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;
// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;
function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}
if (!Math['imul']) Math['imul'] = function(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyTracking = {};
var calledInit = false, calledRun = false;
var runDependencyWatcher = null;
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            Module.printErr('still waiting on run dependencies:');
          }
          Module.printErr('dependency: ' + dep);
        }
        if (shown) {
          Module.printErr('(end of list)');
        }
      }, 10000);
    }
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    } 
    // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    if (!calledRun && shouldRunNow) run();
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
function addPreRun(func) {
  if (!Module['preRun']) Module['preRun'] = [];
  else if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
  Module['preRun'].push(func);
}
var awaitingMemoryInitializer = false;
function loadMemoryInitializer(filename) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
    runPostSets();
  }
  // always do this asynchronously, to keep shell and web as similar as possible
  addPreRun(function() {
    if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
      applyData(Module['readBinary'](filename));
    } else {
      Browser.asyncLoad(filename, function(data) {
        applyData(data);
      }, function(data) {
        throw 'could not load memory initializer ' + filename;
      });
    }
  });
  awaitingMemoryInitializer = false;
}
// === Body ===
STATIC_BASE = 8;
STATICTOP = STATIC_BASE + 6472;
/* memory initializer */ allocate([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,61,0,0,0,0,0,0,0,36,78,0,0,0,0,0,0,32,70,0,0,0,0,0,0,32,84,0,0,0,0,0,0,32,77,56,0,0,0,0,0,32,77,57,0,0,0,0,0,32,77,53,0,0,0,0,0,32,77,52,0,0,0,0,0,32,77,51,0,0,0,0,0,32,77,50,0,0,0,0,0,86,97,108,117,101,32,60,32,48,46,48,0,0,0,0,0,32,77,49,0,0,0,0,0,32,77,48,0,0,0,0,0,32,71,57,52,0,0,0,0,32,71,57,51,0,0,0,0,32,71,57,49,0,0,0,0,32,71,57,48,0,0,0,0,32,71,50,49,0,0,0,0,32,71,50,48,0,0,0,0,32,71,49,57,0,0,0,0,32,71,49,56,0,0,0,0,83,101,116,116,105,110,103,32,100,105,115,97,98,108,101,100,0,0,0,0,0,0,0,0,32,71,49,55,0,0,0,0,32,71,0,0,0,0,0,0,91,71,56,48,0,0,0,0,91,71,51,0,0,0,0,0,91,71,50,0,0,0,0,0,91,71,49,0,0,0,0,0,91,71,48,0,0,0,0,0,91,71,57,50,58,0,0,0,44,0,0,0,0,0,0,0,51,48,58,0,0,0,0,0,73,110,118,97,108,105,100,32,115,116,97,116,101,109,101,110,116,0,0,0,0,0,0,0,50,56,58,0,0,0,0,0,53,57,58,0,0,0,0,0,53,56,58,0,0,0,0,0,53,55,58,0,0,0,0,0,53,54,58,0,0,0,0,0,53,53,58,0,0,0,0,0,53,52,58,0,0,0,0,0,91,71,0,0,0,0,0,0,32,40,104,111,109,105,110,103,32,112,117,108,108,45,111,102,102,44,32,109,109,41,13,10,0,0,0,0,0,0,0,0,32,40,104,111,109,105,110,103,32,100,101,98,111,117,110,99,101,44,32,109,115,101,99,41,13,10,36,50,57,61,0,0,77,111,100,97,108,32,103,114,111,117,112,32,118,105,111,108,97,116,105,111,110,0,0,0,32,40,104,111,109,105,110,103,32,115,101,101,107,44,32,109,109,47,109,105,110,41,13,10,36,50,56,61,0,0,0,0,32,40,104,111,109,105,110,103,32,102,101,101,100,44,32,109,109,47,109,105,110,41,13,10,36,50,55,61,0,0,0,0,41,13,10,36,50,54,61,0,32,40,104,111,109,105,110,103,32,100,105,114,32,105,110,118,101,114,116,32,109,97,115,107,44,32,105,110,116,58,0,0,32,40,104,111,109,105,110,103,32,99,121,99,108,101,44,32,98,111,111,108,41,13,10,36,50,53,61,0,0,0,0,0,32,40,104,97,114,100,32,108,105,109,105,116,115,44,32,98,111,111,108,41,13,10,36,50,52,61,0,0,0,0,0,0,32,40,115,111,102,116,32,108,105,109,105,116,115,44,32,98,111,111,108,41,13,10,36,50,51,61,0,0,0,0,0,0,32,40,105,110,118,101,114,116,32,115,116,101,112,32,101,110,97,98,108,101,44,32,98,111,111,108,41,13,10,36,50,50,61,0,0,0,0,0,0,0,32,40,97,117,116,111,32,115,116,97,114,116,44,32,98,111,111,108,41,13,10,36,50,49,61,0,0,0,0,0,0,0,32,40,114,101,112,111,114,116,32,105,110,99,104,101,115,44,32,98,111,111,108,41,13,10,36,50,48,61,0,0,0,0,73,110,118,97,108,105,100,32,114,97,100,105,117,115,0,0,32,40,110,45,100,101,99,105,109,97,108,115,44,32,105,110,116,41,13,10,36,49,57,61,0,0,0,0,0,0,0,0,32,40,97,114,99,32,116,111,108,101,114,97,110,99,101,44,32,109,109,41,13,10,36,49,56,61,0,0,0,0,0,0,32,40,106,117,110,99,116,105,111,110,32,100,101,118,105,97,116,105,111,110,44,32,109,109,41,13,10,36,49,55,61,0,32,40,115,116,101,112,32,105,100,108,101,32,100,101,108,97,121,44,32,109,115,101,99,41,13,10,36,49,54,61,0,0,41,13,10,36,49,53,61,0,32,40,115,116,101,112,32,112,111,114,116,32,105,110,118,101,114,116,32,109,97,115,107,44,32,105,110,116,58,0,0,0,32,40,100,101,102,97,117,108,116,32,102,101,101,100,44,32,109,109,47,109,105,110,41,13,10,36,49,52,61,0,0,0,32,40,115,116,101,112,32,112,117,108,115,101,44,32,117,115,101,99,41,13,10,36,49,51,61,0,0,0,0,0,0,0,32,40,122,32,109,97,120,32,116,114,97,118,101,108,44,32,109,109,41,13,10,36,49,50,61,0,0,0,0,0,0,0,32,40,121,32,109,97,120,32,116,114,97,118,101,108,44,32,109,109,41,13,10,36,49,49,61,0,0,0,0,0,0,0,85,110,115,117,112,112,111,114,116,101,100,32,115,116,97,116,101,109,101,110,116,0,0,0,32,40,120,32,109,97,120,32,116,114,97,118,101,108,44,32,109,109,41,13,10,36,49,48,61,0,0,0,0,0,0,0,32,40,122,32,97,99,99,101,108,44,32,109,109,47,115,101,99,94,50,41,13,10,36,57,61,0,0,0,0,0,0,0,32,40,121,32,97,99,99,101,108,44,32,109,109,47,115,101,99,94,50,41,13,10,36,56,61,0,0,0,0,0,0,0,32,40,120,32,97,99,99,101,108,44,32,109,109,47,115,101,99,94,50,41,13,10,36,55,61,0,0,0,0,0,0,0,32,40,122,32,118,95,109,97,120,44,32,109,109,47,109,105,110,41,13,10,36,54,61,0,32,40,121,32,118,95,109,97,120,44,32,109,109,47,109,105,110,41,13,10,36,53,61,0,32,40,120,32,118,95,109,97,120,44,32,109,109,47,109,105,110,41,13,10,36,52,61,0,32,40,122,44,32,115,116,101,112,47,109,109,41,13,10,36,51,61,0,0,0,0,0,0,32,40,121,44,32,115,116,101,112,47,109,109,41,13,10,36,50,61,0,0,0,0,0,0,32,40,120,44,32,115,116,101,112,47,109,109,41,13,10,36,49,61,0,0,0,0,0,0,69,120,112,101,99,116,101,100,32,99,111,109,109,97,110,100,32,108,101,116,116,101,114,0,36,48,61,0,0,0,0,0,36,36,32,40,118,105,101,119,32,71,114,98,108,32,115,101,116,116,105,110,103,115,41,13,10,36,35,32,40,118,105,101,119,32,35,32,112,97,114,97,109,101,116,101,114,115,41,13,10,36,71,32,40,118,105,101,119,32,112,97,114,115,101,114,32,115,116,97,116,101,41,13,10,36,78,32,40,118,105,101,119,32,115,116,97,114,116,117,112,32,98,108,111,99,107,115,41,13,10,36,120,61,118,97,108,117,101,32,40,115,97,118,101,32,71,114,98,108,32,115,101,116,116,105,110,103,41,13,10,36,78,120,61,108,105,110,101,32,40,115,97,118,101,32,115,116,97,114,116,117,112,32,98,108,111,99,107,41,13,10,36,67,32,40,99,104,101,99,107,32,103,99,111,100,101,32,109,111,100,101,41,13,10,36,88,32,40,107,105,108,108,32,97,108,97,114,109,32,108,111,99,107,41,13,10,36,72,32,40,114,117,110,32,104,111,109,105,110,103,32,99,121,99,108,101,41,13,10,126,32,40,99,121,99,108,101,32,115,116,97,114,116,41,13,10,33,32,40,102,101,101,100,32,104,111,108,100,41,13,10,63,32,40,99,117,114,114,101,110,116,32,115,116,97,116,117,115,41,13,10,99,116,114,108,45,120,32,40,114,101,115,101,116,32,71,114,98,108,41,13,10,0,0,0,13,10,71,114,98,108,32,48,46,57,97,32,91,39,36,39,32,102,111,114,32,104,101,108,112,93,13,10,0,0,0,0,93,13,10,0,0,0,0,0,68,105,115,97,98,108,101,100,0,0,0,0,0,0,0,0,69,110,97,98,108,101,100,0,67,97,117,116,105,111,110,58,32,85,110,108,111,99,107,101,100,0,0,0,0,0,0,0,39,36,72,39,124,39,36,88,39,32,116,111,32,117,110,108,111,99,107,0,0,0,0,0,82,101,115,101,116,32,116,111,32,99,111,110,116,105,110,117,101,0,0,0,0,0,0,0,91,0,0,0,0,0,0,0,66,97,100,32,110,117,109,98,101,114,32,102,111,114,109,97,116,0,0,0,0,0,0,0,46,32,77,80,111,115,63,13,10,0,0,0,0,0,0,0,65,98,111,114,116,32,100,117,114,105,110,103,32,99,121,99,108,101,0,0,0,0,0,0,72,97,114,100,47,115,111,102,116,32,108,105,109,105,116,0,65,76,65,82,77,58,32,0,13,10,0,0,0,0,0,0,72,111,109,105,110,103,32,110,111,116,32,101,110,97,98,108,101,100,0,0,0,0,0,0,65,108,97,114,109,32,108,111,99,107,0,0,0,0,0,0,66,117,115,121,32,111,114,32,113,117,101,117,101,100,0,0,69,69,80,82,79,77,32,114,101,97,100,32,102,97,105,108,46,32,85,115,105,110,103,32,100,101,102,97,117,108,116,115,0,0,0,0,0,0,0,0,62,13,10,0,0,0,0,0,87,80,111,115,58,0,0,0,44,77,80,111,115,58,0,0,60,67,104,101,99,107,0,0,60,65,108,97,114,109,0,0,60,72,111,109,101,0,0,0,60,72,111,108,100,0,0,0,60,82,117,110,0,0,0,0,60,81,117,101,117,101,0,0,60,73,100,108,101,0,0,0,86,97,108,117,101,32,60,32,51,32,117,115,101,99,0,0,101,114,114,111,114,58,32,0,111,107,13,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE)
function runPostSets() {
}
if (!awaitingMemoryInitializer) runPostSets();
var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
}
  function _memset(ptr, value, num) {
      ptr = ptr|0; value = value|0; num = num|0;
      var stop = 0, value4 = 0, stop4 = 0, unaligned = 0;
      stop = (ptr + num)|0;
      if ((num|0) >= 20) {
        // This is unaligned, but quite large, so work hard to get to aligned settings
        value = value & 0xff;
        unaligned = ptr & 3;
        value4 = value | (value << 8) | (value << 16) | (value << 24);
        stop4 = stop & ~3;
        if (unaligned) {
          unaligned = (ptr + 4 - unaligned)|0;
          while ((ptr|0) < (unaligned|0)) { // no need to check for stop, since we have large num
            HEAP8[(ptr)]=value;
            ptr = (ptr+1)|0;
          }
        }
        while ((ptr|0) < (stop4|0)) {
          HEAP32[((ptr)>>2)]=value4;
          ptr = (ptr+4)|0;
        }
      }
      while ((ptr|0) < (stop|0)) {
        HEAP8[(ptr)]=value;
        ptr = (ptr+1)|0;
      }
    }var _llvm_memset_p0i8_i32=_memset;
  var _atan2=Math.atan2;
  function _hypot(a, b) {
       return Math.sqrt(a*a + b*b);
    }
  var _fabs=Math.abs;
  var _floor=Math.floor;
  var _sqrt=Math.sqrt;
  var _cos=Math.cos;
  var _sin=Math.sin;
  function _round(x) {
      return (x < 0) ? -Math.round(-x) : Math.round(x);
    }var _lround=_round;
  function _trunc(x) {
      return (x < 0) ? Math.ceil(x) : Math.floor(x);
    }
  function _memcpy(dest, src, num) {
      dest = dest|0; src = src|0; num = num|0;
      var ret = 0;
      ret = dest|0;
      if ((dest&3) == (src&3)) {
        while (dest & 3) {
          if ((num|0) == 0) return ret|0;
          HEAP8[(dest)]=HEAP8[(src)];
          dest = (dest+1)|0;
          src = (src+1)|0;
          num = (num-1)|0;
        }
        while ((num|0) >= 4) {
          HEAP32[((dest)>>2)]=HEAP32[((src)>>2)];
          dest = (dest+4)|0;
          src = (src+4)|0;
          num = (num-4)|0;
        }
      }
      while ((num|0) > 0) {
        HEAP8[(dest)]=HEAP8[(src)];
        dest = (dest+1)|0;
        src = (src+1)|0;
        num = (num-1)|0;
      }
      return ret|0;
    }var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  var _labs=Math.abs;
  var _abs=Math.abs;
  var _ceil=Math.ceil;
  function _console_string(pointer) {
    while ((value = getValue(pointer, 'i8')) !== 0) {
      _console_char(value);
      pointer += 1;
    }
  }
  function _console_char(value) {
    if (value === 13) {
      console.log(this.line_buffer);
      this.line_buffer = "";
    } else {
      if (typeof this.line_buffer == "undefined") {
        this.line_buffer = ""
      }
      this.line_buffer += String.fromCharCode(value);
    }
  }
  function _malloc(bytes) {
      /* Over-allocate to make sure it is byte-aligned by 8.
       * This will leak memory, but this is only the dummy
       * implementation (replaced by dlmalloc normally) so
       * not an issue.
       */
      var ptr = Runtime.dynamicAlloc(bytes + 8);
      return (ptr+8) & 0xFFFFFFF8;
    }
  Module["_malloc"] = _malloc;
  function _free() {
  }
  function _strlen(ptr) {
      ptr = ptr|0;
      var curr = 0;
      curr = ptr;
      while (HEAP8[(curr)]) {
        curr = (curr + 1)|0;
      }
      return (curr - ptr)|0;
    }
  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : console.log("warning: cannot create object URLs");
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        function getMimetype(name) {
          return {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'bmp': 'image/bmp',
            'ogg': 'audio/ogg',
            'wav': 'audio/wav',
            'mp3': 'audio/mpeg'
          }[name.substr(name.lastIndexOf('.')+1)];
        }
        var imagePlugin = {};
        imagePlugin['canHandle'] = function(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/.exec(name);
        };
        imagePlugin['handle'] = function(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: getMimetype(name) });
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          assert(typeof url == 'string', 'createObjectURL must return a url as a string');
          var img = new Image();
          img.onload = function() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            assert(typeof url == 'string', 'createObjectURL must return a url as a string');
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
        // Canvas event setup
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule) {
        var ctx;
        try {
          if (useWebGL) {
            ctx = canvas.getContext('experimental-webgl', {
              alpha: false
            });
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas - ' + e);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function (func) {
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                         window['mozRequestAnimationFrame'] ||
                                         window['webkitRequestAnimationFrame'] ||
                                         window['msRequestAnimationFrame'] ||
                                         window['oRequestAnimationFrame'] ||
                                         window['setTimeout'];
        }
        window.requestAnimationFrame(func);
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x = event.pageX - (window.scrollX + rect.left);
          var y = event.pageY - (window.scrollY + rect.top);
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
Module["requestFullScreen"] = function(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function(func) { Browser.requestAnimationFrame(func) };
  Module["pauseMainLoop"] = function() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
staticSealed = true; // seal the static portion of memory
STACK_MAX = STACK_BASE + 2048;
DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE < TOTAL_MEMORY); // Stack must fit in TOTAL_MEMORY; allocations from here on may enlarge TOTAL_MEMORY
var FUNCTION_TABLE = [0, 0];
// EMSCRIPTEN_START_FUNCS
function _select_plane($axis_0, $axis_1, $axis_2) {
 var label = 0;
 var $1;
 var $2;
 var $3;
 $1=$axis_0;
 $2=$axis_1;
 $3=$axis_2;
 var $4=$1;
 HEAP8[((((313)|0))|0)]=$4;
 var $5=$2;
 HEAP8[((((314)|0))|0)]=$5;
 var $6=$3;
 HEAP8[((((315)|0))|0)]=$6;
 return;
}
function _gc_set_current_position($x, $y, $z) {
 var label = 0;
 var $1;
 var $2;
 var $3;
 $1=$x;
 $2=$y;
 $3=$z;
 var $4=$1;
 var $5=(($4)|(0));
 var $6=HEAPF32[((((96)|0))>>2)];
 var $7=($5)/($6);
 HEAPF32[((((300)|0))>>2)]=$7;
 var $8=$2;
 var $9=(($8)|(0));
 var $10=HEAPF32[((((100)|0))>>2)];
 var $11=($9)/($10);
 HEAPF32[((((304)|0))>>2)]=$11;
 var $12=$3;
 var $13=(($12)|(0));
 var $14=HEAPF32[((((104)|0))>>2)];
 var $15=($13)/($14);
 HEAPF32[((((308)|0))>>2)]=$15;
 return;
}
function _main() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   $1=0;
   _serial_init();
   _settings_init();
   _st_init();
   HEAP32[((((32)|0))>>2)]=0; HEAP32[(((((32)|0))+(4))>>2)]=0; HEAP32[(((((32)|0))+(8))>>2)]=0; HEAP32[(((((32)|0))+(12))>>2)]=0; HEAP32[(((((32)|0))+(16))>>2)]=0;
   HEAP8[((((32)|0))|0)]=1;
   HEAP8[((((33)|0))|0)]=1;
   var $2=HEAP8[((((32)|0))|0)];
   var $3=(($2 << 24) >> 24)!=0;
   if ($3) { label = 2; break; } else { label = 11; break; }
  case 2: 
   _serial_reset_read_buffer();
   _plan_init();
   _gc_init();
   _protocol_init();
   _spindle_init();
   _coolant_init();
   _limits_init();
   _st_reset();
   _sys_sync_current_position();
   HEAP8[((((32)|0))|0)]=0;
   HEAP8[((((34)|0))|0)]=0;
   var $5=HEAP8[((((144)|0))|0)];
   var $6=(($5)&(255));
   var $7=$6 & 2;
   var $8=(($7)|(0))!=0;
   if ($8) { label = 3; break; } else { label = 4; break; }
  case 3: 
   HEAP8[((((48)|0))|0)]=1;
   label = 4; break;
  case 4: 
   var $11=HEAP8[((((33)|0))|0)];
   var $12=(($11)&(255));
   var $13=(($12)|(0))==1;
   if ($13) { label = 5; break; } else { label = 7; break; }
  case 5: 
   var $15=HEAP8[((((144)|0))|0)];
   var $16=(($15)&(255));
   var $17=$16 & 16;
   var $18=(($17)|(0))!=0;
   if ($18) { label = 6; break; } else { label = 7; break; }
  case 6: 
   HEAP8[((((33)|0))|0)]=6;
   label = 7; break;
  case 7: 
   var $21=HEAP8[((((33)|0))|0)];
   var $22=(($21)&(255));
   var $23=(($22)|(0))==6;
   if ($23) { label = 8; break; } else { label = 9; break; }
  case 8: 
   _report_feedback_message(2);
   label = 10; break;
  case 9: 
   HEAP8[((((33)|0))|0)]=0;
   _protocol_execute_startup();
   label = 10; break;
  case 10: 
   label = 11; break;
  case 11: 
   _protocol_execute_runtime();
   _protocol_process();
   _mc_auto_cycle_start();
   return 0;
  default: assert(0, "bad label: " + label);
 }
}
Module["_main"] = _main;
function _mc_line($target, $feed_rate, $invert_feed_rate) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2;
   var $3;
   $1=$target;
   $2=$feed_rate;
   $3=$invert_feed_rate;
   var $4=HEAP8[((((144)|0))|0)];
   var $5=(($4)&(255));
   var $6=$5 & 32;
   var $7=(($6)|(0))!=0;
   if ($7) { label = 2; break; } else { label = 3; break; }
  case 2: 
   var $9=$1;
   _limits_soft_check($9);
   label = 3; break;
  case 3: 
   var $11=HEAP8[((((33)|0))|0)];
   var $12=(($11)&(255));
   var $13=(($12)|(0))==7;
   if ($13) { label = 4; break; } else { label = 5; break; }
  case 4: 
   label = 15; break;
  case 5: 
   label = 6; break;
  case 6: 
   _protocol_execute_runtime();
   var $17=HEAP8[((((32)|0))|0)];
   var $18=(($17 << 24) >> 24)!=0;
   if ($18) { label = 7; break; } else { label = 8; break; }
  case 7: 
   label = 15; break;
  case 8: 
   var $21=_plan_check_full_buffer();
   var $22=(($21 << 24) >> 24)!=0;
   if ($22) { label = 9; break; } else { label = 10; break; }
  case 9: 
   _mc_auto_cycle_start();
   label = 11; break;
  case 10: 
   label = 13; break;
  case 11: 
   label = 12; break;
  case 12: 
   if (1) { label = 6; break; } else { label = 13; break; }
  case 13: 
   var $28=$1;
   var $29=(($28)|0);
   var $30=HEAPF32[(($29)>>2)];
   var $31=$1;
   var $32=(($31+4)|0);
   var $33=HEAPF32[(($32)>>2)];
   var $34=$1;
   var $35=(($34+8)|0);
   var $36=HEAPF32[(($35)>>2)];
   var $37=$2;
   var $38=$3;
   _plan_buffer_line($30, $33, $36, $37, $38);
   var $39=HEAP8[((((33)|0))|0)];
   var $40=(($39 << 24) >> 24)!=0;
   if ($40) { label = 15; break; } else { label = 14; break; }
  case 14: 
   HEAP8[((((33)|0))|0)]=2;
   label = 15; break;
  case 15: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _mc_arc($position, $target, $offset, $axis_0, $axis_1, $axis_linear, $feed_rate, $invert_feed_rate, $radius, $isclockwise) {
 var label = 0;
 var __stackBase__  = STACKTOP; STACKTOP = (STACKTOP + 16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2;
   var $3;
   var $4;
   var $5;
   var $6;
   var $7;
   var $8;
   var $9;
   var $10;
   var $center_axis0;
   var $center_axis1;
   var $linear_travel;
   var $r_axis0;
   var $r_axis1;
   var $rt_axis0;
   var $rt_axis1;
   var $angular_travel;
   var $millimeters_of_travel;
   var $segments;
   var $theta_per_segment;
   var $linear_per_segment;
   var $cos_T;
   var $sin_T;
   var $arc_target=__stackBase__;
   var $sin_Ti;
   var $cos_Ti;
   var $r_axisi;
   var $i;
   var $count;
   $1=$position;
   $2=$target;
   $3=$offset;
   $4=$axis_0;
   $5=$axis_1;
   $6=$axis_linear;
   $7=$feed_rate;
   $8=$invert_feed_rate;
   $9=$radius;
   $10=$isclockwise;
   var $11=$4;
   var $12=(($11)&(255));
   var $13=$1;
   var $14=(($13+($12<<2))|0);
   var $15=HEAPF32[(($14)>>2)];
   var $16=$4;
   var $17=(($16)&(255));
   var $18=$3;
   var $19=(($18+($17<<2))|0);
   var $20=HEAPF32[(($19)>>2)];
   var $21=($15)+($20);
   $center_axis0=$21;
   var $22=$5;
   var $23=(($22)&(255));
   var $24=$1;
   var $25=(($24+($23<<2))|0);
   var $26=HEAPF32[(($25)>>2)];
   var $27=$5;
   var $28=(($27)&(255));
   var $29=$3;
   var $30=(($29+($28<<2))|0);
   var $31=HEAPF32[(($30)>>2)];
   var $32=($26)+($31);
   $center_axis1=$32;
   var $33=$6;
   var $34=(($33)&(255));
   var $35=$2;
   var $36=(($35+($34<<2))|0);
   var $37=HEAPF32[(($36)>>2)];
   var $38=$6;
   var $39=(($38)&(255));
   var $40=$1;
   var $41=(($40+($39<<2))|0);
   var $42=HEAPF32[(($41)>>2)];
   var $43=($37)-($42);
   $linear_travel=$43;
   var $44=$4;
   var $45=(($44)&(255));
   var $46=$3;
   var $47=(($46+($45<<2))|0);
   var $48=HEAPF32[(($47)>>2)];
   var $49=(-$48);
   $r_axis0=$49;
   var $50=$5;
   var $51=(($50)&(255));
   var $52=$3;
   var $53=(($52+($51<<2))|0);
   var $54=HEAPF32[(($53)>>2)];
   var $55=(-$54);
   $r_axis1=$55;
   var $56=$4;
   var $57=(($56)&(255));
   var $58=$2;
   var $59=(($58+($57<<2))|0);
   var $60=HEAPF32[(($59)>>2)];
   var $61=$center_axis0;
   var $62=($60)-($61);
   $rt_axis0=$62;
   var $63=$5;
   var $64=(($63)&(255));
   var $65=$2;
   var $66=(($65+($64<<2))|0);
   var $67=HEAPF32[(($66)>>2)];
   var $68=$center_axis1;
   var $69=($67)-($68);
   $rt_axis1=$69;
   var $70=$r_axis0;
   var $71=$rt_axis1;
   var $72=($70)*($71);
   var $73=$r_axis1;
   var $74=$rt_axis0;
   var $75=($73)*($74);
   var $76=($72)-($75);
   var $77=$76;
   var $78=$r_axis0;
   var $79=$rt_axis0;
   var $80=($78)*($79);
   var $81=$r_axis1;
   var $82=$rt_axis1;
   var $83=($81)*($82);
   var $84=($80)+($83);
   var $85=$84;
   var $86=Math.atan2($77, $85);
   var $87=$86;
   $angular_travel=$87;
   var $88=$10;
   var $89=(($88 << 24) >> 24)!=0;
   if ($89) { label = 2; break; } else { label = 5; break; }
  case 2: 
   var $91=$angular_travel;
   var $92=$91 >= 0;
   if ($92) { label = 3; break; } else { label = 4; break; }
  case 3: 
   var $94=$angular_travel;
   var $95=$94;
   var $96=($95)-(6.283185307179586);
   var $97=$96;
   $angular_travel=$97;
   label = 4; break;
  case 4: 
   label = 8; break;
  case 5: 
   var $100=$angular_travel;
   var $101=$100 <= 0;
   if ($101) { label = 6; break; } else { label = 7; break; }
  case 6: 
   var $103=$angular_travel;
   var $104=$103;
   var $105=($104)+(6.283185307179586);
   var $106=$105;
   $angular_travel=$106;
   label = 7; break;
  case 7: 
   label = 8; break;
  case 8: 
   var $109=$angular_travel;
   var $110=$9;
   var $111=($109)*($110);
   var $112=$111;
   var $113=$linear_travel;
   var $114=$113;
   var $115=Math.abs($114);
   var $116=_hypot($112, $115);
   var $117=$116;
   $millimeters_of_travel=$117;
   var $118=$millimeters_of_travel;
   var $119=$118;
   var $120=HEAPF32[((((124)|0))>>2)];
   var $121=($120)*(4);
   var $122=$9;
   var $123=($122)*(2);
   var $124=HEAPF32[((((124)|0))>>2)];
   var $125=($123)-($124);
   var $126=($121)*($125);
   var $127=$126;
   var $128=Math.sqrt($127);
   var $129=($119)/($128);
   var $130=Math.floor($129);
   var $131=($130>=0 ? Math.floor($130) : Math.ceil($130));
   $segments=$131;
   var $132=$segments;
   var $133=(($132 << 16) >> 16)!=0;
   if ($133) { label = 9; break; } else { label = 21; break; }
  case 9: 
   var $135=$8;
   var $136=(($135 << 24) >> 24)!=0;
   if ($136) { label = 10; break; } else { label = 11; break; }
  case 10: 
   var $138=$segments;
   var $139=(($138)&(65535));
   var $140=(($139)|(0));
   var $141=$7;
   var $142=($141)*($140);
   $7=$142;
   label = 11; break;
  case 11: 
   var $144=$angular_travel;
   var $145=$segments;
   var $146=(($145)&(65535));
   var $147=(($146)|(0));
   var $148=($144)/($147);
   $theta_per_segment=$148;
   var $149=$linear_travel;
   var $150=$segments;
   var $151=(($150)&(65535));
   var $152=(($151)|(0));
   var $153=($149)/($152);
   $linear_per_segment=$153;
   var $154=$theta_per_segment;
   var $155=$theta_per_segment;
   var $156=($154)*($155);
   var $157=(2)-($156);
   $cos_T=$157;
   var $158=$theta_per_segment;
   var $159=$158;
   var $160=($159)*(0.16666667);
   var $161=$cos_T;
   var $162=($161)+(4);
   var $163=$162;
   var $164=($160)*($163);
   var $165=$164;
   $sin_T=$165;
   var $166=$cos_T;
   var $167=$166;
   var $168=($167)*(0.5);
   var $169=$168;
   $cos_T=$169;
   $count=0;
   var $170=$6;
   var $171=(($170)&(255));
   var $172=$1;
   var $173=(($172+($171<<2))|0);
   var $174=HEAPF32[(($173)>>2)];
   var $175=$6;
   var $176=(($175)&(255));
   var $177=(($arc_target+($176<<2))|0);
   HEAPF32[(($177)>>2)]=$174;
   $i=1;
   label = 12; break;
  case 12: 
   var $179=$i;
   var $180=(($179)&(65535));
   var $181=$segments;
   var $182=(($181)&(65535));
   var $183=(($180)|(0)) < (($182)|(0));
   if ($183) { label = 13; break; } else { label = 20; break; }
  case 13: 
   var $185=$count;
   var $186=(($185)&(255));
   var $187=(($186)|(0)) < 20;
   if ($187) { label = 14; break; } else { label = 15; break; }
  case 14: 
   var $189=$r_axis0;
   var $190=$sin_T;
   var $191=($189)*($190);
   var $192=$r_axis1;
   var $193=$cos_T;
   var $194=($192)*($193);
   var $195=($191)+($194);
   $r_axisi=$195;
   var $196=$r_axis0;
   var $197=$cos_T;
   var $198=($196)*($197);
   var $199=$r_axis1;
   var $200=$sin_T;
   var $201=($199)*($200);
   var $202=($198)-($201);
   $r_axis0=$202;
   var $203=$r_axisi;
   $r_axis1=$203;
   var $204=$count;
   var $205=((($204)+(1))&255);
   $count=$205;
   label = 16; break;
  case 15: 
   var $207=$i;
   var $208=(($207)&(65535));
   var $209=(($208)|(0));
   var $210=$theta_per_segment;
   var $211=($209)*($210);
   var $212=$211;
   var $213=Math.cos($212);
   var $214=$213;
   $cos_Ti=$214;
   var $215=$i;
   var $216=(($215)&(65535));
   var $217=(($216)|(0));
   var $218=$theta_per_segment;
   var $219=($217)*($218);
   var $220=$219;
   var $221=Math.sin($220);
   var $222=$221;
   $sin_Ti=$222;
   var $223=$4;
   var $224=(($223)&(255));
   var $225=$3;
   var $226=(($225+($224<<2))|0);
   var $227=HEAPF32[(($226)>>2)];
   var $228=(-$227);
   var $229=$cos_Ti;
   var $230=($228)*($229);
   var $231=$5;
   var $232=(($231)&(255));
   var $233=$3;
   var $234=(($233+($232<<2))|0);
   var $235=HEAPF32[(($234)>>2)];
   var $236=$sin_Ti;
   var $237=($235)*($236);
   var $238=($230)+($237);
   $r_axis0=$238;
   var $239=$4;
   var $240=(($239)&(255));
   var $241=$3;
   var $242=(($241+($240<<2))|0);
   var $243=HEAPF32[(($242)>>2)];
   var $244=(-$243);
   var $245=$sin_Ti;
   var $246=($244)*($245);
   var $247=$5;
   var $248=(($247)&(255));
   var $249=$3;
   var $250=(($249+($248<<2))|0);
   var $251=HEAPF32[(($250)>>2)];
   var $252=$cos_Ti;
   var $253=($251)*($252);
   var $254=($246)-($253);
   $r_axis1=$254;
   $count=0;
   label = 16; break;
  case 16: 
   var $256=$center_axis0;
   var $257=$r_axis0;
   var $258=($256)+($257);
   var $259=$4;
   var $260=(($259)&(255));
   var $261=(($arc_target+($260<<2))|0);
   HEAPF32[(($261)>>2)]=$258;
   var $262=$center_axis1;
   var $263=$r_axis1;
   var $264=($262)+($263);
   var $265=$5;
   var $266=(($265)&(255));
   var $267=(($arc_target+($266<<2))|0);
   HEAPF32[(($267)>>2)]=$264;
   var $268=$linear_per_segment;
   var $269=$6;
   var $270=(($269)&(255));
   var $271=(($arc_target+($270<<2))|0);
   var $272=HEAPF32[(($271)>>2)];
   var $273=($272)+($268);
   HEAPF32[(($271)>>2)]=$273;
   var $274=(($arc_target)|0);
   var $275=$7;
   var $276=$8;
   _mc_line($274, $275, $276);
   var $277=HEAP8[((((32)|0))|0)];
   var $278=(($277 << 24) >> 24)!=0;
   if ($278) { label = 17; break; } else { label = 18; break; }
  case 17: 
   label = 22; break;
  case 18: 
   label = 19; break;
  case 19: 
   var $282=$i;
   var $283=((($282)+(1))&65535);
   $i=$283;
   label = 12; break;
  case 20: 
   label = 21; break;
  case 21: 
   var $286=$2;
   var $287=$7;
   var $288=$8;
   _mc_line($286, $287, $288);
   label = 22; break;
  case 22: 
   STACKTOP = __stackBase__;
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _mc_dwell($seconds) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $i;
   $1=$seconds;
   var $2=$1;
   var $3=($2)*(20);
   var $4=$3;
   var $5=Math.floor($4);
   var $6=($5>=0 ? Math.floor($5) : Math.ceil($5));
   $i=$6;
   _plan_synchronize();
   var $7=$1;
   var $8=($7)*(1000);
   var $9=$i;
   var $10=(($9)&(65535));
   var $11=((($10)*(50))&-1);
   var $12=(($11)|(0));
   var $13=($8)-($12);
   var $14=$13;
   var $15=Math.floor($14);
   var $16=($15>=0 ? Math.floor($15) : Math.ceil($15));
   _delay_ms($16);
   label = 2; break;
  case 2: 
   var $18=$i;
   var $19=((($18)-(1))&65535);
   $i=$19;
   var $20=(($18)&(65535));
   var $21=(($20)|(0)) > 0;
   if ($21) { label = 3; break; } else { label = 6; break; }
  case 3: 
   _protocol_execute_runtime();
   var $23=HEAP8[((((32)|0))|0)];
   var $24=(($23 << 24) >> 24)!=0;
   if ($24) { label = 4; break; } else { label = 5; break; }
  case 4: 
   label = 6; break;
  case 5: 
   label = 2; break;
  case 6: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _mc_go_home() {
 var label = 0;
 var __stackBase__  = STACKTOP; STACKTOP = (STACKTOP + 24)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $pulloff_target=__stackBase__;
   var $dir_mask=(__stackBase__)+(16);
   var $i;
   HEAP8[((((33)|0))|0)]=5;
   var $1=HEAP8[(6112)];
   var $2=(($1)&(255));
   var $3=$2 & -15;
   var $4=(($3) & 255);
   HEAP8[(6112)]=$4;
   _limits_go_home();
   _protocol_execute_runtime();
   var $5=HEAP8[((((32)|0))|0)];
   var $6=(($5 << 24) >> 24)!=0;
   if ($6) { label = 2; break; } else { label = 3; break; }
  case 2: 
   label = 14; break;
  case 3: 
   var $9=$pulloff_target;
   HEAP32[(($9)>>2)]=0; HEAP32[((($9)+(4))>>2)]=0; HEAP32[((($9)+(8))>>2)]=0;
   HEAP32[(((((36)|0)))>>2)]=0; HEAP32[((((((36)|0)))+(4))>>2)]=0; HEAP32[((((((36)|0)))+(8))>>2)]=0;
   var $10=(($dir_mask)|0);
   HEAP8[($10)]=32;
   var $11=(($dir_mask+1)|0);
   HEAP8[($11)]=64;
   var $12=(($dir_mask+2)|0);
   HEAP8[($12)]=-128;
   $i=0;
   label = 4; break;
  case 4: 
   var $14=$i;
   var $15=(($14)&(255));
   var $16=(($15)|(0)) < 3;
   if ($16) { label = 5; break; } else { label = 12; break; }
  case 5: 
   var $18=$i;
   var $19=(($18)&(255));
   var $20=1 << $19;
   var $21=7 & $20;
   var $22=(($21)|(0))!=0;
   if ($22) { label = 6; break; } else { label = 10; break; }
  case 6: 
   var $24=HEAP8[((((145)|0))|0)];
   var $25=(($24)&(255));
   var $26=$i;
   var $27=(($26)&(255));
   var $28=(($dir_mask+$27)|0);
   var $29=HEAP8[($28)];
   var $30=(($29)&(255));
   var $31=$25 & $30;
   var $32=(($31)|(0))!=0;
   if ($32) { label = 7; break; } else { label = 8; break; }
  case 7: 
   var $34=HEAPF32[((((160)|0))>>2)];
   var $35=$i;
   var $36=(($35)&(255));
   var $37=((((180)|0)+($36<<2))|0);
   var $38=HEAPF32[(($37)>>2)];
   var $39=($34)-($38);
   var $40=$i;
   var $41=(($40)&(255));
   var $42=(($pulloff_target+($41<<2))|0);
   HEAPF32[(($42)>>2)]=$39;
   var $43=$i;
   var $44=(($43)&(255));
   var $45=((((180)|0)+($44<<2))|0);
   var $46=HEAPF32[(($45)>>2)];
   var $47=$i;
   var $48=(($47)&(255));
   var $49=((((96)|0)+($48<<2))|0);
   var $50=HEAPF32[(($49)>>2)];
   var $51=($46)*($50);
   var $52=$51;
   var $53=_round($52);
   var $54=(((-$53))|0);
   var $55=$i;
   var $56=(($55)&(255));
   var $57=((((36)|0)+($56<<2))|0);
   HEAP32[(($57)>>2)]=$54;
   label = 9; break;
  case 8: 
   var $59=HEAPF32[((((160)|0))>>2)];
   var $60=(-$59);
   var $61=$i;
   var $62=(($61)&(255));
   var $63=(($pulloff_target+($62<<2))|0);
   HEAPF32[(($63)>>2)]=$60;
   label = 9; break;
  case 9: 
   label = 10; break;
  case 10: 
   label = 11; break;
  case 11: 
   var $67=$i;
   var $68=((($67)+(1))&255);
   $i=$68;
   label = 4; break;
  case 12: 
   _sys_sync_current_position();
   HEAP8[((((33)|0))|0)]=0;
   var $70=(($pulloff_target)|0);
   var $71=HEAPF32[((((152)|0))>>2)];
   _mc_line($70, $71, 0);
   _st_cycle_start();
   _plan_synchronize();
   _sys_sync_current_position();
   var $72=HEAP8[((((144)|0))|0)];
   var $73=(($72)&(255));
   var $74=$73 & 8;
   var $75=(($74)|(0))!=0;
   if ($75) { label = 13; break; } else { label = 14; break; }
  case 13: 
   var $77=HEAP8[(6112)];
   var $78=(($77)&(255));
   var $79=$78 | 14;
   var $80=(($79) & 255);
   HEAP8[(6112)]=$80;
   label = 14; break;
  case 14: 
   STACKTOP = __stackBase__;
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _mc_auto_cycle_start() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1=HEAP8[((((48)|0))|0)];
   var $2=(($1 << 24) >> 24)!=0;
   if ($2) { label = 2; break; } else { label = 3; break; }
  case 2: 
   _st_cycle_start();
   label = 3; break;
  case 3: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _mc_reset() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1=HEAP8[((((34)|0))|0)];
   var $2=(($1)&(255));
   var $3=$2 & 16;
   var $4=(($3)|(0))==0;
   if ($4) { label = 2; break; } else { label = 5; break; }
  case 2: 
   var $6=HEAP8[((((34)|0))|0)];
   var $7=(($6)&(255));
   var $8=$7 | 16;
   var $9=(($8) & 255);
   HEAP8[((((34)|0))|0)]=$9;
   _spindle_stop();
   _coolant_stop();
   var $10=HEAP8[((((33)|0))|0)];
   var $11=(($10)&(255));
   if ((($11)|(0))==3 | (($11)|(0))==4 | (($11)|(0))==5) {
    label = 3; break;
   }
   else {
   label = 4; break;
   }
  case 3: 
   var $13=HEAP8[((((34)|0))|0)];
   var $14=(($13)&(255));
   var $15=$14 | 32;
   var $16=(($15) & 255);
   HEAP8[((((34)|0))|0)]=$16;
   _st_go_idle();
   label = 4; break;
  case 4: 
   label = 5; break;
  case 5: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _gc_init() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   _memset(((288)|0), 0, 56);
   var $1=HEAPF32[((((112)|0))>>2)];
   HEAPF32[((((296)|0))>>2)]=$1;
   _select_plane(0, 1, 2);
   HEAP8[((((292)|0))|0)]=1;
   var $2=HEAP8[((((316)|0))|0)];
   var $3=_settings_read_coord_data($2, ((320)|0));
   var $4=(($3 << 24) >> 24)!=0;
   if ($4) { label = 3; break; } else { label = 2; break; }
  case 2: 
   _report_status_message(10);
   label = 3; break;
  case 3: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _gc_execute_line($line) {
 var label = 0;
 var __stackBase__  = STACKTOP; STACKTOP = (STACKTOP + 104)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2;
   var $char_counter=__stackBase__;
   var $letter=(__stackBase__)+(8);
   var $value=(__stackBase__)+(16);
   var $int_value;
   var $modal_group_words;
   var $axis_words;
   var $inverse_feed_rate;
   var $absolute_override;
   var $non_modal_action;
   var $target=(__stackBase__)+(24);
   var $offset=(__stackBase__)+(40);
   var $group_number;
   var $p;
   var $r;
   var $l;
   var $coord_data=(__stackBase__)+(56);
   var $coord_data1=(__stackBase__)+(72);
   var $i;
   var $i2;
   var $coord_data3=(__stackBase__)+(88);
   var $i4;
   var $i5;
   var $x;
   var $y;
   var $h_x2_div_d;
   var $isclockwise;
   $2=$line;
   var $3=HEAP8[((((33)|0))|0)];
   var $4=(($3)&(255));
   var $5=(($4)|(0))==6;
   if ($5) { label = 2; break; } else { label = 3; break; }
  case 2: 
   $1=12;
   label = 241; break;
  case 3: 
   HEAP8[($char_counter)]=0;
   $modal_group_words=0;
   $axis_words=0;
   $inverse_feed_rate=-1;
   $absolute_override=0;
   $non_modal_action=0;
   var $8=$target;
   HEAP32[(($8)>>2)]=0; HEAP32[((($8)+(4))>>2)]=0; HEAP32[((($8)+(8))>>2)]=0;
   var $9=$offset;
   HEAP32[(($9)>>2)]=0; HEAP32[((($9)+(4))>>2)]=0; HEAP32[((($9)+(8))>>2)]=0;
   HEAP8[((((288)|0))|0)]=0;
   $group_number=0;
   label = 4; break;
  case 4: 
   var $11=$2;
   var $12=_next_statement($letter, $value, $11, $char_counter);
   var $13=(($12)|(0))!=0;
   if ($13) { label = 5; break; } else { label = 67; break; }
  case 5: 
   var $15=HEAPF32[(($value)>>2)];
   var $16=$15;
   var $17=_trunc($16);
   var $18=(($17)&-1);
   $int_value=$18;
   var $19=HEAP8[($letter)];
   var $20=(($19 << 24) >> 24);
   if ((($20)|(0))==71) {
    label = 6; break;
   }
   else if ((($20)|(0))==77) {
    label = 47; break;
   }
   else {
   label = 61; break;
   }
  case 6: 
   var $22=$int_value;
   if ((($22)|(0))==4 | (($22)|(0))==10 | (($22)|(0))==28 | (($22)|(0))==30 | (($22)|(0))==53 | (($22)|(0))==92) {
    label = 7; break;
   }
   else if ((($22)|(0))==0 | (($22)|(0))==1 | (($22)|(0))==2 | (($22)|(0))==3 | (($22)|(0))==80) {
    label = 8; break;
   }
   else if ((($22)|(0))==17 | (($22)|(0))==18 | (($22)|(0))==19) {
    label = 9; break;
   }
   else if ((($22)|(0))==90 | (($22)|(0))==91) {
    label = 10; break;
   }
   else if ((($22)|(0))==93 | (($22)|(0))==94) {
    label = 11; break;
   }
   else if ((($22)|(0))==20 | (($22)|(0))==21) {
    label = 12; break;
   }
   else if ((($22)|(0))==54 | (($22)|(0))==55 | (($22)|(0))==56 | (($22)|(0))==57 | (($22)|(0))==58 | (($22)|(0))==59) {
    label = 13; break;
   }
   else {
   label = 14; break;
   }
  case 7: 
   $group_number=1;
   label = 14; break;
  case 8: 
   $group_number=2;
   label = 14; break;
  case 9: 
   $group_number=3;
   label = 14; break;
  case 10: 
   $group_number=4;
   label = 14; break;
  case 11: 
   $group_number=6;
   label = 14; break;
  case 12: 
   $group_number=7;
   label = 14; break;
  case 13: 
   $group_number=9;
   label = 14; break;
  case 14: 
   var $31=$int_value;
   if ((($31)|(0))==0) {
    label = 15; break;
   }
   else if ((($31)|(0))==1) {
    label = 16; break;
   }
   else if ((($31)|(0))==2) {
    label = 17; break;
   }
   else if ((($31)|(0))==3) {
    label = 18; break;
   }
   else if ((($31)|(0))==4) {
    label = 19; break;
   }
   else if ((($31)|(0))==10) {
    label = 20; break;
   }
   else if ((($31)|(0))==17) {
    label = 21; break;
   }
   else if ((($31)|(0))==18) {
    label = 22; break;
   }
   else if ((($31)|(0))==19) {
    label = 23; break;
   }
   else if ((($31)|(0))==20) {
    label = 24; break;
   }
   else if ((($31)|(0))==21) {
    label = 25; break;
   }
   else if ((($31)|(0))==28 | (($31)|(0))==30) {
    label = 26; break;
   }
   else if ((($31)|(0))==53) {
    label = 33; break;
   }
   else if ((($31)|(0))==54 | (($31)|(0))==55 | (($31)|(0))==56 | (($31)|(0))==57 | (($31)|(0))==58 | (($31)|(0))==59) {
    label = 34; break;
   }
   else if ((($31)|(0))==80) {
    label = 35; break;
   }
   else if ((($31)|(0))==90) {
    label = 36; break;
   }
   else if ((($31)|(0))==91) {
    label = 37; break;
   }
   else if ((($31)|(0))==92) {
    label = 38; break;
   }
   else if ((($31)|(0))==93) {
    label = 43; break;
   }
   else if ((($31)|(0))==94) {
    label = 44; break;
   }
   else {
   label = 45; break;
   }
  case 15: 
   HEAP8[((((289)|0))|0)]=0;
   label = 46; break;
  case 16: 
   HEAP8[((((289)|0))|0)]=1;
   label = 46; break;
  case 17: 
   HEAP8[((((289)|0))|0)]=2;
   label = 46; break;
  case 18: 
   HEAP8[((((289)|0))|0)]=3;
   label = 46; break;
  case 19: 
   $non_modal_action=1;
   label = 46; break;
  case 20: 
   $non_modal_action=2;
   label = 46; break;
  case 21: 
   _select_plane(0, 1, 2);
   label = 46; break;
  case 22: 
   _select_plane(0, 2, 1);
   label = 46; break;
  case 23: 
   _select_plane(1, 2, 0);
   label = 46; break;
  case 24: 
   HEAP8[((((291)|0))|0)]=1;
   label = 46; break;
  case 25: 
   HEAP8[((((291)|0))|0)]=0;
   label = 46; break;
  case 26: 
   var $44=HEAPF32[(($value)>>2)];
   var $45=($44)*(10);
   var $46=$45;
   var $47=_trunc($46);
   var $48=(($47)&-1);
   $int_value=$48;
   var $49=$int_value;
   if ((($49)|(0))==280) {
    label = 27; break;
   }
   else if ((($49)|(0))==281) {
    label = 28; break;
   }
   else if ((($49)|(0))==300) {
    label = 29; break;
   }
   else if ((($49)|(0))==301) {
    label = 30; break;
   }
   else {
   label = 31; break;
   }
  case 27: 
   $non_modal_action=3;
   label = 32; break;
  case 28: 
   $non_modal_action=4;
   label = 32; break;
  case 29: 
   $non_modal_action=5;
   label = 32; break;
  case 30: 
   $non_modal_action=6;
   label = 32; break;
  case 31: 
   HEAP8[((((288)|0))|0)]=3;
   label = 32; break;
  case 32: 
   label = 46; break;
  case 33: 
   $absolute_override=1;
   label = 46; break;
  case 34: 
   var $58=$int_value;
   var $59=((($58)-(54))|0);
   var $60=(($59) & 255);
   HEAP8[((((316)|0))|0)]=$60;
   label = 46; break;
  case 35: 
   HEAP8[((((289)|0))|0)]=4;
   label = 46; break;
  case 36: 
   HEAP8[((((292)|0))|0)]=1;
   label = 46; break;
  case 37: 
   HEAP8[((((292)|0))|0)]=0;
   label = 46; break;
  case 38: 
   var $65=HEAPF32[(($value)>>2)];
   var $66=($65)*(10);
   var $67=$66;
   var $68=_trunc($67);
   var $69=(($68)&-1);
   $int_value=$69;
   var $70=$int_value;
   if ((($70)|(0))==920) {
    label = 39; break;
   }
   else if ((($70)|(0))==921) {
    label = 40; break;
   }
   else {
   label = 41; break;
   }
  case 39: 
   $non_modal_action=7;
   label = 42; break;
  case 40: 
   $non_modal_action=8;
   label = 42; break;
  case 41: 
   HEAP8[((((288)|0))|0)]=3;
   label = 42; break;
  case 42: 
   label = 46; break;
  case 43: 
   HEAP8[((((290)|0))|0)]=1;
   label = 46; break;
  case 44: 
   HEAP8[((((290)|0))|0)]=0;
   label = 46; break;
  case 45: 
   HEAP8[((((288)|0))|0)]=3;
   label = 46; break;
  case 46: 
   label = 61; break;
  case 47: 
   var $80=$int_value;
   if ((($80)|(0))==0 | (($80)|(0))==1 | (($80)|(0))==2 | (($80)|(0))==30) {
    label = 48; break;
   }
   else if ((($80)|(0))==3 | (($80)|(0))==4 | (($80)|(0))==5) {
    label = 49; break;
   }
   else {
   label = 50; break;
   }
  case 48: 
   $group_number=5;
   label = 50; break;
  case 49: 
   $group_number=8;
   label = 50; break;
  case 50: 
   var $84=$int_value;
   if ((($84)|(0))==0) {
    label = 51; break;
   }
   else if ((($84)|(0))==1) {
    label = 52; break;
   }
   else if ((($84)|(0))==2 | (($84)|(0))==30) {
    label = 53; break;
   }
   else if ((($84)|(0))==3) {
    label = 54; break;
   }
   else if ((($84)|(0))==4) {
    label = 55; break;
   }
   else if ((($84)|(0))==5) {
    label = 56; break;
   }
   else if ((($84)|(0))==8) {
    label = 57; break;
   }
   else if ((($84)|(0))==9) {
    label = 58; break;
   }
   else {
   label = 59; break;
   }
  case 51: 
   HEAP8[((((293)|0))|0)]=1;
   label = 60; break;
  case 52: 
   label = 60; break;
  case 53: 
   HEAP8[((((293)|0))|0)]=2;
   label = 60; break;
  case 54: 
   HEAP8[((((294)|0))|0)]=1;
   label = 60; break;
  case 55: 
   HEAP8[((((294)|0))|0)]=-1;
   label = 60; break;
  case 56: 
   HEAP8[((((294)|0))|0)]=0;
   label = 60; break;
  case 57: 
   HEAP8[((((295)|0))|0)]=1;
   label = 60; break;
  case 58: 
   HEAP8[((((295)|0))|0)]=0;
   label = 60; break;
  case 59: 
   HEAP8[((((288)|0))|0)]=3;
   label = 60; break;
  case 60: 
   label = 61; break;
  case 61: 
   var $96=$group_number;
   var $97=(($96 << 24) >> 24)!=0;
   if ($97) { label = 62; break; } else { label = 66; break; }
  case 62: 
   var $99=$modal_group_words;
   var $100=(($99)&(65535));
   var $101=$group_number;
   var $102=(($101)&(255));
   var $103=1 << $102;
   var $104=$100 & $103;
   var $105=(($104)|(0))!=0;
   if ($105) { label = 63; break; } else { label = 64; break; }
  case 63: 
   HEAP8[((((288)|0))|0)]=5;
   label = 65; break;
  case 64: 
   var $108=$group_number;
   var $109=(($108)&(255));
   var $110=1 << $109;
   var $111=$modal_group_words;
   var $112=(($111)&(65535));
   var $113=$112 | $110;
   var $114=(($113) & 65535);
   $modal_group_words=$114;
   label = 65; break;
  case 65: 
   $group_number=0;
   label = 66; break;
  case 66: 
   label = 4; break;
  case 67: 
   var $118=HEAP8[((((288)|0))|0)];
   var $119=(($118 << 24) >> 24)!=0;
   if ($119) { label = 68; break; } else { label = 69; break; }
  case 68: 
   var $121=HEAP8[((((288)|0))|0)];
   $1=$121;
   label = 241; break;
  case 69: 
   $p=0;
   $r=0;
   $l=0;
   HEAP8[($char_counter)]=0;
   label = 70; break;
  case 70: 
   var $124=$2;
   var $125=_next_statement($letter, $value, $124, $char_counter);
   var $126=(($125)|(0))!=0;
   if ($126) { label = 71; break; } else { label = 94; break; }
  case 71: 
   var $128=HEAP8[($letter)];
   var $129=(($128 << 24) >> 24);
   if ((($129)|(0))==71 | (($129)|(0))==77 | (($129)|(0))==78) {
    label = 72; break;
   }
   else if ((($129)|(0))==70) {
    label = 73; break;
   }
   else if ((($129)|(0))==73 | (($129)|(0))==74 | (($129)|(0))==75) {
    label = 79; break;
   }
   else if ((($129)|(0))==76) {
    label = 80; break;
   }
   else if ((($129)|(0))==80) {
    label = 81; break;
   }
   else if ((($129)|(0))==82) {
    label = 82; break;
   }
   else if ((($129)|(0))==83) {
    label = 83; break;
   }
   else if ((($129)|(0))==84) {
    label = 86; break;
   }
   else if ((($129)|(0))==88) {
    label = 89; break;
   }
   else if ((($129)|(0))==89) {
    label = 90; break;
   }
   else if ((($129)|(0))==90) {
    label = 91; break;
   }
   else {
   label = 92; break;
   }
  case 72: 
   label = 93; break;
  case 73: 
   var $132=HEAPF32[(($value)>>2)];
   var $133=$132 <= 0;
   if ($133) { label = 74; break; } else { label = 75; break; }
  case 74: 
   HEAP8[((((288)|0))|0)]=6;
   label = 75; break;
  case 75: 
   var $136=HEAP8[((((290)|0))|0)];
   var $137=(($136 << 24) >> 24)!=0;
   if ($137) { label = 76; break; } else { label = 77; break; }
  case 76: 
   var $139=HEAPF32[(($value)>>2)];
   var $140=_to_millimeters($139);
   $inverse_feed_rate=$140;
   label = 78; break;
  case 77: 
   var $142=HEAPF32[(($value)>>2)];
   var $143=_to_millimeters($142);
   HEAPF32[((((296)|0))>>2)]=$143;
   label = 78; break;
  case 78: 
   label = 93; break;
  case 79: 
   var $146=HEAPF32[(($value)>>2)];
   var $147=_to_millimeters($146);
   var $148=HEAP8[($letter)];
   var $149=(($148 << 24) >> 24);
   var $150=((($149)-(73))|0);
   var $151=(($offset+($150<<2))|0);
   HEAPF32[(($151)>>2)]=$147;
   label = 93; break;
  case 80: 
   var $153=HEAPF32[(($value)>>2)];
   var $154=$153;
   var $155=_trunc($154);
   var $156=($155>=0 ? Math.floor($155) : Math.ceil($155));
   $l=$156;
   label = 93; break;
  case 81: 
   var $158=HEAPF32[(($value)>>2)];
   $p=$158;
   label = 93; break;
  case 82: 
   var $160=HEAPF32[(($value)>>2)];
   var $161=_to_millimeters($160);
   $r=$161;
   label = 93; break;
  case 83: 
   var $163=HEAPF32[(($value)>>2)];
   var $164=$163 < 0;
   if ($164) { label = 84; break; } else { label = 85; break; }
  case 84: 
   HEAP8[((((288)|0))|0)]=6;
   label = 85; break;
  case 85: 
   label = 93; break;
  case 86: 
   var $168=HEAPF32[(($value)>>2)];
   var $169=$168 < 0;
   if ($169) { label = 87; break; } else { label = 88; break; }
  case 87: 
   HEAP8[((((288)|0))|0)]=6;
   label = 88; break;
  case 88: 
   var $172=HEAPF32[(($value)>>2)];
   var $173=$172;
   var $174=_trunc($173);
   var $175=($174>=0 ? Math.floor($174) : Math.ceil($174));
   HEAP8[((((312)|0))|0)]=$175;
   label = 93; break;
  case 89: 
   var $177=HEAPF32[(($value)>>2)];
   var $178=_to_millimeters($177);
   var $179=(($target)|0);
   HEAPF32[(($179)>>2)]=$178;
   var $180=$axis_words;
   var $181=(($180)&(255));
   var $182=$181 | 1;
   var $183=(($182) & 255);
   $axis_words=$183;
   label = 93; break;
  case 90: 
   var $185=HEAPF32[(($value)>>2)];
   var $186=_to_millimeters($185);
   var $187=(($target+4)|0);
   HEAPF32[(($187)>>2)]=$186;
   var $188=$axis_words;
   var $189=(($188)&(255));
   var $190=$189 | 2;
   var $191=(($190) & 255);
   $axis_words=$191;
   label = 93; break;
  case 91: 
   var $193=HEAPF32[(($value)>>2)];
   var $194=_to_millimeters($193);
   var $195=(($target+8)|0);
   HEAPF32[(($195)>>2)]=$194;
   var $196=$axis_words;
   var $197=(($196)&(255));
   var $198=$197 | 4;
   var $199=(($198) & 255);
   $axis_words=$199;
   label = 93; break;
  case 92: 
   HEAP8[((((288)|0))|0)]=3;
   label = 93; break;
  case 93: 
   label = 70; break;
  case 94: 
   var $203=HEAP8[((((288)|0))|0)];
   var $204=(($203 << 24) >> 24)!=0;
   if ($204) { label = 95; break; } else { label = 96; break; }
  case 95: 
   var $206=HEAP8[((((288)|0))|0)];
   $1=$206;
   label = 241; break;
  case 96: 
   var $208=HEAP8[((((33)|0))|0)];
   var $209=(($208)&(255));
   var $210=(($209)|(0))!=7;
   if ($210) { label = 97; break; } else { label = 98; break; }
  case 97: 
   var $212=HEAP8[((((294)|0))|0)];
   _spindle_run($212);
   var $213=HEAP8[((((295)|0))|0)];
   _coolant_run($213);
   label = 98; break;
  case 98: 
   var $215=$modal_group_words;
   var $216=(($215)&(65535));
   var $217=$216 & 512;
   var $218=(($217)|(0))!=0;
   if ($218) { label = 99; break; } else { label = 102; break; }
  case 99: 
   var $220=HEAP8[((((316)|0))|0)];
   var $221=(($coord_data)|0);
   var $222=_settings_read_coord_data($220, $221);
   var $223=(($222 << 24) >> 24)!=0;
   if ($223) { label = 101; break; } else { label = 100; break; }
  case 100: 
   $1=10;
   label = 241; break;
  case 101: 
   var $226=$coord_data;
   assert(12 % 1 === 0);HEAP32[(((((320)|0)))>>2)]=HEAP32[(($226)>>2)];HEAP32[((((((320)|0)))+(4))>>2)]=HEAP32[((($226)+(4))>>2)];HEAP32[((((((320)|0)))+(8))>>2)]=HEAP32[((($226)+(8))>>2)];
   label = 102; break;
  case 102: 
   var $228=$non_modal_action;
   var $229=(($228)&(255));
   if ((($229)|(0))==1) {
    label = 103; break;
   }
   else if ((($229)|(0))==2) {
    label = 109; break;
   }
   else if ((($229)|(0))==3 | (($229)|(0))==5) {
    label = 136; break;
   }
   else if ((($229)|(0))==4 | (($229)|(0))==6) {
    label = 156; break;
   }
   else if ((($229)|(0))==7) {
    label = 160; break;
   }
   else if ((($229)|(0))==8) {
    label = 170; break;
   }
   else {
   label = 171; break;
   }
  case 103: 
   var $231=$p;
   var $232=$231 < 0;
   if ($232) { label = 104; break; } else { label = 105; break; }
  case 104: 
   HEAP8[((((288)|0))|0)]=6;
   label = 108; break;
  case 105: 
   var $235=HEAP8[((((33)|0))|0)];
   var $236=(($235)&(255));
   var $237=(($236)|(0))!=7;
   if ($237) { label = 106; break; } else { label = 107; break; }
  case 106: 
   var $239=$p;
   _mc_dwell($239);
   label = 107; break;
  case 107: 
   label = 108; break;
  case 108: 
   label = 171; break;
  case 109: 
   var $243=$p;
   var $244=$243;
   var $245=_trunc($244);
   var $246=(($245)&-1);
   $int_value=$246;
   var $247=$l;
   var $248=(($247)&(255));
   var $249=(($248)|(0))!=2;
   if ($249) { label = 110; break; } else { label = 111; break; }
  case 110: 
   var $251=$l;
   var $252=(($251)&(255));
   var $253=(($252)|(0))!=20;
   if ($253) { label = 113; break; } else { label = 111; break; }
  case 111: 
   var $255=$int_value;
   var $256=(($255)|(0)) < 0;
   if ($256) { label = 113; break; } else { label = 112; break; }
  case 112: 
   var $258=$int_value;
   var $259=(($258)|(0)) > 6;
   if ($259) { label = 113; break; } else { label = 114; break; }
  case 113: 
   HEAP8[((((288)|0))|0)]=3;
   label = 135; break;
  case 114: 
   var $262=$axis_words;
   var $263=(($262 << 24) >> 24)!=0;
   if ($263) { label = 117; break; } else { label = 115; break; }
  case 115: 
   var $265=$l;
   var $266=(($265)&(255));
   var $267=(($266)|(0))==2;
   if ($267) { label = 116; break; } else { label = 117; break; }
  case 116: 
   HEAP8[((((288)|0))|0)]=6;
   label = 134; break;
  case 117: 
   var $270=$int_value;
   var $271=(($270)|(0)) > 0;
   if ($271) { label = 118; break; } else { label = 119; break; }
  case 118: 
   var $273=$int_value;
   var $274=((($273)-(1))|0);
   $int_value=$274;
   label = 120; break;
  case 119: 
   var $276=HEAP8[((((316)|0))|0)];
   var $277=(($276)&(255));
   $int_value=$277;
   label = 120; break;
  case 120: 
   var $279=$int_value;
   var $280=(($279) & 255);
   var $281=(($coord_data1)|0);
   var $282=_settings_read_coord_data($280, $281);
   var $283=(($282 << 24) >> 24)!=0;
   if ($283) { label = 122; break; } else { label = 121; break; }
  case 121: 
   $1=10;
   label = 241; break;
  case 122: 
   $i=0;
   label = 123; break;
  case 123: 
   var $287=$i;
   var $288=(($287)&(255));
   var $289=(($288)|(0)) < 3;
   if ($289) { label = 124; break; } else { label = 131; break; }
  case 124: 
   var $291=$axis_words;
   var $292=(($291)&(255));
   var $293=$i;
   var $294=(($293)&(255));
   var $295=1 << $294;
   var $296=$292 & $295;
   var $297=(($296)|(0))!=0;
   if ($297) { label = 125; break; } else { label = 129; break; }
  case 125: 
   var $299=$l;
   var $300=(($299)&(255));
   var $301=(($300)|(0))==20;
   if ($301) { label = 126; break; } else { label = 127; break; }
  case 126: 
   var $303=$i;
   var $304=(($303)&(255));
   var $305=((((300)|0)+($304<<2))|0);
   var $306=HEAPF32[(($305)>>2)];
   var $307=$i;
   var $308=(($307)&(255));
   var $309=(($target+($308<<2))|0);
   var $310=HEAPF32[(($309)>>2)];
   var $311=($306)-($310);
   var $312=$i;
   var $313=(($312)&(255));
   var $314=(($coord_data1+($313<<2))|0);
   HEAPF32[(($314)>>2)]=$311;
   label = 128; break;
  case 127: 
   var $316=$i;
   var $317=(($316)&(255));
   var $318=(($target+($317<<2))|0);
   var $319=HEAPF32[(($318)>>2)];
   var $320=$i;
   var $321=(($320)&(255));
   var $322=(($coord_data1+($321<<2))|0);
   HEAPF32[(($322)>>2)]=$319;
   label = 128; break;
  case 128: 
   label = 129; break;
  case 129: 
   label = 130; break;
  case 130: 
   var $326=$i;
   var $327=((($326)+(1))&255);
   $i=$327;
   label = 123; break;
  case 131: 
   var $329=$int_value;
   var $330=(($329) & 255);
   var $331=(($coord_data1)|0);
   _settings_write_coord_data($330, $331);
   var $332=HEAP8[((((316)|0))|0)];
   var $333=(($332)&(255));
   var $334=$int_value;
   var $335=(($333)|(0))==(($334)|(0));
   if ($335) { label = 132; break; } else { label = 133; break; }
  case 132: 
   var $337=$coord_data1;
   assert(12 % 1 === 0);HEAP32[(((((320)|0)))>>2)]=HEAP32[(($337)>>2)];HEAP32[((((((320)|0)))+(4))>>2)]=HEAP32[((($337)+(4))>>2)];HEAP32[((((((320)|0)))+(8))>>2)]=HEAP32[((($337)+(8))>>2)];
   label = 133; break;
  case 133: 
   label = 134; break;
  case 134: 
   label = 135; break;
  case 135: 
   $axis_words=0;
   label = 171; break;
  case 136: 
   var $342=$axis_words;
   var $343=(($342 << 24) >> 24)!=0;
   if ($343) { label = 137; break; } else { label = 148; break; }
  case 137: 
   $i2=0;
   label = 138; break;
  case 138: 
   var $346=$i2;
   var $347=(($346)&(255));
   var $348=(($347)|(0)) < 3;
   if ($348) { label = 139; break; } else { label = 147; break; }
  case 139: 
   var $350=$axis_words;
   var $351=(($350)&(255));
   var $352=$i2;
   var $353=(($352)&(255));
   var $354=1 << $353;
   var $355=$351 & $354;
   var $356=(($355)|(0))!=0;
   if ($356) { label = 140; break; } else { label = 144; break; }
  case 140: 
   var $358=HEAP8[((((292)|0))|0)];
   var $359=(($358 << 24) >> 24)!=0;
   if ($359) { label = 141; break; } else { label = 142; break; }
  case 141: 
   var $361=$i2;
   var $362=(($361)&(255));
   var $363=((((320)|0)+($362<<2))|0);
   var $364=HEAPF32[(($363)>>2)];
   var $365=$i2;
   var $366=(($365)&(255));
   var $367=((((332)|0)+($366<<2))|0);
   var $368=HEAPF32[(($367)>>2)];
   var $369=($364)+($368);
   var $370=$i2;
   var $371=(($370)&(255));
   var $372=(($target+($371<<2))|0);
   var $373=HEAPF32[(($372)>>2)];
   var $374=($373)+($369);
   HEAPF32[(($372)>>2)]=$374;
   label = 143; break;
  case 142: 
   var $376=$i2;
   var $377=(($376)&(255));
   var $378=((((300)|0)+($377<<2))|0);
   var $379=HEAPF32[(($378)>>2)];
   var $380=$i2;
   var $381=(($380)&(255));
   var $382=(($target+($381<<2))|0);
   var $383=HEAPF32[(($382)>>2)];
   var $384=($383)+($379);
   HEAPF32[(($382)>>2)]=$384;
   label = 143; break;
  case 143: 
   label = 145; break;
  case 144: 
   var $387=$i2;
   var $388=(($387)&(255));
   var $389=((((300)|0)+($388<<2))|0);
   var $390=HEAPF32[(($389)>>2)];
   var $391=$i2;
   var $392=(($391)&(255));
   var $393=(($target+($392<<2))|0);
   HEAPF32[(($393)>>2)]=$390;
   label = 145; break;
  case 145: 
   label = 146; break;
  case 146: 
   var $396=$i2;
   var $397=((($396)+(1))&255);
   $i2=$397;
   label = 138; break;
  case 147: 
   var $399=(($target)|0);
   _mc_line($399, -1, 0);
   label = 148; break;
  case 148: 
   var $401=$non_modal_action;
   var $402=(($401)&(255));
   var $403=(($402)|(0))==3;
   if ($403) { label = 149; break; } else { label = 152; break; }
  case 149: 
   var $405=(($coord_data3)|0);
   var $406=_settings_read_coord_data(6, $405);
   var $407=(($406 << 24) >> 24)!=0;
   if ($407) { label = 151; break; } else { label = 150; break; }
  case 150: 
   $1=10;
   label = 241; break;
  case 151: 
   label = 155; break;
  case 152: 
   var $411=(($coord_data3)|0);
   var $412=_settings_read_coord_data(7, $411);
   var $413=(($412 << 24) >> 24)!=0;
   if ($413) { label = 154; break; } else { label = 153; break; }
  case 153: 
   $1=10;
   label = 241; break;
  case 154: 
   label = 155; break;
  case 155: 
   var $417=(($coord_data3)|0);
   _mc_line($417, -1, 0);
   var $418=$coord_data3;
   assert(12 % 1 === 0);HEAP32[(((((300)|0)))>>2)]=HEAP32[(($418)>>2)];HEAP32[((((((300)|0)))+(4))>>2)]=HEAP32[((($418)+(4))>>2)];HEAP32[((((((300)|0)))+(8))>>2)]=HEAP32[((($418)+(8))>>2)];
   $axis_words=0;
   label = 171; break;
  case 156: 
   var $420=$non_modal_action;
   var $421=(($420)&(255));
   var $422=(($421)|(0))==4;
   if ($422) { label = 157; break; } else { label = 158; break; }
  case 157: 
   _settings_write_coord_data(6, ((300)|0));
   label = 159; break;
  case 158: 
   _settings_write_coord_data(7, ((300)|0));
   label = 159; break;
  case 159: 
   label = 171; break;
  case 160: 
   var $427=$axis_words;
   var $428=(($427 << 24) >> 24)!=0;
   if ($428) { label = 162; break; } else { label = 161; break; }
  case 161: 
   HEAP8[((((288)|0))|0)]=6;
   label = 169; break;
  case 162: 
   $i4=0;
   label = 163; break;
  case 163: 
   var $432=$i4;
   var $433=(($432)&(255));
   var $434=(($433)|(0)) < 3;
   if ($434) { label = 164; break; } else { label = 168; break; }
  case 164: 
   var $436=$axis_words;
   var $437=(($436)&(255));
   var $438=$i4;
   var $439=(($438)&(255));
   var $440=1 << $439;
   var $441=$437 & $440;
   var $442=(($441)|(0))!=0;
   if ($442) { label = 165; break; } else { label = 166; break; }
  case 165: 
   var $444=$i4;
   var $445=(($444)&(255));
   var $446=((((300)|0)+($445<<2))|0);
   var $447=HEAPF32[(($446)>>2)];
   var $448=$i4;
   var $449=(($448)&(255));
   var $450=((((320)|0)+($449<<2))|0);
   var $451=HEAPF32[(($450)>>2)];
   var $452=($447)-($451);
   var $453=$i4;
   var $454=(($453)&(255));
   var $455=(($target+($454<<2))|0);
   var $456=HEAPF32[(($455)>>2)];
   var $457=($452)-($456);
   var $458=$i4;
   var $459=(($458)&(255));
   var $460=((((332)|0)+($459<<2))|0);
   HEAPF32[(($460)>>2)]=$457;
   label = 166; break;
  case 166: 
   label = 167; break;
  case 167: 
   var $463=$i4;
   var $464=((($463)+(1))&255);
   $i4=$464;
   label = 163; break;
  case 168: 
   label = 169; break;
  case 169: 
   $axis_words=0;
   label = 171; break;
  case 170: 
   HEAP32[(((((332)|0)))>>2)]=0; HEAP32[((((((332)|0)))+(4))>>2)]=0; HEAP32[((((((332)|0)))+(8))>>2)]=0;
   label = 171; break;
  case 171: 
   var $469=$modal_group_words;
   var $470=(($469)&(65535));
   var $471=$470 & 4;
   var $472=(($471)|(0))!=0;
   if ($472) { label = 173; break; } else { label = 172; break; }
  case 172: 
   var $474=$axis_words;
   var $475=(($474)&(255));
   var $476=(($475)|(0))!=0;
   if ($476) { label = 173; break; } else { label = 235; break; }
  case 173: 
   var $478=HEAP8[((((290)|0))|0)];
   var $479=(($478 << 24) >> 24)!=0;
   if ($479) { label = 174; break; } else { label = 178; break; }
  case 174: 
   var $481=$inverse_feed_rate;
   var $482=$481 < 0;
   if ($482) { label = 175; break; } else { label = 177; break; }
  case 175: 
   var $484=HEAP8[((((289)|0))|0)];
   var $485=(($484)&(255));
   var $486=(($485)|(0))!=4;
   if ($486) { label = 176; break; } else { label = 177; break; }
  case 176: 
   HEAP8[((((288)|0))|0)]=6;
   label = 177; break;
  case 177: 
   label = 178; break;
  case 178: 
   var $490=$absolute_override;
   var $491=(($490)&(255));
   var $492=(($491)|(0))!=0;
   if ($492) { label = 179; break; } else { label = 182; break; }
  case 179: 
   var $494=HEAP8[((((289)|0))|0)];
   var $495=(($494)&(255));
   var $496=(($495)|(0))==0;
   if ($496) { label = 182; break; } else { label = 180; break; }
  case 180: 
   var $498=HEAP8[((((289)|0))|0)];
   var $499=(($498)&(255));
   var $500=(($499)|(0))==1;
   if ($500) { label = 182; break; } else { label = 181; break; }
  case 181: 
   HEAP8[((((288)|0))|0)]=6;
   label = 182; break;
  case 182: 
   var $503=HEAP8[((((288)|0))|0)];
   var $504=(($503 << 24) >> 24)!=0;
   if ($504) { label = 183; break; } else { label = 184; break; }
  case 183: 
   var $506=HEAP8[((((288)|0))|0)];
   $1=$506;
   label = 241; break;
  case 184: 
   $i5=0;
   label = 185; break;
  case 185: 
   var $509=$i5;
   var $510=(($509)&(255));
   var $511=(($510)|(0)) < 3;
   if ($511) { label = 186; break; } else { label = 196; break; }
  case 186: 
   var $513=$axis_words;
   var $514=(($513)&(255));
   var $515=$i5;
   var $516=(($515)&(255));
   var $517=1 << $516;
   var $518=$514 & $517;
   var $519=(($518)|(0))!=0;
   if ($519) { label = 187; break; } else { label = 193; break; }
  case 187: 
   var $521=$absolute_override;
   var $522=(($521 << 24) >> 24)!=0;
   if ($522) { label = 192; break; } else { label = 188; break; }
  case 188: 
   var $524=HEAP8[((((292)|0))|0)];
   var $525=(($524 << 24) >> 24)!=0;
   if ($525) { label = 189; break; } else { label = 190; break; }
  case 189: 
   var $527=$i5;
   var $528=(($527)&(255));
   var $529=((((320)|0)+($528<<2))|0);
   var $530=HEAPF32[(($529)>>2)];
   var $531=$i5;
   var $532=(($531)&(255));
   var $533=((((332)|0)+($532<<2))|0);
   var $534=HEAPF32[(($533)>>2)];
   var $535=($530)+($534);
   var $536=$i5;
   var $537=(($536)&(255));
   var $538=(($target+($537<<2))|0);
   var $539=HEAPF32[(($538)>>2)];
   var $540=($539)+($535);
   HEAPF32[(($538)>>2)]=$540;
   label = 191; break;
  case 190: 
   var $542=$i5;
   var $543=(($542)&(255));
   var $544=((((300)|0)+($543<<2))|0);
   var $545=HEAPF32[(($544)>>2)];
   var $546=$i5;
   var $547=(($546)&(255));
   var $548=(($target+($547<<2))|0);
   var $549=HEAPF32[(($548)>>2)];
   var $550=($549)+($545);
   HEAPF32[(($548)>>2)]=$550;
   label = 191; break;
  case 191: 
   label = 192; break;
  case 192: 
   label = 194; break;
  case 193: 
   var $554=$i5;
   var $555=(($554)&(255));
   var $556=((((300)|0)+($555<<2))|0);
   var $557=HEAPF32[(($556)>>2)];
   var $558=$i5;
   var $559=(($558)&(255));
   var $560=(($target+($559<<2))|0);
   HEAPF32[(($560)>>2)]=$557;
   label = 194; break;
  case 194: 
   label = 195; break;
  case 195: 
   var $563=$i5;
   var $564=((($563)+(1))&255);
   $i5=$564;
   label = 185; break;
  case 196: 
   var $566=HEAP8[((((289)|0))|0)];
   var $567=(($566)&(255));
   if ((($567)|(0))==4) {
    label = 197; break;
   }
   else if ((($567)|(0))==0) {
    label = 200; break;
   }
   else if ((($567)|(0))==1) {
    label = 204; break;
   }
   else if ((($567)|(0))==2 | (($567)|(0))==3) {
    label = 211; break;
   }
   else {
   label = 232; break;
   }
  case 197: 
   var $569=$axis_words;
   var $570=(($569 << 24) >> 24)!=0;
   if ($570) { label = 198; break; } else { label = 199; break; }
  case 198: 
   HEAP8[((((288)|0))|0)]=6;
   label = 199; break;
  case 199: 
   label = 232; break;
  case 200: 
   var $574=$axis_words;
   var $575=(($574 << 24) >> 24)!=0;
   if ($575) { label = 202; break; } else { label = 201; break; }
  case 201: 
   HEAP8[((((288)|0))|0)]=6;
   label = 203; break;
  case 202: 
   var $578=(($target)|0);
   _mc_line($578, -1, 0);
   label = 203; break;
  case 203: 
   label = 232; break;
  case 204: 
   var $581=$axis_words;
   var $582=(($581 << 24) >> 24)!=0;
   if ($582) { label = 206; break; } else { label = 205; break; }
  case 205: 
   HEAP8[((((288)|0))|0)]=6;
   label = 210; break;
  case 206: 
   var $585=(($target)|0);
   var $586=HEAP8[((((290)|0))|0)];
   var $587=(($586)&(255));
   var $588=(($587)|(0))!=0;
   if ($588) { label = 207; break; } else { label = 208; break; }
  case 207: 
   var $590=$inverse_feed_rate;
   var $594 = $590;label = 209; break;
  case 208: 
   var $592=HEAPF32[((((296)|0))>>2)];
   var $594 = $592;label = 209; break;
  case 209: 
   var $594;
   var $595=HEAP8[((((290)|0))|0)];
   _mc_line($585, $594, $595);
   label = 210; break;
  case 210: 
   label = 232; break;
  case 211: 
   var $598=HEAP8[((((315)|0))|0)];
   var $599=(($598)&(255));
   var $600=1 << $599;
   var $601=$600 ^ -1;
   var $602=$axis_words;
   var $603=(($602)&(255));
   var $604=$603 & $601;
   var $605=(($604) & 255);
   $axis_words=$605;
   var $606=(($605 << 24) >> 24)!=0;
   if ($606) { label = 212; break; } else { label = 215; break; }
  case 212: 
   var $608=$r;
   var $609=$608 != 0;
   if ($609) { label = 216; break; } else { label = 213; break; }
  case 213: 
   var $611=HEAP8[((((313)|0))|0)];
   var $612=(($611)&(255));
   var $613=(($offset+($612<<2))|0);
   var $614=HEAPF32[(($613)>>2)];
   var $615=$614 != 0;
   if ($615) { label = 216; break; } else { label = 214; break; }
  case 214: 
   var $617=HEAP8[((((314)|0))|0)];
   var $618=(($617)&(255));
   var $619=(($offset+($618<<2))|0);
   var $620=HEAPF32[(($619)>>2)];
   var $621=$620 != 0;
   if ($621) { label = 216; break; } else { label = 215; break; }
  case 215: 
   HEAP8[((((288)|0))|0)]=6;
   label = 231; break;
  case 216: 
   var $624=$r;
   var $625=$624 != 0;
   if ($625) { label = 217; break; } else { label = 224; break; }
  case 217: 
   var $627=HEAP8[((((313)|0))|0)];
   var $628=(($627)&(255));
   var $629=(($target+($628<<2))|0);
   var $630=HEAPF32[(($629)>>2)];
   var $631=HEAP8[((((313)|0))|0)];
   var $632=(($631)&(255));
   var $633=((((300)|0)+($632<<2))|0);
   var $634=HEAPF32[(($633)>>2)];
   var $635=($630)-($634);
   $x=$635;
   var $636=HEAP8[((((314)|0))|0)];
   var $637=(($636)&(255));
   var $638=(($target+($637<<2))|0);
   var $639=HEAPF32[(($638)>>2)];
   var $640=HEAP8[((((314)|0))|0)];
   var $641=(($640)&(255));
   var $642=((((300)|0)+($641<<2))|0);
   var $643=HEAPF32[(($642)>>2)];
   var $644=($639)-($643);
   $y=$644;
   var $645=$offset;
   HEAP32[(($645)>>2)]=0; HEAP32[((($645)+(4))>>2)]=0; HEAP32[((($645)+(8))>>2)]=0;
   var $646=$r;
   var $647=($646)*(4);
   var $648=$r;
   var $649=($647)*($648);
   var $650=$x;
   var $651=$x;
   var $652=($650)*($651);
   var $653=($649)-($652);
   var $654=$y;
   var $655=$y;
   var $656=($654)*($655);
   var $657=($653)-($656);
   $h_x2_div_d=$657;
   var $658=$h_x2_div_d;
   var $659=$658 < 0;
   if ($659) { label = 218; break; } else { label = 219; break; }
  case 218: 
   HEAP8[((((288)|0))|0)]=4;
   var $661=HEAP8[((((288)|0))|0)];
   $1=$661;
   label = 241; break;
  case 219: 
   var $663=$h_x2_div_d;
   var $664=$663;
   var $665=Math.sqrt($664);
   var $666=(-$665);
   var $667=$x;
   var $668=$667;
   var $669=$y;
   var $670=$669;
   var $671=_hypot($668, $670);
   var $672=($666)/($671);
   var $673=$672;
   $h_x2_div_d=$673;
   var $674=HEAP8[((((289)|0))|0)];
   var $675=(($674)&(255));
   var $676=(($675)|(0))==3;
   if ($676) { label = 220; break; } else { label = 221; break; }
  case 220: 
   var $678=$h_x2_div_d;
   var $679=(-$678);
   $h_x2_div_d=$679;
   label = 221; break;
  case 221: 
   var $681=$r;
   var $682=$681 < 0;
   if ($682) { label = 222; break; } else { label = 223; break; }
  case 222: 
   var $684=$h_x2_div_d;
   var $685=(-$684);
   $h_x2_div_d=$685;
   var $686=$r;
   var $687=(-$686);
   $r=$687;
   label = 223; break;
  case 223: 
   var $689=$x;
   var $690=$y;
   var $691=$h_x2_div_d;
   var $692=($690)*($691);
   var $693=($689)-($692);
   var $694=$693;
   var $695=($694)*(0.5);
   var $696=$695;
   var $697=HEAP8[((((313)|0))|0)];
   var $698=(($697)&(255));
   var $699=(($offset+($698<<2))|0);
   HEAPF32[(($699)>>2)]=$696;
   var $700=$y;
   var $701=$x;
   var $702=$h_x2_div_d;
   var $703=($701)*($702);
   var $704=($700)+($703);
   var $705=$704;
   var $706=($705)*(0.5);
   var $707=$706;
   var $708=HEAP8[((((314)|0))|0)];
   var $709=(($708)&(255));
   var $710=(($offset+($709<<2))|0);
   HEAPF32[(($710)>>2)]=$707;
   label = 225; break;
  case 224: 
   var $712=HEAP8[((((313)|0))|0)];
   var $713=(($712)&(255));
   var $714=(($offset+($713<<2))|0);
   var $715=HEAPF32[(($714)>>2)];
   var $716=$715;
   var $717=HEAP8[((((314)|0))|0)];
   var $718=(($717)&(255));
   var $719=(($offset+($718<<2))|0);
   var $720=HEAPF32[(($719)>>2)];
   var $721=$720;
   var $722=_hypot($716, $721);
   var $723=$722;
   $r=$723;
   label = 225; break;
  case 225: 
   $isclockwise=0;
   var $725=HEAP8[((((289)|0))|0)];
   var $726=(($725)&(255));
   var $727=(($726)|(0))==2;
   if ($727) { label = 226; break; } else { label = 227; break; }
  case 226: 
   $isclockwise=1;
   label = 227; break;
  case 227: 
   var $730=(($target)|0);
   var $731=(($offset)|0);
   var $732=HEAP8[((((313)|0))|0)];
   var $733=HEAP8[((((314)|0))|0)];
   var $734=HEAP8[((((315)|0))|0)];
   var $735=HEAP8[((((290)|0))|0)];
   var $736=(($735)&(255));
   var $737=(($736)|(0))!=0;
   if ($737) { label = 228; break; } else { label = 229; break; }
  case 228: 
   var $739=$inverse_feed_rate;
   var $743 = $739;label = 230; break;
  case 229: 
   var $741=HEAPF32[((((296)|0))>>2)];
   var $743 = $741;label = 230; break;
  case 230: 
   var $743;
   var $744=HEAP8[((((290)|0))|0)];
   var $745=$r;
   var $746=$isclockwise;
   _mc_arc(((300)|0), $730, $731, $732, $733, $734, $743, $744, $745, $746);
   label = 231; break;
  case 231: 
   label = 232; break;
  case 232: 
   var $749=HEAP8[((((288)|0))|0)];
   var $750=(($749 << 24) >> 24)!=0;
   if ($750) { label = 233; break; } else { label = 234; break; }
  case 233: 
   var $752=HEAP8[((((288)|0))|0)];
   $1=$752;
   label = 241; break;
  case 234: 
   var $754=$target;
   assert(12 % 1 === 0);HEAP32[(((((300)|0)))>>2)]=HEAP32[(($754)>>2)];HEAP32[((((((300)|0)))+(4))>>2)]=HEAP32[((($754)+(4))>>2)];HEAP32[((((((300)|0)))+(8))>>2)]=HEAP32[((($754)+(8))>>2)];
   label = 235; break;
  case 235: 
   var $756=HEAP8[((((293)|0))|0)];
   var $757=(($756 << 24) >> 24)!=0;
   if ($757) { label = 236; break; } else { label = 240; break; }
  case 236: 
   _plan_synchronize();
   HEAP8[((((48)|0))|0)]=0;
   var $759=HEAP8[((((293)|0))|0)];
   var $760=(($759)&(255));
   var $761=(($760)|(0))==2;
   if ($761) { label = 237; break; } else { label = 238; break; }
  case 237: 
   _mc_reset();
   label = 239; break;
  case 238: 
   HEAP8[((((293)|0))|0)]=0;
   label = 239; break;
  case 239: 
   label = 240; break;
  case 240: 
   var $766=HEAP8[((((288)|0))|0)];
   $1=$766;
   label = 241; break;
  case 241: 
   var $768=$1;
   STACKTOP = __stackBase__;
   return $768;
  default: assert(0, "bad label: " + label);
 }
}
function _coolant_stop() {
 var label = 0;
 return;
}
function _serial_read() {
 var label = 0;
 return -1;
}
function _serial_reset_read_buffer() {
 var label = 0;
 var $1=HEAP8[(200)];
 HEAP8[(192)]=$1;
 return;
}
function _coolant_run($mode) {
 var label = 0;
 var $1;
 $1=$mode;
 return;
}
function _serial_write($data) {
 var label = 0;
 var $1;
 $1=$data;
 return;
}
function _to_millimeters($value) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   $1=$value;
   var $2=HEAP8[((((291)|0))|0)];
   var $3=(($2)&(255));
   var $4=(($3)|(0))!=0;
   if ($4) { label = 2; break; } else { label = 3; break; }
  case 2: 
   var $6=$1;
   var $7=$6;
   var $8=($7)*(25.4);
   var $13 = $8;label = 4; break;
  case 3: 
   var $10=$1;
   var $11=$10;
   var $13 = $11;label = 4; break;
  case 4: 
   var $13;
   var $14=$13;
   return $14;
  default: assert(0, "bad label: " + label);
 }
}
function _spindle_stop() {
 var label = 0;
 var $1=HEAP8[(6064)];
 var $2=(($1)&(255));
 var $3=$2 & -17;
 var $4=(($3) & 255);
 HEAP8[(6064)]=$4;
 return;
}
function _serial_init() {
 var label = 0;
 var $UBRR0_value;
 $UBRR0_value=103;
 var $1=HEAP8[(5776)];
 var $2=(($1)&(255));
 var $3=$2 & -3;
 var $4=(($3) & 255);
 HEAP8[(5776)]=$4;
 var $5=$UBRR0_value;
 var $6=(($5)&(65535));
 var $7=$6 >> 8;
 var $8=(($7) & 255);
 HEAP8[(5792)]=$8;
 var $9=$UBRR0_value;
 var $10=(($9) & 255);
 HEAP8[(5784)]=$10;
 var $11=HEAP8[(5768)];
 var $12=(($11)&(255));
 var $13=$12 | 16;
 var $14=(($13) & 255);
 HEAP8[(5768)]=$14;
 var $15=HEAP8[(5768)];
 var $16=(($15)&(255));
 var $17=$16 | 8;
 var $18=(($17) & 255);
 HEAP8[(5768)]=$18;
 var $19=HEAP8[(5768)];
 var $20=(($19)&(255));
 var $21=$20 | 128;
 var $22=(($21) & 255);
 HEAP8[(5768)]=$22;
 return;
}
function _next_statement($letter, $float_ptr, $line, $char_counter) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2;
   var $3;
   var $4;
   var $5;
   $2=$letter;
   $3=$float_ptr;
   $4=$line;
   $5=$char_counter;
   var $6=$5;
   var $7=HEAP8[($6)];
   var $8=(($7)&(255));
   var $9=$4;
   var $10=(($9+$8)|0);
   var $11=HEAP8[($10)];
   var $12=(($11 << 24) >> 24);
   var $13=(($12)|(0))==0;
   if ($13) { label = 2; break; } else { label = 3; break; }
  case 2: 
   $1=0;
   label = 9; break;
  case 3: 
   var $16=$5;
   var $17=HEAP8[($16)];
   var $18=(($17)&(255));
   var $19=$4;
   var $20=(($19+$18)|0);
   var $21=HEAP8[($20)];
   var $22=$2;
   HEAP8[($22)]=$21;
   var $23=$2;
   var $24=HEAP8[($23)];
   var $25=(($24 << 24) >> 24);
   var $26=(($25)|(0)) < 65;
   if ($26) { label = 5; break; } else { label = 4; break; }
  case 4: 
   var $28=$2;
   var $29=HEAP8[($28)];
   var $30=(($29 << 24) >> 24);
   var $31=(($30)|(0)) > 90;
   if ($31) { label = 5; break; } else { label = 6; break; }
  case 5: 
   HEAP8[((((288)|0))|0)]=2;
   $1=0;
   label = 9; break;
  case 6: 
   var $34=$5;
   var $35=HEAP8[($34)];
   var $36=((($35)+(1))&255);
   HEAP8[($34)]=$36;
   var $37=$4;
   var $38=$5;
   var $39=$3;
   var $40=_read_float($37, $38, $39);
   var $41=(($40)|(0))!=0;
   if ($41) { label = 8; break; } else { label = 7; break; }
  case 7: 
   HEAP8[((((288)|0))|0)]=1;
   $1=0;
   label = 9; break;
  case 8: 
   $1=1;
   label = 9; break;
  case 9: 
   var $45=$1;
   return $45;
  default: assert(0, "bad label: " + label);
 }
}
function _spindle_init() {
 var label = 0;
 HEAP8[(344)]=0;
 var $1=HEAP8[(6392)];
 var $2=(($1)&(255));
 var $3=$2 | 16;
 var $4=(($3) & 255);
 HEAP8[(6392)]=$4;
 var $5=HEAP8[(6392)];
 var $6=(($5)&(255));
 var $7=$6 | 32;
 var $8=(($7) & 255);
 HEAP8[(6392)]=$8;
 _spindle_stop();
 return;
}
function _spindle_run($direction) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   $1=$direction;
   var $2=$1;
   var $3=(($2 << 24) >> 24);
   var $4=HEAP8[(344)];
   var $5=(($4)&(255));
   var $6=(($3)|(0))!=(($5)|(0));
   if ($6) { label = 2; break; } else { label = 9; break; }
  case 2: 
   _plan_synchronize();
   var $8=$1;
   var $9=(($8 << 24) >> 24)!=0;
   if ($9) { label = 3; break; } else { label = 7; break; }
  case 3: 
   var $11=$1;
   var $12=(($11 << 24) >> 24);
   var $13=(($12)|(0)) > 0;
   if ($13) { label = 4; break; } else { label = 5; break; }
  case 4: 
   var $15=HEAP8[(6064)];
   var $16=(($15)&(255));
   var $17=$16 & -33;
   var $18=(($17) & 255);
   HEAP8[(6064)]=$18;
   label = 6; break;
  case 5: 
   var $20=HEAP8[(6064)];
   var $21=(($20)&(255));
   var $22=$21 | 32;
   var $23=(($22) & 255);
   HEAP8[(6064)]=$23;
   label = 6; break;
  case 6: 
   var $25=HEAP8[(6064)];
   var $26=(($25)&(255));
   var $27=$26 | 16;
   var $28=(($27) & 255);
   HEAP8[(6064)]=$28;
   label = 8; break;
  case 7: 
   _spindle_stop();
   label = 8; break;
  case 8: 
   var $31=$1;
   HEAP8[(344)]=$31;
   label = 9; break;
  case 9: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _coolant_init() {
 var label = 0;
 _coolant_stop();
 return;
}
function _protocol_init() {
 var label = 0;
 HEAP8[(360)]=0;
 HEAP8[(280)]=0;
 _report_init_message();
 var $1=HEAP8[(6384)];
 var $2=(($1)&(255));
 var $3=$2 & -8;
 var $4=(($3) & 255);
 HEAP8[(6384)]=$4;
 var $5=HEAP8[(6056)];
 var $6=(($5)&(255));
 var $7=$6 | 7;
 var $8=(($7) & 255);
 HEAP8[(6056)]=$8;
 var $9=HEAP8[(6104)];
 var $10=(($9)&(255));
 var $11=$10 | 7;
 var $12=(($11) & 255);
 HEAP8[(6104)]=$12;
 var $13=HEAP8[(6128)];
 var $14=(($13)&(255));
 var $15=$14 | 2;
 var $16=(($15) & 255);
 HEAP8[(6128)]=$16;
 return;
}
function _protocol_execute_startup() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $n;
   $n=0;
   label = 2; break;
  case 2: 
   var $2=$n;
   var $3=(($2)&(255));
   var $4=(($3)|(0)) < 2;
   if ($4) { label = 3; break; } else { label = 10; break; }
  case 3: 
   var $6=$n;
   var $7=_settings_read_startup_line($6, ((272)|0));
   var $8=(($7 << 24) >> 24)!=0;
   if ($8) { label = 5; break; } else { label = 4; break; }
  case 4: 
   _report_status_message(10);
   label = 8; break;
  case 5: 
   var $11=HEAP8[((((272)|0))|0)];
   var $12=(($11 << 24) >> 24);
   var $13=(($12)|(0))!=0;
   if ($13) { label = 6; break; } else { label = 7; break; }
  case 6: 
   _printString(((272)|0));
   var $15=_gc_execute_line(((272)|0));
   _report_status_message($15);
   label = 7; break;
  case 7: 
   label = 8; break;
  case 8: 
   label = 9; break;
  case 9: 
   var $19=$n;
   var $20=((($19)+(1))&255);
   $n=$20;
   label = 2; break;
  case 10: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _isr_PINOUT_INT_vect() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1=HEAP8[(6080)];
   var $2=(($1)&(255));
   var $3=$2 & 7;
   var $4=$3 ^ 7;
   var $5=(($4)|(0))!=0;
   if ($5) { label = 2; break; } else { label = 11; break; }
  case 2: 
   var $7=HEAP8[(6080)];
   var $8=(($7)&(255));
   var $9=$8 & 1;
   var $10=(($9)|(0))==0;
   if ($10) { label = 3; break; } else { label = 4; break; }
  case 3: 
   _mc_reset();
   label = 10; break;
  case 4: 
   var $13=HEAP8[(6080)];
   var $14=(($13)&(255));
   var $15=$14 & 2;
   var $16=(($15)|(0))==0;
   if ($16) { label = 5; break; } else { label = 6; break; }
  case 5: 
   var $18=HEAP8[((((34)|0))|0)];
   var $19=(($18)&(255));
   var $20=$19 | 8;
   var $21=(($20) & 255);
   HEAP8[((((34)|0))|0)]=$21;
   label = 9; break;
  case 6: 
   var $23=HEAP8[(6080)];
   var $24=(($23)&(255));
   var $25=$24 & 4;
   var $26=(($25)|(0))==0;
   if ($26) { label = 7; break; } else { label = 8; break; }
  case 7: 
   var $28=HEAP8[((((34)|0))|0)];
   var $29=(($28)&(255));
   var $30=$29 | 2;
   var $31=(($30) & 255);
   HEAP8[((((34)|0))|0)]=$31;
   label = 8; break;
  case 8: 
   label = 9; break;
  case 9: 
   label = 10; break;
  case 10: 
   label = 11; break;
  case 11: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _protocol_execute_runtime() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $rt_exec;
   var $1=HEAP8[((((34)|0))|0)];
   var $2=(($1 << 24) >> 24)!=0;
   if ($2) { label = 2; break; } else { label = 23; break; }
  case 2: 
   var $4=HEAP8[((((34)|0))|0)];
   $rt_exec=$4;
   var $5=$rt_exec;
   var $6=(($5)&(255));
   var $7=$6 & 96;
   var $8=(($7)|(0))!=0;
   if ($8) { label = 3; break; } else { label = 10; break; }
  case 3: 
   HEAP8[((((33)|0))|0)]=6;
   var $10=$rt_exec;
   var $11=(($10)&(255));
   var $12=$11 & 64;
   var $13=(($12)|(0))!=0;
   if ($13) { label = 4; break; } else { label = 8; break; }
  case 4: 
   _report_alarm_message(-1);
   _report_feedback_message(1);
   var $15=HEAP8[((((34)|0))|0)];
   var $16=(($15)&(255));
   var $17=$16 & -17;
   var $18=(($17) & 255);
   HEAP8[((((34)|0))|0)]=$18;
   label = 5; break;
  case 5: 
   label = 6; break;
  case 6: 
   var $21=HEAP8[((((34)|0))|0)];
   var $22=(($21)&(255));
   var $23=$22 & 16;
   var $24=(($23)|(0))==0;
   if ($24) { label = 5; break; } else { label = 7; break; }
  case 7: 
   label = 9; break;
  case 8: 
   _report_alarm_message(-2);
   label = 9; break;
  case 9: 
   var $28=HEAP8[((((34)|0))|0)];
   var $29=(($28)&(255));
   var $30=$29 & -97;
   var $31=(($30) & 255);
   HEAP8[((((34)|0))|0)]=$31;
   label = 10; break;
  case 10: 
   var $33=$rt_exec;
   var $34=(($33)&(255));
   var $35=$34 & 16;
   var $36=(($35)|(0))!=0;
   if ($36) { label = 11; break; } else { label = 12; break; }
  case 11: 
   HEAP8[((((32)|0))|0)]=1;
   label = 23; break;
  case 12: 
   var $39=$rt_exec;
   var $40=(($39)&(255));
   var $41=$40 & 1;
   var $42=(($41)|(0))!=0;
   if ($42) { label = 13; break; } else { label = 14; break; }
  case 13: 
   _report_realtime_status();
   var $44=HEAP8[((((34)|0))|0)];
   var $45=(($44)&(255));
   var $46=$45 & -2;
   var $47=(($46) & 255);
   HEAP8[((((34)|0))|0)]=$47;
   label = 14; break;
  case 14: 
   var $49=$rt_exec;
   var $50=(($49)&(255));
   var $51=$50 & 8;
   var $52=(($51)|(0))!=0;
   if ($52) { label = 15; break; } else { label = 16; break; }
  case 15: 
   _st_feed_hold();
   var $54=HEAP8[((((34)|0))|0)];
   var $55=(($54)&(255));
   var $56=$55 & -9;
   var $57=(($56) & 255);
   HEAP8[((((34)|0))|0)]=$57;
   label = 16; break;
  case 16: 
   var $59=$rt_exec;
   var $60=(($59)&(255));
   var $61=$60 & 4;
   var $62=(($61)|(0))!=0;
   if ($62) { label = 17; break; } else { label = 18; break; }
  case 17: 
   _st_cycle_reinitialize();
   var $64=HEAP8[((((34)|0))|0)];
   var $65=(($64)&(255));
   var $66=$65 & -5;
   var $67=(($66) & 255);
   HEAP8[((((34)|0))|0)]=$67;
   label = 18; break;
  case 18: 
   var $69=$rt_exec;
   var $70=(($69)&(255));
   var $71=$70 & 2;
   var $72=(($71)|(0))!=0;
   if ($72) { label = 19; break; } else { label = 22; break; }
  case 19: 
   _st_cycle_start();
   var $74=HEAP8[((((144)|0))|0)];
   var $75=(($74)&(255));
   var $76=$75 & 2;
   var $77=(($76)|(0))!=0;
   if ($77) { label = 20; break; } else { label = 21; break; }
  case 20: 
   HEAP8[((((48)|0))|0)]=1;
   label = 21; break;
  case 21: 
   var $80=HEAP8[((((34)|0))|0)];
   var $81=(($80)&(255));
   var $82=$81 & -3;
   var $83=(($82) & 255);
   HEAP8[((((34)|0))|0)]=$83;
   label = 22; break;
  case 22: 
   label = 23; break;
  case 23: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _protocol_execute_line($line) {
 var label = 0;
 var __stackBase__  = STACKTOP; STACKTOP = (STACKTOP + 24)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2;
   var $char_counter=__stackBase__;
   var $helper_var;
   var $parameter=(__stackBase__)+(8);
   var $value=(__stackBase__)+(16);
   $2=$line;
   var $3=$2;
   var $4=(($3)|0);
   var $5=HEAP8[($4)];
   var $6=(($5 << 24) >> 24);
   var $7=(($6)|(0))==36;
   if ($7) { label = 2; break; } else { label = 69; break; }
  case 2: 
   HEAP8[($char_counter)]=1;
   $helper_var=0;
   var $9=HEAP8[($char_counter)];
   var $10=(($9)&(255));
   var $11=$2;
   var $12=(($11+$10)|0);
   var $13=HEAP8[($12)];
   var $14=(($13 << 24) >> 24);
   if ((($14)|(0))==0) {
    label = 3; break;
   }
   else if ((($14)|(0))==36) {
    label = 4; break;
   }
   else if ((($14)|(0))==35) {
    label = 8; break;
   }
   else if ((($14)|(0))==71) {
    label = 12; break;
   }
   else if ((($14)|(0))==67) {
    label = 16; break;
   }
   else if ((($14)|(0))==88) {
    label = 24; break;
   }
   else if ((($14)|(0))==72) {
    label = 29; break;
   }
   else if ((($14)|(0))==78) {
    label = 39; break;
   }
   else {
   label = 50; break;
   }
  case 3: 
   _report_grbl_help();
   label = 68; break;
  case 4: 
   var $17=HEAP8[($char_counter)];
   var $18=((($17)+(1))&255);
   HEAP8[($char_counter)]=$18;
   var $19=(($18)&(255));
   var $20=$2;
   var $21=(($20+$19)|0);
   var $22=HEAP8[($21)];
   var $23=(($22 << 24) >> 24);
   var $24=(($23)|(0))!=0;
   if ($24) { label = 5; break; } else { label = 6; break; }
  case 5: 
   $1=3;
   label = 70; break;
  case 6: 
   _report_grbl_settings();
   label = 7; break;
  case 7: 
   label = 68; break;
  case 8: 
   var $29=HEAP8[($char_counter)];
   var $30=((($29)+(1))&255);
   HEAP8[($char_counter)]=$30;
   var $31=(($30)&(255));
   var $32=$2;
   var $33=(($32+$31)|0);
   var $34=HEAP8[($33)];
   var $35=(($34 << 24) >> 24);
   var $36=(($35)|(0))!=0;
   if ($36) { label = 9; break; } else { label = 10; break; }
  case 9: 
   $1=3;
   label = 70; break;
  case 10: 
   _report_gcode_parameters();
   label = 11; break;
  case 11: 
   label = 68; break;
  case 12: 
   var $41=HEAP8[($char_counter)];
   var $42=((($41)+(1))&255);
   HEAP8[($char_counter)]=$42;
   var $43=(($42)&(255));
   var $44=$2;
   var $45=(($44+$43)|0);
   var $46=HEAP8[($45)];
   var $47=(($46 << 24) >> 24);
   var $48=(($47)|(0))!=0;
   if ($48) { label = 13; break; } else { label = 14; break; }
  case 13: 
   $1=3;
   label = 70; break;
  case 14: 
   _report_gcode_modes();
   label = 15; break;
  case 15: 
   label = 68; break;
  case 16: 
   var $53=HEAP8[($char_counter)];
   var $54=((($53)+(1))&255);
   HEAP8[($char_counter)]=$54;
   var $55=(($54)&(255));
   var $56=$2;
   var $57=(($56+$55)|0);
   var $58=HEAP8[($57)];
   var $59=(($58 << 24) >> 24);
   var $60=(($59)|(0))!=0;
   if ($60) { label = 17; break; } else { label = 18; break; }
  case 17: 
   $1=3;
   label = 70; break;
  case 18: 
   var $63=HEAP8[((((33)|0))|0)];
   var $64=(($63)&(255));
   var $65=(($64)|(0))==7;
   if ($65) { label = 19; break; } else { label = 20; break; }
  case 19: 
   _mc_reset();
   _report_feedback_message(5);
   label = 23; break;
  case 20: 
   var $68=HEAP8[((((33)|0))|0)];
   var $69=(($68 << 24) >> 24)!=0;
   if ($69) { label = 21; break; } else { label = 22; break; }
  case 21: 
   $1=11;
   label = 70; break;
  case 22: 
   HEAP8[((((33)|0))|0)]=7;
   _report_feedback_message(4);
   label = 23; break;
  case 23: 
   label = 68; break;
  case 24: 
   var $74=HEAP8[($char_counter)];
   var $75=((($74)+(1))&255);
   HEAP8[($char_counter)]=$75;
   var $76=(($75)&(255));
   var $77=$2;
   var $78=(($77+$76)|0);
   var $79=HEAP8[($78)];
   var $80=(($79 << 24) >> 24);
   var $81=(($80)|(0))!=0;
   if ($81) { label = 25; break; } else { label = 26; break; }
  case 25: 
   $1=3;
   label = 70; break;
  case 26: 
   var $84=HEAP8[((((33)|0))|0)];
   var $85=(($84)&(255));
   var $86=(($85)|(0))==6;
   if ($86) { label = 27; break; } else { label = 28; break; }
  case 27: 
   _report_feedback_message(3);
   HEAP8[((((33)|0))|0)]=0;
   label = 28; break;
  case 28: 
   label = 68; break;
  case 29: 
   var $90=HEAP8[((((144)|0))|0)];
   var $91=(($90)&(255));
   var $92=$91 & 16;
   var $93=(($92)|(0))!=0;
   if ($93) { label = 30; break; } else { label = 37; break; }
  case 30: 
   var $95=HEAP8[((((33)|0))|0)];
   var $96=(($95)&(255));
   var $97=(($96)|(0))==0;
   if ($97) { label = 32; break; } else { label = 31; break; }
  case 31: 
   var $99=HEAP8[((((33)|0))|0)];
   var $100=(($99)&(255));
   var $101=(($100)|(0))==6;
   if ($101) { label = 32; break; } else { label = 35; break; }
  case 32: 
   _mc_go_home();
   var $103=HEAP8[((((32)|0))|0)];
   var $104=(($103 << 24) >> 24)!=0;
   if ($104) { label = 34; break; } else { label = 33; break; }
  case 33: 
   _protocol_execute_startup();
   label = 34; break;
  case 34: 
   label = 36; break;
  case 35: 
   $1=11;
   label = 70; break;
  case 36: 
   label = 38; break;
  case 37: 
   $1=7;
   label = 70; break;
  case 38: 
   label = 68; break;
  case 39: 
   var $112=HEAP8[($char_counter)];
   var $113=((($112)+(1))&255);
   HEAP8[($char_counter)]=$113;
   var $114=(($113)&(255));
   var $115=$2;
   var $116=(($115+$114)|0);
   var $117=HEAP8[($116)];
   var $118=(($117 << 24) >> 24);
   var $119=(($118)|(0))==0;
   if ($119) { label = 40; break; } else { label = 48; break; }
  case 40: 
   $helper_var=0;
   label = 41; break;
  case 41: 
   var $122=$helper_var;
   var $123=(($122)&(255));
   var $124=(($123)|(0)) < 2;
   if ($124) { label = 42; break; } else { label = 47; break; }
  case 42: 
   var $126=$helper_var;
   var $127=$2;
   var $128=_settings_read_startup_line($126, $127);
   var $129=(($128 << 24) >> 24)!=0;
   if ($129) { label = 44; break; } else { label = 43; break; }
  case 43: 
   _report_status_message(10);
   label = 45; break;
  case 44: 
   var $132=$helper_var;
   var $133=$2;
   _report_startup_line($132, $133);
   label = 45; break;
  case 45: 
   label = 46; break;
  case 46: 
   var $136=$helper_var;
   var $137=((($136)+(1))&255);
   $helper_var=$137;
   label = 41; break;
  case 47: 
   label = 68; break;
  case 48: 
   $helper_var=1;
   label = 49; break;
  case 49: 
   label = 50; break;
  case 50: 
   var $142=$2;
   var $143=_read_float($142, $char_counter, $parameter);
   var $144=(($143)|(0))!=0;
   if ($144) { label = 52; break; } else { label = 51; break; }
  case 51: 
   $1=1;
   label = 70; break;
  case 52: 
   var $147=HEAP8[($char_counter)];
   var $148=((($147)+(1))&255);
   HEAP8[($char_counter)]=$148;
   var $149=(($147)&(255));
   var $150=$2;
   var $151=(($150+$149)|0);
   var $152=HEAP8[($151)];
   var $153=(($152 << 24) >> 24);
   var $154=(($153)|(0))!=61;
   if ($154) { label = 53; break; } else { label = 54; break; }
  case 53: 
   $1=3;
   label = 70; break;
  case 54: 
   var $157=$helper_var;
   var $158=(($157 << 24) >> 24)!=0;
   if ($158) { label = 55; break; } else { label = 62; break; }
  case 55: 
   var $160=HEAP8[($char_counter)];
   $helper_var=$160;
   label = 56; break;
  case 56: 
   var $162=HEAP8[($char_counter)];
   var $163=(($162)&(255));
   var $164=$2;
   var $165=(($164+$163)|0);
   var $166=HEAP8[($165)];
   var $167=HEAP8[($char_counter)];
   var $168=(($167)&(255));
   var $169=$helper_var;
   var $170=(($169)&(255));
   var $171=((($168)-($170))|0);
   var $172=$2;
   var $173=(($172+$171)|0);
   HEAP8[($173)]=$166;
   label = 57; break;
  case 57: 
   var $175=HEAP8[($char_counter)];
   var $176=((($175)+(1))&255);
   HEAP8[($char_counter)]=$176;
   var $177=(($175)&(255));
   var $178=$2;
   var $179=(($178+$177)|0);
   var $180=HEAP8[($179)];
   var $181=(($180 << 24) >> 24);
   var $182=(($181)|(0))!=0;
   if ($182) { label = 56; break; } else { label = 58; break; }
  case 58: 
   var $184=$2;
   var $185=_gc_execute_line($184);
   $helper_var=$185;
   var $186=$helper_var;
   var $187=(($186 << 24) >> 24)!=0;
   if ($187) { label = 59; break; } else { label = 60; break; }
  case 59: 
   var $189=$helper_var;
   $1=$189;
   label = 70; break;
  case 60: 
   var $191=HEAPF32[(($parameter)>>2)];
   var $192=$191;
   var $193=_trunc($192);
   var $194=($193>=0 ? Math.floor($193) : Math.ceil($193));
   $helper_var=$194;
   var $195=$helper_var;
   var $196=$2;
   _settings_store_startup_line($195, $196);
   label = 61; break;
  case 61: 
   label = 67; break;
  case 62: 
   var $199=$2;
   var $200=_read_float($199, $char_counter, $value);
   var $201=(($200)|(0))!=0;
   if ($201) { label = 64; break; } else { label = 63; break; }
  case 63: 
   $1=1;
   label = 70; break;
  case 64: 
   var $204=HEAP8[($char_counter)];
   var $205=(($204)&(255));
   var $206=$2;
   var $207=(($206+$205)|0);
   var $208=HEAP8[($207)];
   var $209=(($208 << 24) >> 24);
   var $210=(($209)|(0))!=0;
   if ($210) { label = 65; break; } else { label = 66; break; }
  case 65: 
   $1=3;
   label = 70; break;
  case 66: 
   var $213=HEAPF32[(($parameter)>>2)];
   var $214=(($213)&-1);
   var $215=HEAPF32[(($value)>>2)];
   var $216=_settings_store_global_setting($214, $215);
   $1=$216;
   label = 70; break;
  case 67: 
   label = 68; break;
  case 68: 
   $1=0;
   label = 70; break;
  case 69: 
   var $220=$2;
   var $221=_gc_execute_line($220);
   $1=$221;
   label = 70; break;
  case 70: 
   var $223=$1;
   STACKTOP = __stackBase__;
   return $223;
  default: assert(0, "bad label: " + label);
 }
}
function _st_get_step_events_remaining() {
 var label = 0;
 var $1=HEAP32[((((80)|0))>>2)];
 return $1;
}
function _st_wake_up() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1=HEAP8[((((144)|0))|0)];
   var $2=(($1)&(255));
   var $3=$2 & 4;
   var $4=(($3)|(0))!=0;
   if ($4) { label = 2; break; } else { label = 3; break; }
  case 2: 
   var $6=HEAP8[(6064)];
   var $7=(($6)&(255));
   var $8=$7 | 1;
   var $9=(($8) & 255);
   HEAP8[(6064)]=$9;
   label = 4; break;
  case 3: 
   var $11=HEAP8[(6064)];
   var $12=(($11)&(255));
   var $13=$12 & -2;
   var $14=(($13) & 255);
   HEAP8[(6064)]=$14;
   label = 4; break;
  case 4: 
   var $16=HEAP8[((((33)|0))|0)];
   var $17=(($16)&(255));
   var $18=(($17)|(0))==3;
   if ($18) { label = 5; break; } else { label = 6; break; }
  case 5: 
   var $20=HEAP8[((((120)|0))|0)];
   HEAP8[(256)]=$20;
   var $21=HEAP8[((((109)|0))|0)];
   var $22=(($21)&(255));
   var $23=((($22)-(2))|0);
   var $24=($23<<4);
   var $25=$24 >> 3;
   var $26=(((-$25))|0);
   var $27=(($26) & 255);
   HEAP8[(56)]=$27;
   HEAP8[((((94)|0))|0)]=0;
   HEAP8[(5904)]=0;
   var $28=HEAP8[(5856)];
   var $29=(($28)&(255));
   var $30=$29 | 2;
   var $31=(($30) & 255);
   HEAP8[(5856)]=$31;
   HEAP8[(5944)]=2;
   label = 6; break;
  case 6: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _st_get_current_rate() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2=HEAP32[((((80)|0))>>2)];
   var $3=(($2)|(0))==0;
   if ($3) { label = 2; break; } else { label = 3; break; }
  case 2: 
   $1=0;
   label = 4; break;
  case 3: 
   var $6=HEAP32[((((84)|0))>>2)];
   $1=$6;
   label = 4; break;
  case 4: 
   var $8=$1;
   return $8;
  default: assert(0, "bad label: " + label);
 }
}
function _isr_TIMER0_OVF_vect() {
 var label = 0;
 var $1=HEAP8[(6048)];
 var $2=(($1)&(255));
 var $3=$2 & -29;
 var $4=HEAP8[((((120)|0))|0)];
 var $5=(($4)&(255));
 var $6=$5 & 28;
 var $7=$3 | $6;
 var $8=(($7) & 255);
 HEAP8[(6048)]=$8;
 HEAP8[(5984)]=0;
 return;
}
function _st_feed_hold() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1=HEAP8[((((33)|0))|0)];
   var $2=(($1)&(255));
   var $3=(($2)|(0))==3;
   if ($3) { label = 2; break; } else { label = 3; break; }
  case 2: 
   HEAP8[((((33)|0))|0)]=4;
   HEAP8[((((48)|0))|0)]=0;
   label = 3; break;
  case 3: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _eeprom_get_char($addr) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   $1=$addr;
   label = 2; break;
  case 2: 
   label = 3; break;
  case 3: 
   var $4=HEAP8[(6328)];
   var $5=(($4)&(255));
   var $6=$5 & 2;
   var $7=(($6)|(0))!=0;
   if ($7) { label = 2; break; } else { label = 4; break; }
  case 4: 
   var $9=$1;
   var $10=(($9) & 255);
   HEAP8[(6352)]=$10;
   HEAP8[(6328)]=1;
   var $11=HEAP8[(6320)];
   return $11;
  default: assert(0, "bad label: " + label);
 }
}
function _protocol_process() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $c;
   label = 2; break;
  case 2: 
   var $2=_serial_read();
   $c=$2;
   var $3=(($2)&(255));
   var $4=(($3)|(0))!=255;
   if ($4) { label = 3; break; } else { label = 34; break; }
  case 3: 
   var $6=$c;
   var $7=(($6)&(255));
   var $8=(($7)|(0))==10;
   if ($8) { label = 5; break; } else { label = 4; break; }
  case 4: 
   var $10=$c;
   var $11=(($10)&(255));
   var $12=(($11)|(0))==13;
   if ($12) { label = 5; break; } else { label = 11; break; }
  case 5: 
   _protocol_execute_runtime();
   var $14=HEAP8[((((32)|0))|0)];
   var $15=(($14 << 24) >> 24)!=0;
   if ($15) { label = 6; break; } else { label = 7; break; }
  case 6: 
   label = 34; break;
  case 7: 
   var $18=HEAP8[(360)];
   var $19=(($18)&(255));
   var $20=(($19)|(0)) > 0;
   if ($20) { label = 8; break; } else { label = 9; break; }
  case 8: 
   var $22=HEAP8[(360)];
   var $23=(($22)&(255));
   var $24=((272+$23)|0);
   HEAP8[($24)]=0;
   var $25=_protocol_execute_line(((272)|0));
   _report_status_message($25);
   label = 10; break;
  case 9: 
   _report_status_message(0);
   label = 10; break;
  case 10: 
   HEAP8[(360)]=0;
   HEAP8[(280)]=0;
   label = 33; break;
  case 11: 
   var $29=HEAP8[(280)];
   var $30=(($29 << 24) >> 24)!=0;
   if ($30) { label = 12; break; } else { label = 15; break; }
  case 12: 
   var $32=$c;
   var $33=(($32)&(255));
   var $34=(($33)|(0))==41;
   if ($34) { label = 13; break; } else { label = 14; break; }
  case 13: 
   HEAP8[(280)]=0;
   label = 14; break;
  case 14: 
   label = 32; break;
  case 15: 
   var $38=$c;
   var $39=(($38)&(255));
   var $40=(($39)|(0)) <= 32;
   if ($40) { label = 16; break; } else { label = 17; break; }
  case 16: 
   label = 31; break;
  case 17: 
   var $43=$c;
   var $44=(($43)&(255));
   var $45=(($44)|(0))==47;
   if ($45) { label = 18; break; } else { label = 19; break; }
  case 18: 
   label = 30; break;
  case 19: 
   var $48=$c;
   var $49=(($48)&(255));
   var $50=(($49)|(0))==40;
   if ($50) { label = 20; break; } else { label = 21; break; }
  case 20: 
   HEAP8[(280)]=1;
   label = 29; break;
  case 21: 
   var $53=HEAP8[(360)];
   var $54=(($53)&(255));
   var $55=(($54)|(0)) >= 1;
   if ($55) { label = 22; break; } else { label = 23; break; }
  case 22: 
   label = 28; break;
  case 23: 
   var $58=$c;
   var $59=(($58)&(255));
   var $60=(($59)|(0)) >= 97;
   if ($60) { label = 24; break; } else { label = 26; break; }
  case 24: 
   var $62=$c;
   var $63=(($62)&(255));
   var $64=(($63)|(0)) <= 122;
   if ($64) { label = 25; break; } else { label = 26; break; }
  case 25: 
   var $66=$c;
   var $67=(($66)&(255));
   var $68=((($67)-(97))|0);
   var $69=((($68)+(65))|0);
   var $70=(($69) & 255);
   var $71=HEAP8[(360)];
   var $72=((($71)+(1))&255);
   HEAP8[(360)]=$72;
   var $73=(($71)&(255));
   var $74=((272+$73)|0);
   HEAP8[($74)]=$70;
   label = 27; break;
  case 26: 
   var $76=$c;
   var $77=HEAP8[(360)];
   var $78=((($77)+(1))&255);
   HEAP8[(360)]=$78;
   var $79=(($77)&(255));
   var $80=((272+$79)|0);
   HEAP8[($80)]=$76;
   label = 27; break;
  case 27: 
   label = 28; break;
  case 28: 
   label = 29; break;
  case 29: 
   label = 30; break;
  case 30: 
   label = 31; break;
  case 31: 
   label = 32; break;
  case 32: 
   label = 33; break;
  case 33: 
   label = 2; break;
  case 34: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _st_go_idle() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1=HEAP8[(5856)];
   var $2=(($1)&(255));
   var $3=$2 & -3;
   var $4=(($3) & 255);
   HEAP8[(5856)]=$4;
   HEAP8[(5944)]=0;
   HEAP8[(368)]=0;
   var $5=HEAP8[((((164)|0))|0)];
   var $6=(($5)&(255));
   var $7=(($6)|(0))!=255;
   if ($7) { label = 3; break; } else { label = 2; break; }
  case 2: 
   var $9=HEAP8[((((34)|0))|0)];
   var $10=(($9)&(255));
   var $11=$10 & 32;
   var $12=(($11)|(0))!=0;
   if ($12) { label = 3; break; } else { label = 7; break; }
  case 3: 
   var $14=HEAP8[((((164)|0))|0)];
   var $15=(($14)&(255));
   _delay_ms($15);
   var $16=HEAP8[((((144)|0))|0)];
   var $17=(($16)&(255));
   var $18=$17 & 4;
   var $19=(($18)|(0))!=0;
   if ($19) { label = 4; break; } else { label = 5; break; }
  case 4: 
   var $21=HEAP8[(6064)];
   var $22=(($21)&(255));
   var $23=$22 & -2;
   var $24=(($23) & 255);
   HEAP8[(6064)]=$24;
   label = 6; break;
  case 5: 
   var $26=HEAP8[(6064)];
   var $27=(($26)&(255));
   var $28=$27 | 1;
   var $29=(($28) & 255);
   HEAP8[(6064)]=$29;
   label = 6; break;
  case 6: 
   label = 7; break;
  case 7: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _st_iterate() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2=HEAP8[(5856)];
   var $3=(($2)&(255));
   var $4=$3 & 2;
   var $5=(($4)|(0))!=0;
   if ($5) { label = 3; break; } else { label = 2; break; }
  case 2: 
   $1=0;
   label = 75; break;
  case 3: 
   var $8=HEAP8[(368)];
   var $9=(($8 << 24) >> 24)!=0;
   if ($9) { label = 4; break; } else { label = 5; break; }
  case 4: 
   $1=0;
   label = 75; break;
  case 5: 
   var $12=HEAP8[(6048)];
   var $13=(($12)&(255));
   var $14=$13 & -29;
   var $15=HEAP8[((((120)|0))|0)];
   var $16=(($15)&(255));
   var $17=$16 & 28;
   var $18=$14 | $17;
   var $19=(($18) & 255);
   HEAP8[(6048)]=$19;
   var $20=HEAP8[((((94)|0))|0)];
   var $21=(($20 << 24) >> 24)!=0;
   if ($21) { label = 6; break; } else { label = 7; break; }
  case 6: 
   HEAP8[((((94)|0))|0)]=0;
   var $23=HEAP8[(6048)];
   var $24=(($23)&(255));
   var $25=$24 & -253;
   var $26=HEAP8[(256)];
   var $27=(($26)&(255));
   var $28=$25 | $27;
   var $29=(($28) & 255);
   HEAP8[(6048)]=$29;
   var $30=HEAP8[(56)];
   HEAP8[(5936)]=$30;
   HEAP8[(5984)]=2;
   label = 7; break;
  case 7: 
   HEAP8[(368)]=1;
   var $32=HEAP32[((352)>>2)];
   var $33=(($32)|(0))==0;
   if ($33) { label = 8; break; } else { label = 20; break; }
  case 8: 
   var $35=_plan_get_current_block();
   HEAP32[((352)>>2)]=$35;
   var $36=HEAP32[((352)>>2)];
   var $37=(($36)|(0))!=0;
   if ($37) { label = 9; break; } else { label = 18; break; }
  case 9: 
   var $39=HEAP32[((352)>>2)];
   var $40=(($39)|0);
   var $41=HEAP8[($40)];
   var $42=(($41)&(255));
   var $43=HEAP8[((((120)|0))|0)];
   var $44=(($43)&(255));
   var $45=$42 ^ $44;
   var $46=(($45) & 255);
   HEAP8[(256)]=$46;
   HEAP8[((((94)|0))|0)]=1;
   var $47=HEAP32[((352)>>2)];
   var $48=(($47+16)|0);
   var $49=HEAP32[(($48)>>2)];
   var $50=$49 >> 1;
   HEAP32[((((64)|0))>>2)]=$50;
   var $51=HEAP32[((((64)|0))>>2)];
   HEAP32[((((68)|0))>>2)]=$51;
   var $52=HEAP32[((((64)|0))>>2)];
   HEAP32[((((72)|0))>>2)]=$52;
   var $53=HEAP32[((352)>>2)];
   var $54=(($53+16)|0);
   var $55=HEAP32[(($54)>>2)];
   HEAP32[((((76)|0))>>2)]=$55;
   var $56=HEAP32[((((76)|0))>>2)];
   HEAP32[((((80)|0))>>2)]=$56;
   var $57=HEAP8[((((33)|0))|0)];
   var $58=(($57)&(255));
   var $59=(($58)|(0))==3;
   if ($59) { label = 10; break; } else { label = 17; break; }
  case 10: 
   var $61=HEAP32[((352)>>2)];
   var $62=(($61+60)|0);
   var $63=HEAP32[(($62)>>2)];
   HEAP32[((((88)|0))>>2)]=$63;
   var $64=HEAP32[((352)>>2)];
   var $65=(($64+44)|0);
   var $66=HEAP32[(($65)>>2)];
   HEAP32[((((84)|0))>>2)]=$66;
   HEAP8[((((92)|0))|0)]=10;
   var $67=HEAP32[((((80)|0))>>2)];
   var $68=HEAP32[((352)>>2)];
   var $69=(($68+52)|0);
   var $70=HEAP32[(($69)>>2)];
   var $71=(($67)|(0))==(($70)|(0));
   if ($71) { label = 11; break; } else { label = 12; break; }
  case 11: 
   HEAP8[((((93)|0))|0)]=2;
   label = 16; break;
  case 12: 
   var $74=HEAP32[((((84)|0))>>2)];
   var $75=HEAP32[((352)>>2)];
   var $76=(($75+56)|0);
   var $77=HEAP32[(($76)>>2)];
   var $78=(($74)|(0))==(($77)|(0));
   if ($78) { label = 13; break; } else { label = 14; break; }
  case 13: 
   HEAP8[((((93)|0))|0)]=0;
   label = 15; break;
  case 14: 
   HEAP8[((((93)|0))|0)]=1;
   label = 15; break;
  case 15: 
   label = 16; break;
  case 16: 
   label = 17; break;
  case 17: 
   label = 19; break;
  case 18: 
   _st_go_idle();
   var $85=HEAP8[((((34)|0))|0)];
   var $86=(($85)&(255));
   var $87=$86 | 4;
   var $88=(($87) & 255);
   HEAP8[((((34)|0))|0)]=$88;
   $1=0;
   label = 75; break;
  case 19: 
   label = 20; break;
  case 20: 
   var $91=HEAP8[((((93)|0))|0)];
   var $92=(($91 << 24) >> 24)!=0;
   if ($92) { label = 21; break; } else { label = 34; break; }
  case 21: 
   var $94=HEAP8[((((92)|0))|0)];
   var $95=((($94)-(1))&255);
   HEAP8[((((92)|0))|0)]=$95;
   var $96=HEAP8[((((92)|0))|0)];
   var $97=(($96)&(255));
   var $98=(($97)|(0))==0;
   if ($98) { label = 22; break; } else { label = 33; break; }
  case 22: 
   HEAP8[((((92)|0))|0)]=20;
   var $100=HEAP8[((((93)|0))|0)];
   var $101=(($100)&(255));
   var $102=(($101)|(0))==1;
   if ($102) { label = 23; break; } else { label = 26; break; }
  case 23: 
   var $104=HEAP32[((352)>>2)];
   var $105=(($104+48)|0);
   var $106=HEAP32[(($105)>>2)];
   var $107=HEAP32[((((84)|0))>>2)];
   var $108=((($107)+($106))|0);
   HEAP32[((((84)|0))>>2)]=$108;
   var $109=HEAP32[((((84)|0))>>2)];
   var $110=HEAP32[((352)>>2)];
   var $111=(($110+56)|0);
   var $112=HEAP32[(($111)>>2)];
   var $113=(($109)>>>(0)) >= (($112)>>>(0));
   if ($113) { label = 24; break; } else { label = 25; break; }
  case 24: 
   HEAP8[((((93)|0))|0)]=0;
   var $115=HEAP32[((352)>>2)];
   var $116=(($115+56)|0);
   var $117=HEAP32[(($116)>>2)];
   HEAP32[((((84)|0))>>2)]=$117;
   label = 25; break;
  case 25: 
   label = 32; break;
  case 26: 
   var $120=HEAP8[((((93)|0))|0)];
   var $121=(($120)&(255));
   var $122=(($121)|(0))==2;
   if ($122) { label = 27; break; } else { label = 31; break; }
  case 27: 
   var $124=HEAP32[((((84)|0))>>2)];
   var $125=HEAP32[((352)>>2)];
   var $126=(($125+48)|0);
   var $127=HEAP32[(($126)>>2)];
   var $128=(($124)|(0)) > (($127)|(0));
   if ($128) { label = 28; break; } else { label = 29; break; }
  case 28: 
   var $130=HEAP32[((352)>>2)];
   var $131=(($130+48)|0);
   var $132=HEAP32[(($131)>>2)];
   var $133=HEAP32[((((84)|0))>>2)];
   var $134=((($133)-($132))|0);
   HEAP32[((((84)|0))>>2)]=$134;
   label = 30; break;
  case 29: 
   label = 30; break;
  case 30: 
   label = 31; break;
  case 31: 
   label = 32; break;
  case 32: 
   label = 33; break;
  case 33: 
   label = 34; break;
  case 34: 
   var $141=HEAP32[((((84)|0))>>2)];
   var $142=(($141)|(0)) < 64000;
   if ($142) { label = 35; break; } else { label = 36; break; }
  case 35: 
   var $144=HEAP32[((((88)|0))>>2)];
   var $145=((($144)-(64000))|0);
   HEAP32[((((88)|0))>>2)]=$145;
   label = 37; break;
  case 36: 
   var $147=HEAP32[((((84)|0))>>2)];
   var $148=HEAP32[((((88)|0))>>2)];
   var $149=((($148)-($147))|0);
   HEAP32[((((88)|0))>>2)]=$149;
   label = 37; break;
  case 37: 
   var $151=HEAP32[((((88)|0))>>2)];
   var $152=(($151)|(0)) < 0;
   if ($152) { label = 38; break; } else { label = 72; break; }
  case 38: 
   var $154=HEAP32[((352)>>2)];
   var $155=(($154+60)|0);
   var $156=HEAP32[(($155)>>2)];
   var $157=HEAP32[((((88)|0))>>2)];
   var $158=((($157)+($156))|0);
   HEAP32[((((88)|0))>>2)]=$158;
   var $159=HEAP8[((((33)|0))|0)];
   var $160=(($159)&(255));
   var $161=(($160)|(0))==4;
   if ($161) { label = 39; break; } else { label = 44; break; }
  case 39: 
   var $163=HEAP8[((((93)|0))|0)];
   var $164=(($163)&(255));
   var $165=(($164)|(0))!=2;
   if ($165) { label = 40; break; } else { label = 41; break; }
  case 40: 
   HEAP8[((((93)|0))|0)]=2;
   HEAP8[((((92)|0))|0)]=10;
   label = 41; break;
  case 41: 
   var $168=HEAP32[((((84)|0))>>2)];
   var $169=HEAP32[((352)>>2)];
   var $170=(($169+48)|0);
   var $171=HEAP32[(($170)>>2)];
   var $172=(($168)|(0)) <= (($171)|(0));
   if ($172) { label = 42; break; } else { label = 43; break; }
  case 42: 
   _st_go_idle();
   var $174=HEAP8[((((34)|0))|0)];
   var $175=(($174)&(255));
   var $176=$175 | 4;
   var $177=(($176) & 255);
   HEAP8[((((34)|0))|0)]=$177;
   $1=0;
   label = 75; break;
  case 43: 
   label = 44; break;
  case 44: 
   var $180=HEAP32[((352)>>2)];
   var $181=(($180)|0);
   var $182=HEAP8[($181)];
   HEAP8[(256)]=$182;
   HEAP8[((((94)|0))|0)]=1;
   var $183=HEAP32[((352)>>2)];
   var $184=(($183+4)|0);
   var $185=HEAP32[(($184)>>2)];
   var $186=HEAP32[((((64)|0))>>2)];
   var $187=((($186)-($185))|0);
   HEAP32[((((64)|0))>>2)]=$187;
   var $188=HEAP32[((((64)|0))>>2)];
   var $189=(($188)|(0)) < 0;
   if ($189) { label = 45; break; } else { label = 49; break; }
  case 45: 
   var $191=HEAP8[(256)];
   var $192=(($191)&(255));
   var $193=$192 | 4;
   var $194=(($193) & 255);
   HEAP8[(256)]=$194;
   var $195=HEAP32[((((76)|0))>>2)];
   var $196=HEAP32[((((64)|0))>>2)];
   var $197=((($196)+($195))|0);
   HEAP32[((((64)|0))>>2)]=$197;
   var $198=HEAP8[(256)];
   var $199=(($198)&(255));
   var $200=$199 & 32;
   var $201=(($200)|(0))!=0;
   if ($201) { label = 46; break; } else { label = 47; break; }
  case 46: 
   var $203=HEAP32[((((36)|0))>>2)];
   var $204=((($203)-(1))|0);
   HEAP32[((((36)|0))>>2)]=$204;
   label = 48; break;
  case 47: 
   var $206=HEAP32[((((36)|0))>>2)];
   var $207=((($206)+(1))|0);
   HEAP32[((((36)|0))>>2)]=$207;
   label = 48; break;
  case 48: 
   label = 49; break;
  case 49: 
   var $210=HEAP32[((352)>>2)];
   var $211=(($210+8)|0);
   var $212=HEAP32[(($211)>>2)];
   var $213=HEAP32[((((68)|0))>>2)];
   var $214=((($213)-($212))|0);
   HEAP32[((((68)|0))>>2)]=$214;
   var $215=HEAP32[((((68)|0))>>2)];
   var $216=(($215)|(0)) < 0;
   if ($216) { label = 50; break; } else { label = 54; break; }
  case 50: 
   var $218=HEAP8[(256)];
   var $219=(($218)&(255));
   var $220=$219 | 8;
   var $221=(($220) & 255);
   HEAP8[(256)]=$221;
   var $222=HEAP32[((((76)|0))>>2)];
   var $223=HEAP32[((((68)|0))>>2)];
   var $224=((($223)+($222))|0);
   HEAP32[((((68)|0))>>2)]=$224;
   var $225=HEAP8[(256)];
   var $226=(($225)&(255));
   var $227=$226 & 64;
   var $228=(($227)|(0))!=0;
   if ($228) { label = 51; break; } else { label = 52; break; }
  case 51: 
   var $230=HEAP32[((((40)|0))>>2)];
   var $231=((($230)-(1))|0);
   HEAP32[((((40)|0))>>2)]=$231;
   label = 53; break;
  case 52: 
   var $233=HEAP32[((((40)|0))>>2)];
   var $234=((($233)+(1))|0);
   HEAP32[((((40)|0))>>2)]=$234;
   label = 53; break;
  case 53: 
   label = 54; break;
  case 54: 
   var $237=HEAP32[((352)>>2)];
   var $238=(($237+12)|0);
   var $239=HEAP32[(($238)>>2)];
   var $240=HEAP32[((((72)|0))>>2)];
   var $241=((($240)-($239))|0);
   HEAP32[((((72)|0))>>2)]=$241;
   var $242=HEAP32[((((72)|0))>>2)];
   var $243=(($242)|(0)) < 0;
   if ($243) { label = 55; break; } else { label = 59; break; }
  case 55: 
   var $245=HEAP8[(256)];
   var $246=(($245)&(255));
   var $247=$246 | 16;
   var $248=(($247) & 255);
   HEAP8[(256)]=$248;
   var $249=HEAP32[((((76)|0))>>2)];
   var $250=HEAP32[((((72)|0))>>2)];
   var $251=((($250)+($249))|0);
   HEAP32[((((72)|0))>>2)]=$251;
   var $252=HEAP8[(256)];
   var $253=(($252)&(255));
   var $254=$253 & 128;
   var $255=(($254)|(0))!=0;
   if ($255) { label = 56; break; } else { label = 57; break; }
  case 56: 
   var $257=HEAP32[((((44)|0))>>2)];
   var $258=((($257)-(1))|0);
   HEAP32[((((44)|0))>>2)]=$258;
   label = 58; break;
  case 57: 
   var $260=HEAP32[((((44)|0))>>2)];
   var $261=((($260)+(1))|0);
   HEAP32[((((44)|0))>>2)]=$261;
   label = 58; break;
  case 58: 
   label = 59; break;
  case 59: 
   var $264=HEAP32[((((80)|0))>>2)];
   var $265=((($264)-(1))|0);
   HEAP32[((((80)|0))>>2)]=$265;
   var $266=HEAP32[((((80)|0))>>2)];
   var $267=(($266)|(0))!=0;
   if ($267) { label = 60; break; } else { label = 70; break; }
  case 60: 
   var $269=HEAP8[((((93)|0))|0)];
   var $270=(($269)&(255));
   var $271=(($270)|(0))!=2;
   if ($271) { label = 61; break; } else { label = 69; break; }
  case 61: 
   var $273=HEAP32[((((80)|0))>>2)];
   var $274=HEAP32[((352)>>2)];
   var $275=(($274+52)|0);
   var $276=HEAP32[(($275)>>2)];
   var $277=(($273)>>>(0)) <= (($276)>>>(0));
   if ($277) { label = 62; break; } else { label = 68; break; }
  case 62: 
   HEAP8[((((93)|0))|0)]=2;
   var $279=HEAP32[((((80)|0))>>2)];
   var $280=HEAP32[((352)>>2)];
   var $281=(($280+52)|0);
   var $282=HEAP32[(($281)>>2)];
   var $283=(($279)|(0))==(($282)|(0));
   if ($283) { label = 63; break; } else { label = 67; break; }
  case 63: 
   var $285=HEAP32[((((84)|0))>>2)];
   var $286=HEAP32[((352)>>2)];
   var $287=(($286+56)|0);
   var $288=HEAP32[(($287)>>2)];
   var $289=(($285)|(0))==(($288)|(0));
   if ($289) { label = 64; break; } else { label = 65; break; }
  case 64: 
   HEAP8[((((92)|0))|0)]=10;
   label = 66; break;
  case 65: 
   var $292=HEAP8[((((92)|0))|0)];
   var $293=(($292)&(255));
   var $294=(((20)-($293))|0);
   var $295=(($294) & 255);
   HEAP8[((((92)|0))|0)]=$295;
   label = 66; break;
  case 66: 
   label = 67; break;
  case 67: 
   label = 68; break;
  case 68: 
   label = 69; break;
  case 69: 
   label = 71; break;
  case 70: 
   HEAP32[((352)>>2)]=0;
   _plan_discard_current_block();
   label = 71; break;
  case 71: 
   var $302=HEAP8[((((120)|0))|0)];
   var $303=(($302)&(255));
   var $304=HEAP8[(256)];
   var $305=(($304)&(255));
   var $306=$305 ^ $303;
   var $307=(($306) & 255);
   HEAP8[(256)]=$307;
   label = 72; break;
  case 72: 
   HEAP8[(368)]=0;
   var $309=HEAP8[((((94)|0))|0)];
   var $310=(($309 << 24) >> 24)!=0;
   if ($310) { label = 73; break; } else { label = 74; break; }
  case 73: 
   var $312=HEAP8[(256)];
   $1=$312;
   label = 75; break;
  case 74: 
   $1=0;
   label = 75; break;
  case 75: 
   var $315=$1;
   return $315;
  default: assert(0, "bad label: " + label);
 }
}
function _st_reset() {
 var label = 0;
 _memset(64, 0, 32);
 HEAP32[((352)>>2)]=0;
 HEAP8[(368)]=0;
 return;
}
function _st_init() {
 var label = 0;
 var $1=HEAP8[(6376)];
 var $2=(($1)&(255));
 var $3=$2 | 252;
 var $4=(($3) & 255);
 HEAP8[(6376)]=$4;
 var $5=HEAP8[(6048)];
 var $6=(($5)&(255));
 var $7=$6 & -253;
 var $8=HEAP8[((((120)|0))|0)];
 var $9=(($8)&(255));
 var $10=$7 | $9;
 var $11=(($10) & 255);
 HEAP8[(6048)]=$11;
 var $12=HEAP8[(6392)];
 var $13=(($12)&(255));
 var $14=$13 | 1;
 var $15=(($14) & 255);
 HEAP8[(6392)]=$15;
 var $16=HEAP8[(5856)];
 var $17=(($16)&(255));
 var $18=$17 & -3;
 var $19=(($18) & 255);
 HEAP8[(5856)]=$19;
 HEAP8[(5944)]=0;
 HEAP8[(5904)]=0;
 HEAP8[(5952)]=2;
 HEAP8[(6152)]=31;
 var $20=HEAP8[(5872)];
 var $21=(($20)&(255));
 var $22=$21 & -2;
 var $23=(($22) & 255);
 HEAP8[(5872)]=$23;
 HEAP8[(5992)]=0;
 HEAP8[(5984)]=0;
 var $24=HEAP8[(5872)];
 var $25=(($24)&(255));
 var $26=$25 | 1;
 var $27=(($26) & 255);
 HEAP8[(5872)]=$27;
 _st_wake_up();
 _st_go_idle();
 return;
}
function _st_cycle_start() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1=HEAP8[((((33)|0))|0)];
   var $2=(($1)&(255));
   var $3=(($2)|(0))==2;
   if ($3) { label = 2; break; } else { label = 3; break; }
  case 2: 
   HEAP8[((((33)|0))|0)]=3;
   _st_wake_up();
   label = 3; break;
  case 3: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _st_cycle_reinitialize() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1=HEAP32[((352)>>2)];
   var $2=(($1)|(0))!=0;
   if ($2) { label = 2; break; } else { label = 3; break; }
  case 2: 
   var $4=HEAP32[((((80)|0))>>2)];
   _plan_cycle_reinitialize($4);
   HEAP8[((((93)|0))|0)]=1;
   HEAP8[((((92)|0))|0)]=10;
   HEAP32[((((84)|0))>>2)]=0;
   HEAP8[((((33)|0))|0)]=2;
   label = 4; break;
  case 3: 
   HEAP8[((((33)|0))|0)]=0;
   label = 4; break;
  case 4: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _write_global_settings() {
 var label = 0;
 return;
}
function _read_global_settings() {
 var label = 0;
 return 0;
}
function _plan_get_block_buffer_length() {
 var label = 0;
 return 50;
}
function _plan_synchronize() {
 var label = 0;
 return;
}
function _plan_get_block_buffer_head() {
 var label = 0;
 var $1=HEAP8[(384)];
 return $1;
}
function _plan_get_block_buffer_tail() {
 var label = 0;
 var $1=HEAP8[(376)];
 return $1;
}
function _settings_store_startup_line($n, $line) {
 var label = 0;
 var $1;
 var $2;
 $1=$n;
 $2=$line;
 return;
}
function _settings_write_coord_data($coord_select, $coord_data) {
 var label = 0;
 var $1;
 var $2;
 $1=$coord_select;
 $2=$coord_data;
 return;
}
function _settings_read_startup_line($n, $line) {
 var label = 0;
 var $1;
 var $2;
 $1=$n;
 $2=$line;
 return 0;
}
function _settings_read_coord_data($coord_select, $coord_data) {
 var label = 0;
 var $1;
 var $2;
 $1=$coord_select;
 $2=$coord_data;
 return 0;
}
function _eeprom_put_char($addr, $new_value) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2;
   var $old_value;
   var $diff_mask;
   $1=$addr;
   $2=$new_value;
   label = 2; break;
  case 2: 
   label = 3; break;
  case 3: 
   var $5=HEAP8[(6328)];
   var $6=(($5)&(255));
   var $7=$6 & 2;
   var $8=(($7)|(0))!=0;
   if ($8) { label = 2; break; } else { label = 4; break; }
  case 4: 
   var $10=$1;
   var $11=(($10) & 255);
   HEAP8[(6352)]=$11;
   HEAP8[(6328)]=1;
   var $12=HEAP8[(6320)];
   $old_value=$12;
   var $13=$old_value;
   var $14=(($13 << 24) >> 24);
   var $15=$2;
   var $16=(($15)&(255));
   var $17=$14 ^ $16;
   var $18=(($17) & 255);
   $diff_mask=$18;
   var $19=$diff_mask;
   var $20=(($19 << 24) >> 24);
   var $21=$2;
   var $22=(($21)&(255));
   var $23=$20 & $22;
   var $24=(($23)|(0))!=0;
   if ($24) { label = 5; break; } else { label = 9; break; }
  case 5: 
   var $26=$2;
   var $27=(($26)&(255));
   var $28=(($27)|(0))!=255;
   if ($28) { label = 6; break; } else { label = 7; break; }
  case 6: 
   var $30=$2;
   HEAP8[(6320)]=$30;
   HEAP8[(6328)]=4;
   var $31=HEAP8[(6328)];
   var $32=(($31)&(255));
   var $33=$32 | 2;
   var $34=(($33) & 255);
   HEAP8[(6328)]=$34;
   label = 8; break;
  case 7: 
   HEAP8[(6328)]=20;
   var $36=HEAP8[(6328)];
   var $37=(($36)&(255));
   var $38=$37 | 2;
   var $39=(($38) & 255);
   HEAP8[(6328)]=$39;
   label = 8; break;
  case 8: 
   label = 12; break;
  case 9: 
   var $42=$diff_mask;
   var $43=(($42 << 24) >> 24)!=0;
   if ($43) { label = 10; break; } else { label = 11; break; }
  case 10: 
   var $45=$2;
   HEAP8[(6320)]=$45;
   HEAP8[(6328)]=36;
   var $46=HEAP8[(6328)];
   var $47=(($46)&(255));
   var $48=$47 | 2;
   var $49=(($48) & 255);
   HEAP8[(6328)]=$49;
   label = 11; break;
  case 11: 
   label = 12; break;
  case 12: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _next_block_index($block_index) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   $1=$block_index;
   var $2=$1;
   var $3=((($2)+(1))&255);
   $1=$3;
   var $4=$1;
   var $5=(($4)&(255));
   var $6=(($5)|(0))==50;
   if ($6) { label = 2; break; } else { label = 3; break; }
  case 2: 
   $1=0;
   label = 3; break;
  case 3: 
   var $9=$1;
   return $9;
  default: assert(0, "bad label: " + label);
 }
}
function _plan_check_full_buffer() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2=HEAP8[(376)];
   var $3=(($2)&(255));
   var $4=HEAP8[(264)];
   var $5=(($4)&(255));
   var $6=(($3)|(0))==(($5)|(0));
   if ($6) { label = 2; break; } else { label = 3; break; }
  case 2: 
   $1=1;
   label = 4; break;
  case 3: 
   $1=0;
   label = 4; break;
  case 4: 
   var $10=$1;
   return $10;
  default: assert(0, "bad label: " + label);
 }
}
function _plan_get_current_block() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2=HEAP8[(384)];
   var $3=(($2)&(255));
   var $4=HEAP8[(376)];
   var $5=(($4)&(255));
   var $6=(($3)|(0))==(($5)|(0));
   if ($6) { label = 2; break; } else { label = 3; break; }
  case 2: 
   $1=0;
   label = 4; break;
  case 3: 
   var $9=HEAP8[(376)];
   var $10=(($9)&(255));
   var $11=((392+($10<<6))|0);
   $1=$11;
   label = 4; break;
  case 4: 
   var $13=$1;
   return $13;
  default: assert(0, "bad label: " + label);
 }
}
function _plan_get_block($n) {
 var label = 0;
 var $1;
 $1=$n;
 var $2=$1;
 var $3=(($2)&(255));
 var $4=((392+($3<<6))|0);
 return $4;
}
function _memcpy_to_eeprom_with_checksum($destination, $source, $size) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2;
   var $3;
   var $checksum;
   $1=$destination;
   $2=$source;
   $3=$size;
   $checksum=0;
   label = 2; break;
  case 2: 
   var $5=$3;
   var $6=(($5)>>>(0)) > 0;
   if ($6) { label = 3; break; } else { label = 7; break; }
  case 3: 
   var $8=$checksum;
   var $9=(($8)&(255));
   var $10=$9 << 1;
   var $11=(($10)|(0))!=0;
   if ($11) { var $18 = 1;label = 5; break; } else { label = 4; break; }
  case 4: 
   var $13=$checksum;
   var $14=(($13)&(255));
   var $15=$14 >> 7;
   var $16=(($15)|(0))!=0;
   var $18 = $16;label = 5; break;
  case 5: 
   var $18;
   var $19=(($18)&(1));
   var $20=(($19) & 255);
   $checksum=$20;
   var $21=$2;
   var $22=HEAP8[($21)];
   var $23=(($22 << 24) >> 24);
   var $24=$checksum;
   var $25=(($24)&(255));
   var $26=((($25)+($23))|0);
   var $27=(($26) & 255);
   $checksum=$27;
   var $28=$1;
   var $29=((($28)+(1))|0);
   $1=$29;
   var $30=$2;
   var $31=(($30+1)|0);
   $2=$31;
   var $32=HEAP8[($30)];
   _eeprom_put_char($28, $32);
   label = 6; break;
  case 6: 
   var $34=$3;
   var $35=((($34)-(1))|0);
   $3=$35;
   label = 2; break;
  case 7: 
   var $37=$1;
   var $38=$checksum;
   _eeprom_put_char($37, $38);
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _memcpy_from_eeprom_with_checksum($destination, $source, $size) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2;
   var $3;
   var $data;
   var $checksum;
   $1=$destination;
   $2=$source;
   $3=$size;
   $checksum=0;
   label = 2; break;
  case 2: 
   var $5=$3;
   var $6=(($5)>>>(0)) > 0;
   if ($6) { label = 3; break; } else { label = 7; break; }
  case 3: 
   var $8=$2;
   var $9=((($8)+(1))|0);
   $2=$9;
   var $10=_eeprom_get_char($8);
   $data=$10;
   var $11=$checksum;
   var $12=(($11)&(255));
   var $13=$12 << 1;
   var $14=(($13)|(0))!=0;
   if ($14) { var $21 = 1;label = 5; break; } else { label = 4; break; }
  case 4: 
   var $16=$checksum;
   var $17=(($16)&(255));
   var $18=$17 >> 7;
   var $19=(($18)|(0))!=0;
   var $21 = $19;label = 5; break;
  case 5: 
   var $21;
   var $22=(($21)&(1));
   var $23=(($22) & 255);
   $checksum=$23;
   var $24=$data;
   var $25=(($24)&(255));
   var $26=$checksum;
   var $27=(($26)&(255));
   var $28=((($27)+($25))|0);
   var $29=(($28) & 255);
   $checksum=$29;
   var $30=$data;
   var $31=$1;
   var $32=(($31+1)|0);
   $1=$32;
   HEAP8[($31)]=$30;
   label = 6; break;
  case 6: 
   var $34=$3;
   var $35=((($34)-(1))|0);
   $3=$35;
   label = 2; break;
  case 7: 
   var $37=$checksum;
   var $38=(($37)&(255));
   var $39=$2;
   var $40=_eeprom_get_char($39);
   var $41=(($40)&(255));
   var $42=(($38)|(0))==(($41)|(0));
   var $43=(($42)&(1));
   return $43;
  default: assert(0, "bad label: " + label);
 }
}
function _settings_reset($reset_all) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2=(($reset_all)&(1));
   $1=$2;
   var $3=$1;
   var $4=(($3) & 1);
   if ($4) { label = 2; break; } else { label = 3; break; }
  case 2: 
   HEAPF32[((((96)|0))>>2)]=250;
   HEAPF32[((((100)|0))>>2)]=250;
   HEAPF32[((((104)|0))>>2)]=250;
   HEAP8[((((109)|0))|0)]=10;
   HEAPF32[((((112)|0))>>2)]=250;
   HEAPF32[((((168)|0))>>2)]=500;
   HEAPF32[((((172)|0))>>2)]=500;
   HEAPF32[((((176)|0))>>2)]=500;
   HEAPF32[((((128)|0))>>2)]=36000;
   HEAPF32[((((132)|0))>>2)]=36000;
   HEAPF32[((((136)|0))>>2)]=36000;
   HEAPF32[((((124)|0))>>2)]=0.004999999888241291;
   HEAP8[((((120)|0))|0)]=-64;
   HEAPF32[((((140)|0))>>2)]=0.05000000074505806;
   label = 3; break;
  case 3: 
   HEAP8[((((144)|0))|0)]=0;
   var $7=HEAP8[((((144)|0))|0)];
   var $8=(($7)&(255));
   var $9=$8 | 2;
   var $10=(($9) & 255);
   HEAP8[((((144)|0))|0)]=$10;
   HEAP8[((((145)|0))|0)]=0;
   HEAPF32[((((148)|0))>>2)]=25;
   HEAPF32[((((152)|0))>>2)]=250;
   HEAP16[((((156)|0))>>1)]=100;
   HEAPF32[((((160)|0))>>2)]=1;
   HEAP8[((((164)|0))|0)]=25;
   HEAP8[((((165)|0))|0)]=3;
   HEAPF32[((((180)|0))>>2)]=200;
   HEAPF32[((((184)|0))>>2)]=200;
   HEAPF32[((((188)|0))>>2)]=200;
   _write_global_settings();
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _settings_store_global_setting($parameter, $value) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2;
   var $3;
   $2=$parameter;
   $3=$value;
   var $4=$2;
   if ((($4)|(0))==0 | (($4)|(0))==1 | (($4)|(0))==2) {
    label = 2; break;
   }
   else if ((($4)|(0))==3) {
    label = 5; break;
   }
   else if ((($4)|(0))==4) {
    label = 6; break;
   }
   else if ((($4)|(0))==5) {
    label = 7; break;
   }
   else if ((($4)|(0))==6) {
    label = 8; break;
   }
   else if ((($4)|(0))==7) {
    label = 9; break;
   }
   else if ((($4)|(0))==8) {
    label = 10; break;
   }
   else if ((($4)|(0))==9) {
    label = 11; break;
   }
   else if ((($4)|(0))==10) {
    label = 12; break;
   }
   else if ((($4)|(0))==11) {
    label = 13; break;
   }
   else if ((($4)|(0))==12) {
    label = 14; break;
   }
   else if ((($4)|(0))==13) {
    label = 17; break;
   }
   else if ((($4)|(0))==14) {
    label = 18; break;
   }
   else if ((($4)|(0))==15) {
    label = 19; break;
   }
   else if ((($4)|(0))==16) {
    label = 20; break;
   }
   else if ((($4)|(0))==17) {
    label = 21; break;
   }
   else if ((($4)|(0))==18) {
    label = 22; break;
   }
   else if ((($4)|(0))==19) {
    label = 23; break;
   }
   else if ((($4)|(0))==20) {
    label = 27; break;
   }
   else if ((($4)|(0))==21) {
    label = 31; break;
   }
   else if ((($4)|(0))==22) {
    label = 35; break;
   }
   else if ((($4)|(0))==23) {
    label = 41; break;
   }
   else if ((($4)|(0))==24) {
    label = 45; break;
   }
   else if ((($4)|(0))==25) {
    label = 49; break;
   }
   else if ((($4)|(0))==26) {
    label = 50; break;
   }
   else if ((($4)|(0))==27) {
    label = 51; break;
   }
   else if ((($4)|(0))==28) {
    label = 52; break;
   }
   else if ((($4)|(0))==29) {
    label = 53; break;
   }
   else {
   label = 54; break;
   }
  case 2: 
   var $6=$3;
   var $7=$6;
   var $8=$7 <= 0;
   if ($8) { label = 3; break; } else { label = 4; break; }
  case 3: 
   $1=8;
   label = 56; break;
  case 4: 
   var $11=$3;
   var $12=$2;
   var $13=((((96)|0)+($12<<2))|0);
   HEAPF32[(($13)>>2)]=$11;
   label = 55; break;
  case 5: 
   var $15=$3;
   HEAPF32[((((168)|0))>>2)]=$15;
   label = 55; break;
  case 6: 
   var $17=$3;
   HEAPF32[((((172)|0))>>2)]=$17;
   label = 55; break;
  case 7: 
   var $19=$3;
   HEAPF32[((((176)|0))>>2)]=$19;
   label = 55; break;
  case 8: 
   var $21=$3;
   var $22=($21)*(60);
   var $23=($22)*(60);
   HEAPF32[((((128)|0))>>2)]=$23;
   label = 55; break;
  case 9: 
   var $25=$3;
   var $26=($25)*(60);
   var $27=($26)*(60);
   HEAPF32[((((132)|0))>>2)]=$27;
   label = 55; break;
  case 10: 
   var $29=$3;
   var $30=($29)*(60);
   var $31=($30)*(60);
   HEAPF32[((((136)|0))>>2)]=$31;
   label = 55; break;
  case 11: 
   var $33=$3;
   HEAPF32[((((180)|0))>>2)]=$33;
   label = 55; break;
  case 12: 
   var $35=$3;
   HEAPF32[((((184)|0))>>2)]=$35;
   label = 55; break;
  case 13: 
   var $37=$3;
   HEAPF32[((((188)|0))>>2)]=$37;
   label = 55; break;
  case 14: 
   var $39=$3;
   var $40=$39 < 3;
   if ($40) { label = 15; break; } else { label = 16; break; }
  case 15: 
   $1=9;
   label = 56; break;
  case 16: 
   var $43=$3;
   var $44=$43;
   var $45=_round($44);
   var $46=($45>=0 ? Math.floor($45) : Math.ceil($45));
   HEAP8[((((109)|0))|0)]=$46;
   label = 55; break;
  case 17: 
   var $48=$3;
   HEAPF32[((((112)|0))>>2)]=$48;
   label = 55; break;
  case 18: 
   var $50=$3;
   var $51=$50;
   var $52=_trunc($51);
   var $53=($52>=0 ? Math.floor($52) : Math.ceil($52));
   HEAP8[((((120)|0))|0)]=$53;
   label = 55; break;
  case 19: 
   var $55=$3;
   var $56=$55;
   var $57=_round($56);
   var $58=($57>=0 ? Math.floor($57) : Math.ceil($57));
   HEAP8[((((164)|0))|0)]=$58;
   label = 55; break;
  case 20: 
   var $60=$3;
   var $61=$60;
   var $62=Math.abs($61);
   var $63=$62;
   HEAPF32[((((140)|0))>>2)]=$63;
   label = 55; break;
  case 21: 
   var $65=$3;
   HEAPF32[((((124)|0))>>2)]=$65;
   label = 55; break;
  case 22: 
   var $67=$3;
   var $68=$67;
   var $69=_round($68);
   var $70=($69>=0 ? Math.floor($69) : Math.ceil($69));
   HEAP8[((((165)|0))|0)]=$70;
   label = 55; break;
  case 23: 
   var $72=$3;
   var $73=$72 != 0;
   if ($73) { label = 24; break; } else { label = 25; break; }
  case 24: 
   var $75=HEAP8[((((144)|0))|0)];
   var $76=(($75)&(255));
   var $77=$76 | 1;
   var $78=(($77) & 255);
   HEAP8[((((144)|0))|0)]=$78;
   label = 26; break;
  case 25: 
   var $80=HEAP8[((((144)|0))|0)];
   var $81=(($80)&(255));
   var $82=$81 & -2;
   var $83=(($82) & 255);
   HEAP8[((((144)|0))|0)]=$83;
   label = 26; break;
  case 26: 
   label = 55; break;
  case 27: 
   var $86=$3;
   var $87=$86 != 0;
   if ($87) { label = 28; break; } else { label = 29; break; }
  case 28: 
   var $89=HEAP8[((((144)|0))|0)];
   var $90=(($89)&(255));
   var $91=$90 | 2;
   var $92=(($91) & 255);
   HEAP8[((((144)|0))|0)]=$92;
   label = 30; break;
  case 29: 
   var $94=HEAP8[((((144)|0))|0)];
   var $95=(($94)&(255));
   var $96=$95 & -3;
   var $97=(($96) & 255);
   HEAP8[((((144)|0))|0)]=$97;
   label = 30; break;
  case 30: 
   label = 55; break;
  case 31: 
   var $100=$3;
   var $101=$100 != 0;
   if ($101) { label = 32; break; } else { label = 33; break; }
  case 32: 
   var $103=HEAP8[((((144)|0))|0)];
   var $104=(($103)&(255));
   var $105=$104 | 4;
   var $106=(($105) & 255);
   HEAP8[((((144)|0))|0)]=$106;
   label = 34; break;
  case 33: 
   var $108=HEAP8[((((144)|0))|0)];
   var $109=(($108)&(255));
   var $110=$109 & -5;
   var $111=(($110) & 255);
   HEAP8[((((144)|0))|0)]=$111;
   label = 34; break;
  case 34: 
   label = 55; break;
  case 35: 
   var $114=$3;
   var $115=$114 != 0;
   if ($115) { label = 36; break; } else { label = 39; break; }
  case 36: 
   var $117=HEAP8[((((144)|0))|0)];
   var $118=(($117)&(255));
   var $119=$118 & 16;
   var $120=(($119)|(0))==0;
   if ($120) { label = 37; break; } else { label = 38; break; }
  case 37: 
   $1=13;
   label = 56; break;
  case 38: 
   var $123=HEAP8[((((144)|0))|0)];
   var $124=(($123)&(255));
   var $125=$124 | 32;
   var $126=(($125) & 255);
   HEAP8[((((144)|0))|0)]=$126;
   label = 40; break;
  case 39: 
   var $128=HEAP8[((((144)|0))|0)];
   var $129=(($128)&(255));
   var $130=$129 & -33;
   var $131=(($130) & 255);
   HEAP8[((((144)|0))|0)]=$131;
   label = 40; break;
  case 40: 
   label = 55; break;
  case 41: 
   var $134=$3;
   var $135=$134 != 0;
   if ($135) { label = 42; break; } else { label = 43; break; }
  case 42: 
   var $137=HEAP8[((((144)|0))|0)];
   var $138=(($137)&(255));
   var $139=$138 | 8;
   var $140=(($139) & 255);
   HEAP8[((((144)|0))|0)]=$140;
   label = 44; break;
  case 43: 
   var $142=HEAP8[((((144)|0))|0)];
   var $143=(($142)&(255));
   var $144=$143 & -9;
   var $145=(($144) & 255);
   HEAP8[((((144)|0))|0)]=$145;
   label = 44; break;
  case 44: 
   _limits_init();
   label = 55; break;
  case 45: 
   var $148=$3;
   var $149=$148 != 0;
   if ($149) { label = 46; break; } else { label = 47; break; }
  case 46: 
   var $151=HEAP8[((((144)|0))|0)];
   var $152=(($151)&(255));
   var $153=$152 | 16;
   var $154=(($153) & 255);
   HEAP8[((((144)|0))|0)]=$154;
   label = 48; break;
  case 47: 
   var $156=HEAP8[((((144)|0))|0)];
   var $157=(($156)&(255));
   var $158=$157 & -17;
   var $159=(($158) & 255);
   HEAP8[((((144)|0))|0)]=$159;
   label = 48; break;
  case 48: 
   label = 55; break;
  case 49: 
   var $162=$3;
   var $163=$162;
   var $164=_trunc($163);
   var $165=($164>=0 ? Math.floor($164) : Math.ceil($164));
   HEAP8[((((145)|0))|0)]=$165;
   label = 55; break;
  case 50: 
   var $167=$3;
   HEAPF32[((((148)|0))>>2)]=$167;
   label = 55; break;
  case 51: 
   var $169=$3;
   HEAPF32[((((152)|0))>>2)]=$169;
   label = 55; break;
  case 52: 
   var $171=$3;
   var $172=$171;
   var $173=_round($172);
   var $174=($173>=0 ? Math.floor($173) : Math.ceil($173));
   HEAP16[((((156)|0))>>1)]=$174;
   label = 55; break;
  case 53: 
   var $176=$3;
   HEAPF32[((((160)|0))>>2)]=$176;
   label = 55; break;
  case 54: 
   $1=6;
   label = 56; break;
  case 55: 
   _write_global_settings();
   $1=0;
   label = 56; break;
  case 56: 
   var $180=$1;
   return $180;
  default: assert(0, "bad label: " + label);
 }
}
function _settings_init() {
 var label = 0;
 _settings_reset(1);
 return;
}
function _plan_init() {
 var label = 0;
 var $1=HEAP8[(384)];
 HEAP8[(376)]=$1;
 var $2=HEAP8[(384)];
 var $3=_next_block_index($2);
 HEAP8[(264)]=$3;
 _memset(216, 0, 40);
 return;
}
function _plan_discard_current_block() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1=HEAP8[(384)];
   var $2=(($1)&(255));
   var $3=HEAP8[(376)];
   var $4=(($3)&(255));
   var $5=(($2)|(0))!=(($4)|(0));
   if ($5) { label = 2; break; } else { label = 3; break; }
  case 2: 
   var $7=HEAP8[(376)];
   var $8=_next_block_index($7);
   HEAP8[(376)]=$8;
   label = 3; break;
  case 3: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _plan_set_current_position($x, $y, $z) {
 var label = 0;
 var $1;
 var $2;
 var $3;
 $1=$x;
 $2=$y;
 $3=$z;
 var $4=$1;
 HEAP32[((((216)|0))>>2)]=$4;
 var $5=$2;
 HEAP32[((((220)|0))>>2)]=$5;
 var $6=$3;
 HEAP32[((((224)|0))>>2)]=$6;
 var $7=$1;
 var $8=(($7)|(0));
 var $9=HEAPF32[((((96)|0))>>2)];
 var $10=($8)/($9);
 HEAPF32[((((244)|0))>>2)]=$10;
 var $11=$2;
 var $12=(($11)|(0));
 var $13=HEAPF32[((((100)|0))>>2)];
 var $14=($12)/($13);
 HEAPF32[((((248)|0))>>2)]=$14;
 var $15=$3;
 var $16=(($15)|(0));
 var $17=HEAPF32[((((104)|0))>>2)];
 var $18=($16)/($17);
 HEAPF32[((((252)|0))>>2)]=$18;
 return;
}
function _prev_block_index($block_index) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   $1=$block_index;
   var $2=$1;
   var $3=(($2)&(255));
   var $4=(($3)|(0))==0;
   if ($4) { label = 2; break; } else { label = 3; break; }
  case 2: 
   $1=50;
   label = 3; break;
  case 3: 
   var $7=$1;
   var $8=((($7)-(1))&255);
   $1=$8;
   var $9=$1;
   return $9;
  default: assert(0, "bad label: " + label);
 }
}
function _plan_buffer_line($x, $y, $z, $feed_rate, $invert_feed_rate) {
 var label = 0;
 var __stackBase__  = STACKTOP; STACKTOP = (STACKTOP + 48)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2;
   var $3;
   var $4;
   var $5;
   var $block;
   var $target=__stackBase__;
   var $delta_mm=(__stackBase__)+(16);
   var $i;
   var $unit_vec=(__stackBase__)+(32);
   var $inverse_unit_vec_value;
   var $inverse_millimeters;
   var $cos_theta;
   var $sin_theta_d2;
   $1=$x;
   $2=$y;
   $3=$z;
   $4=$feed_rate;
   $5=$invert_feed_rate;
   var $6=HEAP8[(384)];
   var $7=(($6)&(255));
   var $8=((392+($7<<6))|0);
   $block=$8;
   var $9=$1;
   var $10=HEAPF32[((((96)|0))>>2)];
   var $11=($9)*($10);
   var $12=$11;
   var $13=_round($12);
   var $14=(($target)|0);
   HEAP32[(($14)>>2)]=$13;
   var $15=$2;
   var $16=HEAPF32[((((100)|0))>>2)];
   var $17=($15)*($16);
   var $18=$17;
   var $19=_round($18);
   var $20=(($target+4)|0);
   HEAP32[(($20)>>2)]=$19;
   var $21=$3;
   var $22=HEAPF32[((((104)|0))>>2)];
   var $23=($21)*($22);
   var $24=$23;
   var $25=_round($24);
   var $26=(($target+8)|0);
   HEAP32[(($26)>>2)]=$25;
   var $27=(($target)|0);
   var $28=HEAP32[(($27)>>2)];
   var $29=HEAP32[((((216)|0))>>2)];
   var $30=((($28)-($29))|0);
   var $31=Math.abs($30);
   var $32=$block;
   var $33=(($32+4)|0);
   HEAP32[(($33)>>2)]=$31;
   var $34=(($target+4)|0);
   var $35=HEAP32[(($34)>>2)];
   var $36=HEAP32[((((220)|0))>>2)];
   var $37=((($35)-($36))|0);
   var $38=Math.abs($37);
   var $39=$block;
   var $40=(($39+8)|0);
   HEAP32[(($40)>>2)]=$38;
   var $41=(($target+8)|0);
   var $42=HEAP32[(($41)>>2)];
   var $43=HEAP32[((((224)|0))>>2)];
   var $44=((($42)-($43))|0);
   var $45=Math.abs($44);
   var $46=$block;
   var $47=(($46+12)|0);
   HEAP32[(($47)>>2)]=$45;
   var $48=$block;
   var $49=(($48+4)|0);
   var $50=HEAP32[(($49)>>2)];
   var $51=$block;
   var $52=(($51+8)|0);
   var $53=HEAP32[(($52)>>2)];
   var $54=$block;
   var $55=(($54+12)|0);
   var $56=HEAP32[(($55)>>2)];
   var $57=(($53)>>>(0)) > (($56)>>>(0));
   if ($57) { label = 2; break; } else { label = 3; break; }
  case 2: 
   var $59=$block;
   var $60=(($59+8)|0);
   var $61=HEAP32[(($60)>>2)];
   var $67 = $61;label = 4; break;
  case 3: 
   var $63=$block;
   var $64=(($63+12)|0);
   var $65=HEAP32[(($64)>>2)];
   var $67 = $65;label = 4; break;
  case 4: 
   var $67;
   var $68=(($50)>>>(0)) > (($67)>>>(0));
   if ($68) { label = 5; break; } else { label = 6; break; }
  case 5: 
   var $70=$block;
   var $71=(($70+4)|0);
   var $72=HEAP32[(($71)>>2)];
   var $92 = $72;label = 10; break;
  case 6: 
   var $74=$block;
   var $75=(($74+8)|0);
   var $76=HEAP32[(($75)>>2)];
   var $77=$block;
   var $78=(($77+12)|0);
   var $79=HEAP32[(($78)>>2)];
   var $80=(($76)>>>(0)) > (($79)>>>(0));
   if ($80) { label = 7; break; } else { label = 8; break; }
  case 7: 
   var $82=$block;
   var $83=(($82+8)|0);
   var $84=HEAP32[(($83)>>2)];
   var $90 = $84;label = 9; break;
  case 8: 
   var $86=$block;
   var $87=(($86+12)|0);
   var $88=HEAP32[(($87)>>2)];
   var $90 = $88;label = 9; break;
  case 9: 
   var $90;
   var $92 = $90;label = 10; break;
  case 10: 
   var $92;
   var $93=$block;
   var $94=(($93+16)|0);
   HEAP32[(($94)>>2)]=$92;
   var $95=$block;
   var $96=(($95+16)|0);
   var $97=HEAP32[(($96)>>2)];
   var $98=(($97)|(0))==0;
   if ($98) { label = 11; break; } else { label = 12; break; }
  case 11: 
   label = 53; break;
  case 12: 
   var $101=$1;
   var $102=HEAPF32[((((244)|0))>>2)];
   var $103=($101)-($102);
   var $104=(($delta_mm)|0);
   HEAPF32[(($104)>>2)]=$103;
   var $105=$2;
   var $106=HEAPF32[((((248)|0))>>2)];
   var $107=($105)-($106);
   var $108=(($delta_mm+4)|0);
   HEAPF32[(($108)>>2)]=$107;
   var $109=$3;
   var $110=HEAPF32[((((252)|0))>>2)];
   var $111=($109)-($110);
   var $112=(($delta_mm+8)|0);
   HEAPF32[(($112)>>2)]=$111;
   var $113=(($delta_mm)|0);
   var $114=HEAPF32[(($113)>>2)];
   var $115=(($delta_mm)|0);
   var $116=HEAPF32[(($115)>>2)];
   var $117=($114)*($116);
   var $118=(($delta_mm+4)|0);
   var $119=HEAPF32[(($118)>>2)];
   var $120=(($delta_mm+4)|0);
   var $121=HEAPF32[(($120)>>2)];
   var $122=($119)*($121);
   var $123=($117)+($122);
   var $124=(($delta_mm+8)|0);
   var $125=HEAPF32[(($124)>>2)];
   var $126=(($delta_mm+8)|0);
   var $127=HEAPF32[(($126)>>2)];
   var $128=($125)*($127);
   var $129=($123)+($128);
   var $130=$129;
   var $131=Math.sqrt($130);
   var $132=$131;
   var $133=$block;
   var $134=(($133+32)|0);
   HEAPF32[(($134)>>2)]=$132;
   var $135=$4;
   var $136=$135 < 0;
   if ($136) { label = 13; break; } else { label = 14; break; }
  case 13: 
   $4=9.999999680285692e+37;
   label = 17; break;
  case 14: 
   var $139=$5;
   var $140=(($139 << 24) >> 24)!=0;
   if ($140) { label = 15; break; } else { label = 16; break; }
  case 15: 
   var $142=$block;
   var $143=(($142+32)|0);
   var $144=HEAPF32[(($143)>>2)];
   var $145=$4;
   var $146=($144)/($145);
   $4=$146;
   label = 16; break;
  case 16: 
   label = 17; break;
  case 17: 
   var $149=$block;
   var $150=(($149+32)|0);
   var $151=HEAPF32[(($150)>>2)];
   var $152=$151;
   var $153=(1)/($152);
   var $154=$153;
   $inverse_millimeters=$154;
   var $155=$block;
   var $156=(($155+36)|0);
   HEAPF32[(($156)>>2)]=9.999999680285692e+37;
   $i=0;
   label = 18; break;
  case 18: 
   var $158=$i;
   var $159=(($158)&(255));
   var $160=(($159)|(0)) < 3;
   if ($160) { label = 19; break; } else { label = 30; break; }
  case 19: 
   var $162=$i;
   var $163=(($162)&(255));
   var $164=(($delta_mm+($163<<2))|0);
   var $165=HEAPF32[(($164)>>2)];
   var $166=$165 == 0;
   if ($166) { label = 20; break; } else { label = 21; break; }
  case 20: 
   var $168=$i;
   var $169=(($168)&(255));
   var $170=(($unit_vec+($169<<2))|0);
   HEAPF32[(($170)>>2)]=0;
   label = 28; break;
  case 21: 
   var $172=$i;
   var $173=(($172)&(255));
   var $174=(($delta_mm+($173<<2))|0);
   var $175=HEAPF32[(($174)>>2)];
   var $176=$inverse_millimeters;
   var $177=($175)*($176);
   var $178=$i;
   var $179=(($178)&(255));
   var $180=(($unit_vec+($179<<2))|0);
   HEAPF32[(($180)>>2)]=$177;
   var $181=$i;
   var $182=(($181)&(255));
   var $183=(($unit_vec+($182<<2))|0);
   var $184=HEAPF32[(($183)>>2)];
   var $185=$184;
   var $186=(1)/($185);
   var $187=(($186)&-1);
   var $188=Math.abs($187);
   var $189=(($188)|(0));
   $inverse_unit_vec_value=$189;
   var $190=$4;
   var $191=$i;
   var $192=(($191)&(255));
   var $193=((((168)|0)+($192<<2))|0);
   var $194=HEAPF32[(($193)>>2)];
   var $195=$inverse_unit_vec_value;
   var $196=($194)*($195);
   var $197=$190 < $196;
   if ($197) { label = 22; break; } else { label = 23; break; }
  case 22: 
   var $199=$4;
   var $208 = $199;label = 24; break;
  case 23: 
   var $201=$i;
   var $202=(($201)&(255));
   var $203=((((168)|0)+($202<<2))|0);
   var $204=HEAPF32[(($203)>>2)];
   var $205=$inverse_unit_vec_value;
   var $206=($204)*($205);
   var $208 = $206;label = 24; break;
  case 24: 
   var $208;
   $4=$208;
   var $209=$block;
   var $210=(($209+36)|0);
   var $211=HEAPF32[(($210)>>2)];
   var $212=$i;
   var $213=(($212)&(255));
   var $214=((((128)|0)+($213<<2))|0);
   var $215=HEAPF32[(($214)>>2)];
   var $216=$inverse_unit_vec_value;
   var $217=($215)*($216);
   var $218=$211 < $217;
   if ($218) { label = 25; break; } else { label = 26; break; }
  case 25: 
   var $220=$block;
   var $221=(($220+36)|0);
   var $222=HEAPF32[(($221)>>2)];
   var $231 = $222;label = 27; break;
  case 26: 
   var $224=$i;
   var $225=(($224)&(255));
   var $226=((((128)|0)+($225<<2))|0);
   var $227=HEAPF32[(($226)>>2)];
   var $228=$inverse_unit_vec_value;
   var $229=($227)*($228);
   var $231 = $229;label = 27; break;
  case 27: 
   var $231;
   var $232=$block;
   var $233=(($232+36)|0);
   HEAPF32[(($233)>>2)]=$231;
   label = 28; break;
  case 28: 
   label = 29; break;
  case 29: 
   var $236=$i;
   var $237=((($236)+(1))&255);
   $i=$237;
   label = 18; break;
  case 30: 
   var $239=$4;
   var $240=$4;
   var $241=($239)*($240);
   var $242=$block;
   var $243=(($242+20)|0);
   HEAPF32[(($243)>>2)]=$241;
   var $244=$4;
   var $245=$244;
   var $246=($245)*(666.6666666666666);
   var $247=Math.ceil($246);
   var $248=($247>=0 ? Math.floor($247) : Math.ceil($247));
   var $249=$block;
   var $250=(($249+56)|0);
   HEAP32[(($250)>>2)]=$248;
   var $251=$block;
   var $252=(($251+36)|0);
   var $253=HEAPF32[(($252)>>2)];
   var $254=$253;
   var $255=($254)*(0.09259259259259259);
   var $256=Math.ceil($255);
   var $257=(($256)&-1);
   var $258=$block;
   var $259=(($258+48)|0);
   HEAP32[(($259)>>2)]=$257;
   var $260=$block;
   var $261=(($260+32)|0);
   var $262=HEAPF32[(($261)>>2)];
   var $263=$262;
   var $264=($263)*(100000000);
   var $265=$block;
   var $266=(($265+16)|0);
   var $267=HEAP32[(($266)>>2)];
   var $268=(($267)|(0));
   var $269=($264)/($268);
   var $270=Math.ceil($269);
   var $271=($270>=0 ? Math.floor($270) : Math.ceil($270));
   var $272=$block;
   var $273=(($272+60)|0);
   HEAP32[(($273)>>2)]=$271;
   var $274=$block;
   var $275=(($274)|0);
   HEAP8[($275)]=0;
   var $276=(($unit_vec)|0);
   var $277=HEAPF32[(($276)>>2)];
   var $278=$277 < 0;
   if ($278) { label = 31; break; } else { label = 32; break; }
  case 31: 
   var $280=$block;
   var $281=(($280)|0);
   var $282=HEAP8[($281)];
   var $283=(($282)&(255));
   var $284=$283 | 32;
   var $285=(($284) & 255);
   HEAP8[($281)]=$285;
   label = 32; break;
  case 32: 
   var $287=(($unit_vec+4)|0);
   var $288=HEAPF32[(($287)>>2)];
   var $289=$288 < 0;
   if ($289) { label = 33; break; } else { label = 34; break; }
  case 33: 
   var $291=$block;
   var $292=(($291)|0);
   var $293=HEAP8[($292)];
   var $294=(($293)&(255));
   var $295=$294 | 64;
   var $296=(($295) & 255);
   HEAP8[($292)]=$296;
   label = 34; break;
  case 34: 
   var $298=(($unit_vec+8)|0);
   var $299=HEAPF32[(($298)>>2)];
   var $300=$299 < 0;
   if ($300) { label = 35; break; } else { label = 36; break; }
  case 35: 
   var $302=$block;
   var $303=(($302)|0);
   var $304=HEAP8[($303)];
   var $305=(($304)&(255));
   var $306=$305 | 128;
   var $307=(($306) & 255);
   HEAP8[($303)]=$307;
   label = 36; break;
  case 36: 
   var $309=$block;
   var $310=(($309+28)|0);
   HEAPF32[(($310)>>2)]=0;
   var $311=HEAP8[(384)];
   var $312=(($311)&(255));
   var $313=HEAP8[(376)];
   var $314=(($313)&(255));
   var $315=(($312)|(0))!=(($314)|(0));
   if ($315) { label = 37; break; } else { label = 49; break; }
  case 37: 
   var $317=HEAPF32[((((240)|0))>>2)];
   var $318=$317;
   var $319=$318 > 0;
   if ($319) { label = 38; break; } else { label = 49; break; }
  case 38: 
   var $321=HEAPF32[((((228)|0))>>2)];
   var $322=(-$321);
   var $323=(($unit_vec)|0);
   var $324=HEAPF32[(($323)>>2)];
   var $325=($322)*($324);
   var $326=HEAPF32[((((232)|0))>>2)];
   var $327=(($unit_vec+4)|0);
   var $328=HEAPF32[(($327)>>2)];
   var $329=($326)*($328);
   var $330=($325)-($329);
   var $331=HEAPF32[((((236)|0))>>2)];
   var $332=(($unit_vec+8)|0);
   var $333=HEAPF32[(($332)>>2)];
   var $334=($331)*($333);
   var $335=($330)-($334);
   $cos_theta=$335;
   var $336=$cos_theta;
   var $337=$336;
   var $338=$337 < 0.95;
   if ($338) { label = 39; break; } else { label = 48; break; }
  case 39: 
   var $340=$block;
   var $341=(($340+20)|0);
   var $342=HEAPF32[(($341)>>2)];
   var $343=HEAPF32[((((240)|0))>>2)];
   var $344=$342 < $343;
   if ($344) { label = 40; break; } else { label = 41; break; }
  case 40: 
   var $346=$block;
   var $347=(($346+20)|0);
   var $348=HEAPF32[(($347)>>2)];
   var $352 = $348;label = 42; break;
  case 41: 
   var $350=HEAPF32[((((240)|0))>>2)];
   var $352 = $350;label = 42; break;
  case 42: 
   var $352;
   var $353=$block;
   var $354=(($353+28)|0);
   HEAPF32[(($354)>>2)]=$352;
   var $355=$cos_theta;
   var $356=$355;
   var $357=$356 > -0.95;
   if ($357) { label = 43; break; } else { label = 47; break; }
  case 43: 
   var $359=$cos_theta;
   var $360=$359;
   var $361=(1)-($360);
   var $362=($361)*(0.5);
   var $363=Math.sqrt($362);
   var $364=$363;
   $sin_theta_d2=$364;
   var $365=$block;
   var $366=(($365+28)|0);
   var $367=HEAPF32[(($366)>>2)];
   var $368=$367;
   var $369=$block;
   var $370=(($369+36)|0);
   var $371=HEAPF32[(($370)>>2)];
   var $372=HEAPF32[((((140)|0))>>2)];
   var $373=($371)*($372);
   var $374=$sin_theta_d2;
   var $375=($373)*($374);
   var $376=$375;
   var $377=$sin_theta_d2;
   var $378=$377;
   var $379=(1)-($378);
   var $380=($376)/($379);
   var $381=$368 < $380;
   if ($381) { label = 44; break; } else { label = 45; break; }
  case 44: 
   var $383=$block;
   var $384=(($383+28)|0);
   var $385=HEAPF32[(($384)>>2)];
   var $386=$385;
   var $401 = $386;label = 46; break;
  case 45: 
   var $388=$block;
   var $389=(($388+36)|0);
   var $390=HEAPF32[(($389)>>2)];
   var $391=HEAPF32[((((140)|0))>>2)];
   var $392=($390)*($391);
   var $393=$sin_theta_d2;
   var $394=($392)*($393);
   var $395=$394;
   var $396=$sin_theta_d2;
   var $397=$396;
   var $398=(1)-($397);
   var $399=($395)/($398);
   var $401 = $399;label = 46; break;
  case 46: 
   var $401;
   var $402=$401;
   var $403=$block;
   var $404=(($403+28)|0);
   HEAPF32[(($404)>>2)]=$402;
   label = 47; break;
  case 47: 
   label = 48; break;
  case 48: 
   label = 49; break;
  case 49: 
   var $408=$block;
   var $409=(($408+28)|0);
   var $410=HEAPF32[(($409)>>2)];
   var $411=$410;
   var $412=$block;
   var $413=(($412+36)|0);
   var $414=HEAPF32[(($413)>>2)];
   var $415=($414)*(2);
   var $416=$block;
   var $417=(($416+32)|0);
   var $418=HEAPF32[(($417)>>2)];
   var $419=($415)*($418);
   var $420=$419;
   var $421=$420;
   var $422=$411 < $421;
   if ($422) { label = 50; break; } else { label = 51; break; }
  case 50: 
   var $424=$block;
   var $425=(($424+28)|0);
   var $426=HEAPF32[(($425)>>2)];
   var $427=$426;
   var $440 = $427;label = 52; break;
  case 51: 
   var $429=$block;
   var $430=(($429+36)|0);
   var $431=HEAPF32[(($430)>>2)];
   var $432=($431)*(2);
   var $433=$block;
   var $434=(($433+32)|0);
   var $435=HEAPF32[(($434)>>2)];
   var $436=($432)*($435);
   var $437=$436;
   var $438=$437;
   var $440 = $438;label = 52; break;
  case 52: 
   var $440;
   var $441=$440;
   var $442=$block;
   var $443=(($442+24)|0);
   HEAPF32[(($443)>>2)]=$441;
   var $444=$block;
   var $445=(($444+40)|0);
   HEAP8[($445)]=1;
   var $446=$unit_vec;
   assert(12 % 1 === 0);HEAP32[(((((228)|0)))>>2)]=HEAP32[(($446)>>2)];HEAP32[((((((228)|0)))+(4))>>2)]=HEAP32[((($446)+(4))>>2)];HEAP32[((((((228)|0)))+(8))>>2)]=HEAP32[((($446)+(8))>>2)];
   var $447=$block;
   var $448=(($447+20)|0);
   var $449=HEAPF32[(($448)>>2)];
   HEAPF32[((((240)|0))>>2)]=$449;
   var $450=$target;
   assert(12 % 1 === 0);HEAP32[((216)>>2)]=HEAP32[(($450)>>2)];HEAP32[((220)>>2)]=HEAP32[((($450)+(4))>>2)];HEAP32[((224)>>2)]=HEAP32[((($450)+(8))>>2)];
   var $451=$1;
   HEAPF32[((((244)|0))>>2)]=$451;
   var $452=$2;
   HEAPF32[((((248)|0))>>2)]=$452;
   var $453=$3;
   HEAPF32[((((252)|0))>>2)]=$453;
   var $454=HEAP8[(264)];
   HEAP8[(384)]=$454;
   var $455=HEAP8[(384)];
   var $456=_next_block_index($455);
   HEAP8[(264)]=$456;
   _planner_recalculate();
   label = 53; break;
  case 53: 
   STACKTOP = __stackBase__;
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _plan_cycle_reinitialize($step_events_remaining) {
 var label = 0;
 var $1;
 var $block;
 $1=$step_events_remaining;
 var $2=HEAP8[(376)];
 var $3=(($2)&(255));
 var $4=((392+($3<<6))|0);
 $block=$4;
 var $5=$block;
 var $6=(($5+32)|0);
 var $7=HEAPF32[(($6)>>2)];
 var $8=$1;
 var $9=(($8)|(0));
 var $10=($7)*($9);
 var $11=$block;
 var $12=(($11+16)|0);
 var $13=HEAP32[(($12)>>2)];
 var $14=(($13)|(0));
 var $15=($10)/($14);
 var $16=$block;
 var $17=(($16+32)|0);
 HEAPF32[(($17)>>2)]=$15;
 var $18=$1;
 var $19=$block;
 var $20=(($19+16)|0);
 HEAP32[(($20)>>2)]=$18;
 var $21=$block;
 var $22=(($21+24)|0);
 HEAPF32[(($22)>>2)]=0;
 var $23=$block;
 var $24=(($23+28)|0);
 HEAPF32[(($24)>>2)]=0;
 var $25=$block;
 var $26=(($25+40)|0);
 HEAP8[($26)]=1;
 _planner_recalculate();
 return;
}
function _planner_recalculate() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $entry_speed_sqr;
   var $block_index;
   var $current;
   var $next;
   var $1=HEAP8[(384)];
   var $2=_prev_block_index($1);
   $block_index=$2;
   var $3=$block_index;
   var $4=(($3)&(255));
   var $5=((392+($4<<6))|0);
   $current=$5;
   var $6=$block_index;
   var $7=(($6)&(255));
   var $8=HEAP8[(376)];
   var $9=(($8)&(255));
   var $10=(($7)|(0))!=(($9)|(0));
   if ($10) { label = 2; break; } else { label = 3; break; }
  case 2: 
   var $12=$block_index;
   var $13=_prev_block_index($12);
   $block_index=$13;
   label = 3; break;
  case 3: 
   label = 4; break;
  case 4: 
   var $16=$block_index;
   var $17=(($16)&(255));
   var $18=HEAP8[(376)];
   var $19=(($18)&(255));
   var $20=(($17)|(0))!=(($19)|(0));
   if ($20) { label = 5; break; } else { label = 12; break; }
  case 5: 
   var $22=$current;
   $next=$22;
   var $23=$block_index;
   var $24=(($23)&(255));
   var $25=((392+($24<<6))|0);
   $current=$25;
   var $26=$current;
   var $27=(($26+24)|0);
   var $28=HEAPF32[(($27)>>2)];
   var $29=$current;
   var $30=(($29+28)|0);
   var $31=HEAPF32[(($30)>>2)];
   var $32=$28 != $31;
   if ($32) { label = 6; break; } else { label = 11; break; }
  case 6: 
   var $34=$current;
   var $35=(($34+28)|0);
   var $36=HEAPF32[(($35)>>2)];
   var $37=$current;
   var $38=(($37+24)|0);
   HEAPF32[(($38)>>2)]=$36;
   var $39=$current;
   var $40=(($39+40)|0);
   HEAP8[($40)]=1;
   var $41=$next;
   var $42=(($41+24)|0);
   var $43=HEAPF32[(($42)>>2)];
   var $44=$current;
   var $45=(($44+28)|0);
   var $46=HEAPF32[(($45)>>2)];
   var $47=$43 < $46;
   if ($47) { label = 7; break; } else { label = 10; break; }
  case 7: 
   var $49=$next;
   var $50=(($49+24)|0);
   var $51=HEAPF32[(($50)>>2)];
   var $52=$current;
   var $53=(($52+36)|0);
   var $54=HEAPF32[(($53)>>2)];
   var $55=($54)*(2);
   var $56=$current;
   var $57=(($56+32)|0);
   var $58=HEAPF32[(($57)>>2)];
   var $59=($55)*($58);
   var $60=($51)+($59);
   $entry_speed_sqr=$60;
   var $61=$entry_speed_sqr;
   var $62=$current;
   var $63=(($62+28)|0);
   var $64=HEAPF32[(($63)>>2)];
   var $65=$61 < $64;
   if ($65) { label = 8; break; } else { label = 9; break; }
  case 8: 
   var $67=$entry_speed_sqr;
   var $68=$current;
   var $69=(($68+24)|0);
   HEAPF32[(($69)>>2)]=$67;
   label = 9; break;
  case 9: 
   label = 10; break;
  case 10: 
   label = 11; break;
  case 11: 
   var $73=$block_index;
   var $74=_prev_block_index($73);
   $block_index=$74;
   label = 4; break;
  case 12: 
   var $76=HEAP8[(376)];
   var $77=_next_block_index($76);
   $block_index=$77;
   var $78=HEAP8[(376)];
   var $79=(($78)&(255));
   var $80=((392+($79<<6))|0);
   $next=$80;
   label = 13; break;
  case 13: 
   var $82=$block_index;
   var $83=(($82)&(255));
   var $84=HEAP8[(384)];
   var $85=(($84)&(255));
   var $86=(($83)|(0))!=(($85)|(0));
   if ($86) { label = 14; break; } else { label = 22; break; }
  case 14: 
   var $88=$next;
   $current=$88;
   var $89=$block_index;
   var $90=(($89)&(255));
   var $91=((392+($90<<6))|0);
   $next=$91;
   var $92=$current;
   var $93=(($92+24)|0);
   var $94=HEAPF32[(($93)>>2)];
   var $95=$next;
   var $96=(($95+24)|0);
   var $97=HEAPF32[(($96)>>2)];
   var $98=$94 < $97;
   if ($98) { label = 15; break; } else { label = 18; break; }
  case 15: 
   var $100=$current;
   var $101=(($100+24)|0);
   var $102=HEAPF32[(($101)>>2)];
   var $103=$current;
   var $104=(($103+36)|0);
   var $105=HEAPF32[(($104)>>2)];
   var $106=($105)*(2);
   var $107=$current;
   var $108=(($107+32)|0);
   var $109=HEAPF32[(($108)>>2)];
   var $110=($106)*($109);
   var $111=($102)+($110);
   $entry_speed_sqr=$111;
   var $112=$entry_speed_sqr;
   var $113=$next;
   var $114=(($113+24)|0);
   var $115=HEAPF32[(($114)>>2)];
   var $116=$112 < $115;
   if ($116) { label = 16; break; } else { label = 17; break; }
  case 16: 
   var $118=$entry_speed_sqr;
   var $119=$next;
   var $120=(($119+24)|0);
   HEAPF32[(($120)>>2)]=$118;
   var $121=$next;
   var $122=(($121+40)|0);
   HEAP8[($122)]=1;
   label = 17; break;
  case 17: 
   label = 18; break;
  case 18: 
   var $125=$current;
   var $126=(($125+40)|0);
   var $127=HEAP8[($126)];
   var $128=(($127)&(255));
   var $129=(($128)|(0))!=0;
   if ($129) { label = 20; break; } else { label = 19; break; }
  case 19: 
   var $131=$next;
   var $132=(($131+40)|0);
   var $133=HEAP8[($132)];
   var $134=(($133)&(255));
   var $135=(($134)|(0))!=0;
   if ($135) { label = 20; break; } else { label = 21; break; }
  case 20: 
   var $137=$current;
   var $138=$current;
   var $139=(($138+24)|0);
   var $140=HEAPF32[(($139)>>2)];
   var $141=$next;
   var $142=(($141+24)|0);
   var $143=HEAPF32[(($142)>>2)];
   _calculate_trapezoid_for_block($137, $140, $143);
   var $144=$current;
   var $145=(($144+40)|0);
   HEAP8[($145)]=0;
   label = 21; break;
  case 21: 
   var $147=$block_index;
   var $148=_next_block_index($147);
   $block_index=$148;
   label = 13; break;
  case 22: 
   var $150=$next;
   var $151=$next;
   var $152=(($151+24)|0);
   var $153=HEAPF32[(($152)>>2)];
   _calculate_trapezoid_for_block($150, $153, 0);
   var $154=$next;
   var $155=(($154+40)|0);
   HEAP8[($155)]=0;
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _delay_ms($ms) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   $1=$ms;
   label = 2; break;
  case 2: 
   var $3=$1;
   var $4=((($3)-(1))&65535);
   $1=$4;
   var $5=(($3 << 16) >> 16)!=0;
   if ($5) { label = 3; break; } else { label = 4; break; }
  case 3: 
   label = 2; break;
  case 4: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _delay_us($us) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   $1=$us;
   label = 2; break;
  case 2: 
   var $3=$1;
   var $4=(($3)|(0))!=0;
   if ($4) { label = 3; break; } else { label = 13; break; }
  case 3: 
   var $6=$1;
   var $7=(($6)>>>(0)) < 10;
   if ($7) { label = 4; break; } else { label = 5; break; }
  case 4: 
   var $9=$1;
   var $10=((($9)-(1))|0);
   $1=$10;
   label = 12; break;
  case 5: 
   var $12=$1;
   var $13=(($12)>>>(0)) < 100;
   if ($13) { label = 6; break; } else { label = 7; break; }
  case 6: 
   var $15=$1;
   var $16=((($15)-(10))|0);
   $1=$16;
   label = 11; break;
  case 7: 
   var $18=$1;
   var $19=(($18)>>>(0)) < 1000;
   if ($19) { label = 8; break; } else { label = 9; break; }
  case 8: 
   var $21=$1;
   var $22=((($21)-(100))|0);
   $1=$22;
   label = 10; break;
  case 9: 
   var $24=$1;
   var $25=((($24)-(1000))|0);
   $1=$25;
   label = 10; break;
  case 10: 
   label = 11; break;
  case 11: 
   label = 12; break;
  case 12: 
   label = 2; break;
  case 13: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _limits_init() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1=HEAP8[(6392)];
   var $2=(($1)&(255));
   var $3=$2 & -15;
   var $4=(($3) & 255);
   HEAP8[(6392)]=$4;
   var $5=HEAP8[(6064)];
   var $6=(($5)&(255));
   var $7=$6 | 14;
   var $8=(($7) & 255);
   HEAP8[(6064)]=$8;
   var $9=HEAP8[((((144)|0))|0)];
   var $10=(($9)&(255));
   var $11=$10 & 8;
   var $12=(($11)|(0))!=0;
   if ($12) { label = 2; break; } else { label = 3; break; }
  case 2: 
   var $14=HEAP8[(6112)];
   var $15=(($14)&(255));
   var $16=$15 | 14;
   var $17=(($16) & 255);
   HEAP8[(6112)]=$17;
   var $18=HEAP8[(6128)];
   var $19=(($18)&(255));
   var $20=$19 | 1;
   var $21=(($20) & 255);
   HEAP8[(6128)]=$21;
   label = 4; break;
  case 3: 
   var $23=HEAP8[(6112)];
   var $24=(($23)&(255));
   var $25=$24 & -15;
   var $26=(($25) & 255);
   HEAP8[(6112)]=$26;
   var $27=HEAP8[(6128)];
   var $28=(($27)&(255));
   var $29=$28 & -2;
   var $30=(($29) & 255);
   HEAP8[(6128)]=$30;
   label = 4; break;
  case 4: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _read_float($line, $char_counter, $float_ptr) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2;
   var $3;
   var $4;
   var $ptr;
   var $c;
   var $isnegative;
   var $intval;
   var $exp;
   var $ndigit;
   var $isdecimal;
   var $fval;
   $2=$line;
   $3=$char_counter;
   $4=$float_ptr;
   var $5=$2;
   var $6=$3;
   var $7=HEAP8[($6)];
   var $8=(($7)&(255));
   var $9=(($5+$8)|0);
   $ptr=$9;
   var $10=$ptr;
   var $11=(($10+1)|0);
   $ptr=$11;
   var $12=HEAP8[($10)];
   $c=$12;
   $isnegative=0;
   var $13=$c;
   var $14=(($13)&(255));
   var $15=(($14)|(0))==45;
   if ($15) { label = 2; break; } else { label = 3; break; }
  case 2: 
   $isnegative=1;
   var $17=$ptr;
   var $18=(($17+1)|0);
   $ptr=$18;
   var $19=HEAP8[($17)];
   $c=$19;
   label = 6; break;
  case 3: 
   var $21=$c;
   var $22=(($21)&(255));
   var $23=(($22)|(0))==43;
   if ($23) { label = 4; break; } else { label = 5; break; }
  case 4: 
   var $25=$ptr;
   var $26=(($25+1)|0);
   $ptr=$26;
   var $27=HEAP8[($25)];
   $c=$27;
   label = 5; break;
  case 5: 
   label = 6; break;
  case 6: 
   $intval=0;
   $exp=0;
   $ndigit=0;
   $isdecimal=0;
   label = 7; break;
  case 7: 
   var $31=$c;
   var $32=(($31)&(255));
   var $33=((($32)-(48))|0);
   var $34=(($33) & 255);
   $c=$34;
   var $35=$c;
   var $36=(($35)&(255));
   var $37=(($36)|(0)) <= 9;
   if ($37) { label = 8; break; } else { label = 16; break; }
  case 8: 
   var $39=$ndigit;
   var $40=((($39)+(1))&255);
   $ndigit=$40;
   var $41=$ndigit;
   var $42=(($41)&(255));
   var $43=(($42)|(0)) <= 8;
   if ($43) { label = 9; break; } else { label = 12; break; }
  case 9: 
   var $45=$isdecimal;
   var $46=(($45) & 1);
   if ($46) { label = 10; break; } else { label = 11; break; }
  case 10: 
   var $48=$exp;
   var $49=((($48)-(1))&255);
   $exp=$49;
   label = 11; break;
  case 11: 
   var $51=$intval;
   var $52=$51 << 2;
   var $53=$intval;
   var $54=((($52)+($53))|0);
   var $55=$54 << 1;
   var $56=$c;
   var $57=(($56)&(255));
   var $58=((($55)+($57))|0);
   $intval=$58;
   label = 15; break;
  case 12: 
   var $60=$isdecimal;
   var $61=(($60) & 1);
   if ($61) { label = 14; break; } else { label = 13; break; }
  case 13: 
   var $63=$exp;
   var $64=((($63)+(1))&255);
   $exp=$64;
   label = 14; break;
  case 14: 
   label = 15; break;
  case 15: 
   label = 21; break;
  case 16: 
   var $68=$c;
   var $69=(($68)&(255));
   var $70=(($69)|(0))==254;
   if ($70) { label = 17; break; } else { label = 19; break; }
  case 17: 
   var $72=$isdecimal;
   var $73=(($72) & 1);
   if ($73) { label = 19; break; } else { label = 18; break; }
  case 18: 
   $isdecimal=1;
   label = 20; break;
  case 19: 
   label = 22; break;
  case 20: 
   label = 21; break;
  case 21: 
   var $78=$ptr;
   var $79=(($78+1)|0);
   $ptr=$79;
   var $80=HEAP8[($78)];
   $c=$80;
   label = 7; break;
  case 22: 
   var $82=$ndigit;
   var $83=(($82 << 24) >> 24)!=0;
   if ($83) { label = 24; break; } else { label = 23; break; }
  case 23: 
   $1=0;
   label = 41; break;
  case 24: 
   var $86=$intval;
   var $87=(($86)>>>(0));
   $fval=$87;
   var $88=$fval;
   var $89=$88 != 0;
   if ($89) { label = 25; break; } else { label = 37; break; }
  case 25: 
   label = 26; break;
  case 26: 
   var $92=$exp;
   var $93=(($92 << 24) >> 24);
   var $94=(($93)|(0)) <= -2;
   if ($94) { label = 27; break; } else { label = 28; break; }
  case 27: 
   var $96=$fval;
   var $97=$96;
   var $98=($97)*(0.01);
   var $99=$98;
   $fval=$99;
   var $100=$exp;
   var $101=(($100 << 24) >> 24);
   var $102=((($101)+(2))|0);
   var $103=(($102) & 255);
   $exp=$103;
   label = 26; break;
  case 28: 
   var $105=$exp;
   var $106=(($105 << 24) >> 24);
   var $107=(($106)|(0)) < 0;
   if ($107) { label = 29; break; } else { label = 30; break; }
  case 29: 
   var $109=$fval;
   var $110=$109;
   var $111=($110)*(0.1);
   var $112=$111;
   $fval=$112;
   label = 36; break;
  case 30: 
   var $114=$exp;
   var $115=(($114 << 24) >> 24);
   var $116=(($115)|(0)) > 0;
   if ($116) { label = 31; break; } else { label = 35; break; }
  case 31: 
   label = 32; break;
  case 32: 
   var $119=$fval;
   var $120=$119;
   var $121=($120)*(10);
   var $122=$121;
   $fval=$122;
   label = 33; break;
  case 33: 
   var $124=$exp;
   var $125=((($124)-(1))&255);
   $exp=$125;
   var $126=(($125 << 24) >> 24);
   var $127=(($126)|(0)) > 0;
   if ($127) { label = 32; break; } else { label = 34; break; }
  case 34: 
   label = 35; break;
  case 35: 
   label = 36; break;
  case 36: 
   label = 37; break;
  case 37: 
   var $132=$isnegative;
   var $133=(($132) & 1);
   if ($133) { label = 38; break; } else { label = 39; break; }
  case 38: 
   var $135=$fval;
   var $136=(-$135);
   var $137=$4;
   HEAPF32[(($137)>>2)]=$136;
   label = 40; break;
  case 39: 
   var $139=$fval;
   var $140=$4;
   HEAPF32[(($140)>>2)]=$139;
   label = 40; break;
  case 40: 
   var $142=$ptr;
   var $143=$2;
   var $144=$142;
   var $145=$143;
   var $146=((($144)-($145))|0);
   var $147=((($146)-(1))|0);
   var $148=(($147) & 255);
   var $149=$3;
   HEAP8[($149)]=$148;
   $1=1;
   label = 41; break;
  case 41: 
   var $151=$1;
   return $151;
  default: assert(0, "bad label: " + label);
 }
}
function _calculate_trapezoid_for_block($block, $entry_speed_sqr, $exit_speed_sqr) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2;
   var $3;
   var $steps_per_mm_div_2_acc;
   var $intersect_distance;
   $1=$block;
   $2=$entry_speed_sqr;
   $3=$exit_speed_sqr;
   var $4=$2;
   var $5=$4;
   var $6=Math.sqrt($5);
   var $7=($6)*(666.6666666666666);
   var $8=Math.ceil($7);
   var $9=($8>=0 ? Math.floor($8) : Math.ceil($8));
   var $10=$1;
   var $11=(($10+44)|0);
   HEAP32[(($11)>>2)]=$9;
   var $12=$1;
   var $13=(($12+16)|0);
   var $14=HEAP32[(($13)>>2)];
   var $15=(($14)|(0));
   var $16=$1;
   var $17=(($16+36)|0);
   var $18=HEAPF32[(($17)>>2)];
   var $19=($18)*(2);
   var $20=$1;
   var $21=(($20+32)|0);
   var $22=HEAPF32[(($21)>>2)];
   var $23=($19)*($22);
   var $24=($15)/($23);
   $steps_per_mm_div_2_acc=$24;
   var $25=$1;
   var $26=(($25+16)|0);
   var $27=HEAP32[(($26)>>2)];
   var $28=(($27)|(0));
   var $29=$steps_per_mm_div_2_acc;
   var $30=$2;
   var $31=$3;
   var $32=($30)-($31);
   var $33=($29)*($32);
   var $34=($28)+($33);
   var $35=$34;
   var $36=($35)*(0.5);
   var $37=Math.ceil($36);
   var $38=(($37)&-1);
   $intersect_distance=$38;
   var $39=$intersect_distance;
   var $40=(($39)|(0)) <= 0;
   if ($40) { label = 2; break; } else { label = 3; break; }
  case 2: 
   var $42=$1;
   var $43=(($42+52)|0);
   HEAP32[(($43)>>2)]=0;
   label = 8; break;
  case 3: 
   var $45=$steps_per_mm_div_2_acc;
   var $46=$1;
   var $47=(($46+20)|0);
   var $48=HEAPF32[(($47)>>2)];
   var $49=$3;
   var $50=($48)-($49);
   var $51=($45)*($50);
   var $52=$51;
   var $53=Math.ceil($52);
   var $54=($53>=0 ? Math.floor($53) : Math.ceil($53));
   var $55=$1;
   var $56=(($55+52)|0);
   HEAP32[(($56)>>2)]=$54;
   var $57=$1;
   var $58=(($57+52)|0);
   var $59=HEAP32[(($58)>>2)];
   var $60=$intersect_distance;
   var $61=(($59)>>>(0)) > (($60)>>>(0));
   if ($61) { label = 4; break; } else { label = 5; break; }
  case 4: 
   var $63=$intersect_distance;
   var $64=$1;
   var $65=(($64+52)|0);
   HEAP32[(($65)>>2)]=$63;
   label = 5; break;
  case 5: 
   var $67=$1;
   var $68=(($67+52)|0);
   var $69=HEAP32[(($68)>>2)];
   var $70=$1;
   var $71=(($70+16)|0);
   var $72=HEAP32[(($71)>>2)];
   var $73=(($69)>>>(0)) > (($72)>>>(0));
   if ($73) { label = 6; break; } else { label = 7; break; }
  case 6: 
   var $75=$1;
   var $76=(($75+16)|0);
   var $77=HEAP32[(($76)>>2)];
   var $78=$1;
   var $79=(($78+52)|0);
   HEAP32[(($79)>>2)]=$77;
   label = 7; break;
  case 7: 
   label = 8; break;
  case 8: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _sys_sync_current_position() {
 var label = 0;
 var $1=HEAP32[((((36)|0))>>2)];
 var $2=HEAP32[((((40)|0))>>2)];
 var $3=HEAP32[((((44)|0))>>2)];
 _plan_set_current_position($1, $2, $3);
 var $4=HEAP32[((((36)|0))>>2)];
 var $5=HEAP32[((((40)|0))>>2)];
 var $6=HEAP32[((((44)|0))>>2)];
 _gc_set_current_position($4, $5, $6);
 return;
}
function _isr_LIMIT_INT_vect() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1=HEAP8[((((33)|0))|0)];
   var $2=(($1)&(255));
   var $3=(($2)|(0))!=6;
   if ($3) { label = 2; break; } else { label = 5; break; }
  case 2: 
   var $5=HEAP8[((((34)|0))|0)];
   var $6=(($5)&(255));
   var $7=$6 & 32;
   var $8=(($7)|(0))==0;
   if ($8) { label = 3; break; } else { label = 4; break; }
  case 3: 
   _mc_reset();
   var $10=HEAP8[((((34)|0))|0)];
   var $11=(($10)&(255));
   var $12=$11 | 64;
   var $13=(($12) & 255);
   HEAP8[((((34)|0))|0)]=$13;
   label = 4; break;
  case 4: 
   label = 5; break;
  case 5: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _limits_go_home() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $n_cycle;
   _st_wake_up();
   var $1=HEAPF32[((((152)|0))>>2)];
   _homing_cycle(4, 1, 0, $1);
   var $2=HEAPF32[((((152)|0))>>2)];
   _homing_cycle(3, 1, 0, $2);
   var $3=HEAP16[((((156)|0))>>1)];
   _delay_ms($3);
   $n_cycle=2;
   label = 2; break;
  case 2: 
   var $5=$n_cycle;
   var $6=((($5)-(1))&255);
   $n_cycle=$6;
   var $7=(($5 << 24) >> 24)!=0;
   if ($7) { label = 3; break; } else { label = 6; break; }
  case 3: 
   var $9=HEAPF32[((((148)|0))>>2)];
   _homing_cycle(7, 0, 1, $9);
   var $10=HEAP16[((((156)|0))>>1)];
   _delay_ms($10);
   var $11=$n_cycle;
   var $12=(($11 << 24) >> 24);
   var $13=(($12)|(0)) > 0;
   if ($13) { label = 4; break; } else { label = 5; break; }
  case 4: 
   var $15=HEAPF32[((((148)|0))>>2)];
   _homing_cycle(7, 1, 0, $15);
   var $16=HEAP16[((((156)|0))>>1)];
   _delay_ms($16);
   label = 5; break;
  case 5: 
   label = 2; break;
  case 6: 
   _st_go_idle();
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _homing_cycle($cycle_mask, $pos_dir, $invert_pin, $homing_rate) {
 var label = 0;
 var __stackBase__  = STACKTOP; STACKTOP = (STACKTOP + 16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $2;
   var $3;
   var $4;
   var $step_event_count;
   var $steps=__stackBase__;
   var $i;
   var $dist;
   var $ds;
   var $delta_rate;
   var $dt_min;
   var $dt;
   var $out_bits0;
   var $counter_x;
   var $counter_y;
   var $counter_z;
   var $step_delay;
   var $step_rate;
   var $trap_counter;
   var $out_bits;
   var $limit_state;
   $1=$cycle_mask;
   $2=$pos_dir;
   var $5=(($invert_pin)&(1));
   $3=$5;
   $4=$homing_rate;
   $dist=0;
   var $6=$steps;
   HEAP32[(($6)>>2)]=0; HEAP32[((($6)+(4))>>2)]=0; HEAP32[((($6)+(8))>>2)]=0;
   $i=0;
   label = 2; break;
  case 2: 
   var $8=$i;
   var $9=(($8)&(255));
   var $10=(($9)|(0)) < 3;
   if ($10) { label = 3; break; } else { label = 7; break; }
  case 3: 
   var $12=$1;
   var $13=(($12)&(255));
   var $14=$i;
   var $15=(($14)&(255));
   var $16=1 << $15;
   var $17=$13 & $16;
   var $18=(($17)|(0))!=0;
   if ($18) { label = 4; break; } else { label = 5; break; }
  case 4: 
   var $20=$dist;
   var $21=((($20)+(1))&255);
   $dist=$21;
   var $22=$i;
   var $23=(($22)&(255));
   var $24=((((96)|0)+($23<<2))|0);
   var $25=HEAPF32[(($24)>>2)];
   var $26=$25;
   var $27=_round($26);
   var $28=$i;
   var $29=(($28)&(255));
   var $30=(($steps+($29<<2))|0);
   HEAP32[(($30)>>2)]=$27;
   label = 5; break;
  case 5: 
   label = 6; break;
  case 6: 
   var $33=$i;
   var $34=((($33)+(1))&255);
   $i=$34;
   label = 2; break;
  case 7: 
   var $36=(($steps)|0);
   var $37=HEAP32[(($36)>>2)];
   var $38=(($steps+4)|0);
   var $39=HEAP32[(($38)>>2)];
   var $40=(($steps+8)|0);
   var $41=HEAP32[(($40)>>2)];
   var $42=(($39)>>>(0)) > (($41)>>>(0));
   if ($42) { label = 8; break; } else { label = 9; break; }
  case 8: 
   var $44=(($steps+4)|0);
   var $45=HEAP32[(($44)>>2)];
   var $50 = $45;label = 10; break;
  case 9: 
   var $47=(($steps+8)|0);
   var $48=HEAP32[(($47)>>2)];
   var $50 = $48;label = 10; break;
  case 10: 
   var $50;
   var $51=(($37)>>>(0)) > (($50)>>>(0));
   if ($51) { label = 11; break; } else { label = 12; break; }
  case 11: 
   var $53=(($steps)|0);
   var $54=HEAP32[(($53)>>2)];
   var $70 = $54;label = 16; break;
  case 12: 
   var $56=(($steps+4)|0);
   var $57=HEAP32[(($56)>>2)];
   var $58=(($steps+8)|0);
   var $59=HEAP32[(($58)>>2)];
   var $60=(($57)>>>(0)) > (($59)>>>(0));
   if ($60) { label = 13; break; } else { label = 14; break; }
  case 13: 
   var $62=(($steps+4)|0);
   var $63=HEAP32[(($62)>>2)];
   var $68 = $63;label = 15; break;
  case 14: 
   var $65=(($steps+8)|0);
   var $66=HEAP32[(($65)>>2)];
   var $68 = $66;label = 15; break;
  case 15: 
   var $68;
   var $70 = $68;label = 16; break;
  case 16: 
   var $70;
   $step_event_count=$70;
   var $71=$step_event_count;
   var $72=(($71)>>>(0));
   var $73=$dist;
   var $74=(($73)&(255));
   var $75=Math.sqrt($74);
   var $76=($72)/($75);
   var $77=$76;
   $ds=$77;
   var $78=$ds;
   var $79=HEAPF32[((((128)|0))>>2)];
   var $80=($78)*($79);
   var $81=($80)/(7200);
   var $82=$81;
   var $83=Math.ceil($82);
   var $84=($83>=0 ? Math.floor($83) : Math.ceil($83));
   $delta_rate=$84;
   var $85=$dist;
   var $86=(($85)&(255));
   var $87=Math.sqrt($86);
   var $88=$4;
   var $89=$88;
   var $90=($89)*($87);
   var $91=$90;
   $4=$91;
   var $92=$ds;
   var $93=$4;
   var $94=($92)*($93);
   var $95=(60000000)/($94);
   var $96=$95;
   var $97=_round($96);
   $dt_min=$97;
   $dt=75000;
   var $98=$dt;
   var $99=$dt_min;
   var $100=(($98)>>>(0)) > (($99)>>>(0));
   if ($100) { label = 17; break; } else { label = 18; break; }
  case 17: 
   var $102=$dt_min;
   $dt=$102;
   label = 18; break;
  case 18: 
   var $104=HEAP8[((((120)|0))|0)];
   $out_bits0=$104;
   var $105=HEAP8[((((145)|0))|0)];
   var $106=(($105)&(255));
   var $107=$106 & 224;
   var $108=$out_bits0;
   var $109=(($108)&(255));
   var $110=$109 ^ $107;
   var $111=(($110) & 255);
   $out_bits0=$111;
   var $112=$2;
   var $113=(($112 << 24) >> 24)!=0;
   if ($113) { label = 20; break; } else { label = 19; break; }
  case 19: 
   var $115=$out_bits0;
   var $116=(($115)&(255));
   var $117=$116 ^ 224;
   var $118=(($117) & 255);
   $out_bits0=$118;
   label = 20; break;
  case 20: 
   var $120=$step_event_count;
   var $121=$120 >>> 1;
   var $122=(((-$121))|0);
   $counter_x=$122;
   var $123=$counter_x;
   $counter_y=$123;
   var $124=$counter_x;
   $counter_z=$124;
   var $125=$dt;
   var $126=HEAP8[((((109)|0))|0)];
   var $127=(($126)&(255));
   var $128=((($125)-($127))|0);
   $step_delay=$128;
   $step_rate=0;
   $trap_counter=4166;
   label = 21; break;
  case 21: 
   var $130=$out_bits0;
   $out_bits=$130;
   var $131=HEAP8[(6088)];
   $limit_state=$131;
   var $132=$3;
   var $133=(($132) & 1);
   if ($133) { label = 22; break; } else { label = 23; break; }
  case 22: 
   var $135=$limit_state;
   var $136=(($135)&(255));
   var $137=$136 ^ 14;
   var $138=(($137) & 255);
   $limit_state=$138;
   label = 23; break;
  case 23: 
   var $140=$1;
   var $141=(($140)&(255));
   var $142=$141 & 1;
   var $143=(($142)|(0))!=0;
   if ($143) { label = 24; break; } else { label = 30; break; }
  case 24: 
   var $145=(($steps)|0);
   var $146=HEAP32[(($145)>>2)];
   var $147=$counter_x;
   var $148=((($147)+($146))|0);
   $counter_x=$148;
   var $149=$counter_x;
   var $150=(($149)|(0)) > 0;
   if ($150) { label = 25; break; } else { label = 29; break; }
  case 25: 
   var $152=$limit_state;
   var $153=(($152)&(255));
   var $154=$153 & 2;
   var $155=(($154)|(0))!=0;
   if ($155) { label = 26; break; } else { label = 27; break; }
  case 26: 
   var $157=$out_bits;
   var $158=(($157)&(255));
   var $159=$158 ^ 4;
   var $160=(($159) & 255);
   $out_bits=$160;
   label = 28; break;
  case 27: 
   var $162=$1;
   var $163=(($162)&(255));
   var $164=$163 & -2;
   var $165=(($164) & 255);
   $1=$165;
   label = 28; break;
  case 28: 
   var $167=$step_event_count;
   var $168=$counter_x;
   var $169=((($168)-($167))|0);
   $counter_x=$169;
   label = 29; break;
  case 29: 
   label = 30; break;
  case 30: 
   var $172=$1;
   var $173=(($172)&(255));
   var $174=$173 & 2;
   var $175=(($174)|(0))!=0;
   if ($175) { label = 31; break; } else { label = 37; break; }
  case 31: 
   var $177=(($steps+4)|0);
   var $178=HEAP32[(($177)>>2)];
   var $179=$counter_y;
   var $180=((($179)+($178))|0);
   $counter_y=$180;
   var $181=$counter_y;
   var $182=(($181)|(0)) > 0;
   if ($182) { label = 32; break; } else { label = 36; break; }
  case 32: 
   var $184=$limit_state;
   var $185=(($184)&(255));
   var $186=$185 & 4;
   var $187=(($186)|(0))!=0;
   if ($187) { label = 33; break; } else { label = 34; break; }
  case 33: 
   var $189=$out_bits;
   var $190=(($189)&(255));
   var $191=$190 ^ 8;
   var $192=(($191) & 255);
   $out_bits=$192;
   label = 35; break;
  case 34: 
   var $194=$1;
   var $195=(($194)&(255));
   var $196=$195 & -3;
   var $197=(($196) & 255);
   $1=$197;
   label = 35; break;
  case 35: 
   var $199=$step_event_count;
   var $200=$counter_y;
   var $201=((($200)-($199))|0);
   $counter_y=$201;
   label = 36; break;
  case 36: 
   label = 37; break;
  case 37: 
   var $204=$1;
   var $205=(($204)&(255));
   var $206=$205 & 4;
   var $207=(($206)|(0))!=0;
   if ($207) { label = 38; break; } else { label = 44; break; }
  case 38: 
   var $209=(($steps+8)|0);
   var $210=HEAP32[(($209)>>2)];
   var $211=$counter_z;
   var $212=((($211)+($210))|0);
   $counter_z=$212;
   var $213=$counter_z;
   var $214=(($213)|(0)) > 0;
   if ($214) { label = 39; break; } else { label = 43; break; }
  case 39: 
   var $216=$limit_state;
   var $217=(($216)&(255));
   var $218=$217 & 8;
   var $219=(($218)|(0))!=0;
   if ($219) { label = 40; break; } else { label = 41; break; }
  case 40: 
   var $221=$out_bits;
   var $222=(($221)&(255));
   var $223=$222 ^ 16;
   var $224=(($223) & 255);
   $out_bits=$224;
   label = 42; break;
  case 41: 
   var $226=$1;
   var $227=(($226)&(255));
   var $228=$227 & -5;
   var $229=(($228) & 255);
   $1=$229;
   label = 42; break;
  case 42: 
   var $231=$step_event_count;
   var $232=$counter_z;
   var $233=((($232)-($231))|0);
   $counter_z=$233;
   label = 43; break;
  case 43: 
   label = 44; break;
  case 44: 
   var $236=$1;
   var $237=(($236 << 24) >> 24)!=0;
   if ($237) { label = 45; break; } else { label = 46; break; }
  case 45: 
   var $239=HEAP8[((((34)|0))|0)];
   var $240=(($239)&(255));
   var $241=$240 & 16;
   var $242=(($241)|(0))!=0;
   if ($242) { label = 46; break; } else { label = 47; break; }
  case 46: 
   STACKTOP = __stackBase__;
   return;
  case 47: 
   var $245=HEAP8[(6048)];
   var $246=(($245)&(255));
   var $247=$246 & -29;
   var $248=$out_bits;
   var $249=(($248)&(255));
   var $250=$249 & 28;
   var $251=$247 | $250;
   var $252=(($251) & 255);
   HEAP8[(6048)]=$252;
   var $253=HEAP8[((((109)|0))|0)];
   var $254=(($253)&(255));
   _delay_us($254);
   var $255=$out_bits0;
   HEAP8[(6048)]=$255;
   var $256=$step_delay;
   _delay_us($256);
   var $257=$dt;
   var $258=$dt_min;
   var $259=(($257)>>>(0)) > (($258)>>>(0));
   if ($259) { label = 48; break; } else { label = 53; break; }
  case 48: 
   var $261=$dt;
   var $262=$trap_counter;
   var $263=((($262)+($261))|0);
   $trap_counter=$263;
   var $264=$trap_counter;
   var $265=(($264)>>>(0)) > 8333;
   if ($265) { label = 49; break; } else { label = 52; break; }
  case 49: 
   var $267=$trap_counter;
   var $268=((($267)-(8333))|0);
   $trap_counter=$268;
   var $269=$delta_rate;
   var $270=$step_rate;
   var $271=((($270)+($269))|0);
   $step_rate=$271;
   var $272=$step_rate;
   var $273=Math.floor((60000000)/((($272)>>>(0))));
   $dt=$273;
   var $274=$dt;
   var $275=$dt_min;
   var $276=(($274)>>>(0)) < (($275)>>>(0));
   if ($276) { label = 50; break; } else { label = 51; break; }
  case 50: 
   var $278=$dt_min;
   $dt=$278;
   label = 51; break;
  case 51: 
   var $280=$dt;
   var $281=HEAP8[((((109)|0))|0)];
   var $282=(($281)&(255));
   var $283=((($280)-($282))|0);
   $step_delay=$283;
   label = 52; break;
  case 52: 
   label = 53; break;
  case 53: 
   label = 21; break;
  default: assert(0, "bad label: " + label);
 }
}
function _limits_soft_check($target) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   $1=$target;
   var $2=$1;
   var $3=(($2)|0);
   var $4=HEAPF32[(($3)>>2)];
   var $5=$4 > 0;
   if ($5) { label = 7; break; } else { label = 2; break; }
  case 2: 
   var $7=$1;
   var $8=(($7)|0);
   var $9=HEAPF32[(($8)>>2)];
   var $10=HEAPF32[((((180)|0))>>2)];
   var $11=(-$10);
   var $12=$9 < $11;
   if ($12) { label = 7; break; } else { label = 3; break; }
  case 3: 
   var $14=$1;
   var $15=(($14+4)|0);
   var $16=HEAPF32[(($15)>>2)];
   var $17=$16 > 0;
   if ($17) { label = 7; break; } else { label = 4; break; }
  case 4: 
   var $19=$1;
   var $20=(($19+4)|0);
   var $21=HEAPF32[(($20)>>2)];
   var $22=HEAPF32[((((184)|0))>>2)];
   var $23=(-$22);
   var $24=$21 < $23;
   if ($24) { label = 7; break; } else { label = 5; break; }
  case 5: 
   var $26=$1;
   var $27=(($26+8)|0);
   var $28=HEAPF32[(($27)>>2)];
   var $29=$28 > 0;
   if ($29) { label = 7; break; } else { label = 6; break; }
  case 6: 
   var $31=$1;
   var $32=(($31+8)|0);
   var $33=HEAPF32[(($32)>>2)];
   var $34=HEAPF32[((((188)|0))>>2)];
   var $35=(-$34);
   var $36=$33 < $35;
   if ($36) { label = 7; break; } else { label = 15; break; }
  case 7: 
   var $38=HEAP8[((((33)|0))|0)];
   var $39=(($38)&(255));
   var $40=(($39)|(0))==3;
   if ($40) { label = 8; break; } else { label = 14; break; }
  case 8: 
   _st_feed_hold();
   label = 9; break;
  case 9: 
   var $43=HEAP8[((((33)|0))|0)];
   var $44=(($43)&(255));
   var $45=(($44)|(0))==4;
   if ($45) { label = 10; break; } else { label = 13; break; }
  case 10: 
   _protocol_execute_runtime();
   var $47=HEAP8[((((32)|0))|0)];
   var $48=(($47 << 24) >> 24)!=0;
   if ($48) { label = 11; break; } else { label = 12; break; }
  case 11: 
   label = 15; break;
  case 12: 
   label = 9; break;
  case 13: 
   label = 14; break;
  case 14: 
   _mc_reset();
   var $53=HEAP8[((((34)|0))|0)];
   var $54=(($53)&(255));
   var $55=$54 | 64;
   var $56=(($55) & 255);
   HEAP8[((((34)|0))|0)]=$56;
   _protocol_execute_runtime();
   label = 15; break;
  case 15: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _printString($s) {
 var label = 0;
 var $1;
 $1=$s;
 var $2=$1;
 _console_string($2);
 return;
}
function _printPgmString($s) {
 var label = 0;
 var $1;
 $1=$s;
 var $2=$1;
 _console_string($2);
 return;
}
function _print_uint8_base2($n) {
 var label = 0;
 var __stackBase__  = STACKTOP; STACKTOP = (STACKTOP + 8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $buf=__stackBase__;
   var $i;
   $1=$n;
   $i=0;
   label = 2; break;
  case 2: 
   var $3=$i;
   var $4=(($3)&(255));
   var $5=(($4)|(0)) < 8;
   if ($5) { label = 3; break; } else { label = 5; break; }
  case 3: 
   var $7=$1;
   var $8=(($7)&(255));
   var $9=$8 & 1;
   var $10=(($9) & 255);
   var $11=$i;
   var $12=(($11)&(255));
   var $13=(($buf+$12)|0);
   HEAP8[($13)]=$10;
   var $14=$1;
   var $15=(($14)&(255));
   var $16=$15 >> 1;
   var $17=(($16) & 255);
   $1=$17;
   label = 4; break;
  case 4: 
   var $19=$i;
   var $20=((($19)+(1))&255);
   $i=$20;
   label = 2; break;
  case 5: 
   label = 6; break;
  case 6: 
   var $23=$i;
   var $24=(($23)&(255));
   var $25=(($24)|(0)) > 0;
   if ($25) { label = 7; break; } else { label = 9; break; }
  case 7: 
   var $27=$i;
   var $28=(($27)&(255));
   var $29=((($28)-(1))|0);
   var $30=(($buf+$29)|0);
   var $31=HEAP8[($30)];
   var $32=(($31)&(255));
   var $33=((($32)+(48))|0);
   var $34=(($33) & 255);
   _console_char($34);
   label = 8; break;
  case 8: 
   var $36=$i;
   var $37=((($36)-(1))&255);
   $i=$37;
   label = 6; break;
  case 9: 
   STACKTOP = __stackBase__;
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _printInteger($n) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   $1=$n;
   var $2=$1;
   var $3=(($2)|(0)) < 0;
   if ($3) { label = 2; break; } else { label = 3; break; }
  case 2: 
   _console_char(45);
   var $5=$1;
   var $6=(((-$5))|0);
   $1=$6;
   label = 3; break;
  case 3: 
   var $8=$1;
   _print_uint32_base10($8);
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _print_uint32_base10($n) {
 var label = 0;
 var __stackBase__  = STACKTOP; STACKTOP = (STACKTOP + 16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $buf=__stackBase__;
   var $i;
   $1=$n;
   $i=0;
   var $2=$1;
   var $3=(($2)|(0))==0;
   if ($3) { label = 2; break; } else { label = 3; break; }
  case 2: 
   _console_char(48);
   label = 10; break;
  case 3: 
   label = 4; break;
  case 4: 
   var $7=$1;
   var $8=(($7)>>>(0)) > 0;
   if ($8) { label = 5; break; } else { label = 6; break; }
  case 5: 
   var $10=$1;
   var $11=Math.floor(((($10)>>>(0)))%(10));
   var $12=((($11)+(48))|0);
   var $13=(($12) & 255);
   var $14=$i;
   var $15=((($14)+(1))&255);
   $i=$15;
   var $16=(($14)&(255));
   var $17=(($buf+$16)|0);
   HEAP8[($17)]=$13;
   var $18=$1;
   var $19=Math.floor(((($18)>>>(0)))/(10));
   $1=$19;
   label = 4; break;
  case 6: 
   label = 7; break;
  case 7: 
   var $22=$i;
   var $23=(($22)&(255));
   var $24=(($23)|(0)) > 0;
   if ($24) { label = 8; break; } else { label = 10; break; }
  case 8: 
   var $26=$i;
   var $27=(($26)&(255));
   var $28=((($27)-(1))|0);
   var $29=(($buf+$28)|0);
   var $30=HEAP8[($29)];
   _console_char($30);
   label = 9; break;
  case 9: 
   var $32=$i;
   var $33=((($32)-(1))&255);
   $i=$33;
   label = 7; break;
  case 10: 
   STACKTOP = __stackBase__;
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _printFloat($n) {
 var label = 0;
 var __stackBase__  = STACKTOP; STACKTOP = (STACKTOP + 16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   var $decimals;
   var $buf=__stackBase__;
   var $i;
   var $a;
   $1=$n;
   var $2=$1;
   var $3=$2 < 0;
   if ($3) { label = 2; break; } else { label = 3; break; }
  case 2: 
   _console_char(45);
   var $5=$1;
   var $6=(-$5);
   $1=$6;
   label = 3; break;
  case 3: 
   var $8=HEAP8[((((165)|0))|0)];
   $decimals=$8;
   label = 4; break;
  case 4: 
   var $10=$decimals;
   var $11=(($10)&(255));
   var $12=(($11)|(0)) >= 2;
   if ($12) { label = 5; break; } else { label = 6; break; }
  case 5: 
   var $14=$1;
   var $15=($14)*(100);
   $1=$15;
   var $16=$decimals;
   var $17=(($16)&(255));
   var $18=((($17)-(2))|0);
   var $19=(($18) & 255);
   $decimals=$19;
   label = 4; break;
  case 6: 
   var $21=$decimals;
   var $22=(($21 << 24) >> 24)!=0;
   if ($22) { label = 7; break; } else { label = 8; break; }
  case 7: 
   var $24=$1;
   var $25=($24)*(10);
   $1=$25;
   label = 8; break;
  case 8: 
   var $27=$1;
   var $28=$27;
   var $29=($28)+(0.5);
   var $30=$29;
   $1=$30;
   $i=0;
   var $31=$1;
   var $32=(($31)&-1);
   $a=$32;
   var $33=HEAP8[((((165)|0))|0)];
   var $34=(($33)&(255));
   var $35=(($buf+$34)|0);
   HEAP8[($35)]=46;
   label = 9; break;
  case 9: 
   var $37=$a;
   var $38=(($37)>>>(0)) > 0;
   if ($38) { label = 10; break; } else { label = 13; break; }
  case 10: 
   var $40=$i;
   var $41=(($40)&(255));
   var $42=HEAP8[((((165)|0))|0)];
   var $43=(($42)&(255));
   var $44=(($41)|(0))==(($43)|(0));
   if ($44) { label = 11; break; } else { label = 12; break; }
  case 11: 
   var $46=$i;
   var $47=((($46)+(1))&255);
   $i=$47;
   label = 12; break;
  case 12: 
   var $49=$a;
   var $50=Math.floor(((($49)>>>(0)))%(10));
   var $51=((($50)+(48))|0);
   var $52=(($51) & 255);
   var $53=$i;
   var $54=((($53)+(1))&255);
   $i=$54;
   var $55=(($53)&(255));
   var $56=(($buf+$55)|0);
   HEAP8[($56)]=$52;
   var $57=$a;
   var $58=Math.floor(((($57)>>>(0)))/(10));
   $a=$58;
   label = 9; break;
  case 13: 
   label = 14; break;
  case 14: 
   var $61=$i;
   var $62=(($61)&(255));
   var $63=HEAP8[((((165)|0))|0)];
   var $64=(($63)&(255));
   var $65=(($62)|(0)) < (($64)|(0));
   if ($65) { label = 15; break; } else { label = 16; break; }
  case 15: 
   var $67=$i;
   var $68=((($67)+(1))&255);
   $i=$68;
   var $69=(($67)&(255));
   var $70=(($buf+$69)|0);
   HEAP8[($70)]=48;
   label = 14; break;
  case 16: 
   var $72=$i;
   var $73=(($72)&(255));
   var $74=HEAP8[((((165)|0))|0)];
   var $75=(($74)&(255));
   var $76=(($73)|(0))==(($75)|(0));
   if ($76) { label = 17; break; } else { label = 18; break; }
  case 17: 
   var $78=$i;
   var $79=((($78)+(1))&255);
   $i=$79;
   var $80=$i;
   var $81=((($80)+(1))&255);
   $i=$81;
   var $82=(($80)&(255));
   var $83=(($buf+$82)|0);
   HEAP8[($83)]=48;
   label = 18; break;
  case 18: 
   label = 19; break;
  case 19: 
   var $86=$i;
   var $87=(($86)&(255));
   var $88=(($87)|(0)) > 0;
   if ($88) { label = 20; break; } else { label = 22; break; }
  case 20: 
   var $90=$i;
   var $91=(($90)&(255));
   var $92=((($91)-(1))|0);
   var $93=(($buf+$92)|0);
   var $94=HEAP8[($93)];
   _console_char($94);
   label = 21; break;
  case 21: 
   var $96=$i;
   var $97=((($96)-(1))&255);
   $i=$97;
   label = 19; break;
  case 22: 
   STACKTOP = __stackBase__;
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _report_status_message($status_code) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   $1=$status_code;
   var $2=$1;
   var $3=(($2)&(255));
   var $4=(($3)|(0))==0;
   if ($4) { label = 2; break; } else { label = 3; break; }
  case 2: 
   _printPgmString(((5736)|0));
   label = 18; break;
  case 3: 
   _printPgmString(((5728)|0));
   var $7=$1;
   var $8=(($7)&(255));
   if ((($8)|(0))==1) {
    label = 4; break;
   }
   else if ((($8)|(0))==2) {
    label = 5; break;
   }
   else if ((($8)|(0))==3) {
    label = 6; break;
   }
   else if ((($8)|(0))==4) {
    label = 7; break;
   }
   else if ((($8)|(0))==5) {
    label = 8; break;
   }
   else if ((($8)|(0))==6) {
    label = 9; break;
   }
   else if ((($8)|(0))==7) {
    label = 10; break;
   }
   else if ((($8)|(0))==8) {
    label = 11; break;
   }
   else if ((($8)|(0))==9) {
    label = 12; break;
   }
   else if ((($8)|(0))==10) {
    label = 13; break;
   }
   else if ((($8)|(0))==11) {
    label = 14; break;
   }
   else if ((($8)|(0))==12) {
    label = 15; break;
   }
   else if ((($8)|(0))==13) {
    label = 16; break;
   }
   else {
   label = 17; break;
   }
  case 4: 
   _printPgmString(((5440)|0));
   label = 17; break;
  case 5: 
   _printPgmString(((4960)|0));
   label = 17; break;
  case 6: 
   _printPgmString(((4664)|0));
   label = 17; break;
  case 7: 
   _printPgmString(((4352)|0));
   label = 17; break;
  case 8: 
   _printPgmString(((4024)|0));
   label = 17; break;
  case 9: 
   _printPgmString(((3872)|0));
   label = 17; break;
  case 10: 
   _printPgmString(((3768)|0));
   label = 17; break;
  case 11: 
   _printPgmString(((3672)|0));
   label = 17; break;
  case 12: 
   _printPgmString(((5712)|0));
   label = 17; break;
  case 13: 
   _printPgmString(((5592)|0));
   label = 17; break;
  case 14: 
   _printPgmString(((5576)|0));
   label = 17; break;
  case 15: 
   _printPgmString(((5560)|0));
   label = 17; break;
  case 16: 
   _printPgmString(((5536)|0));
   label = 17; break;
  case 17: 
   _printPgmString(((5528)|0));
   label = 18; break;
  case 18: 
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _report_alarm_message($alarm_code) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   $1=$alarm_code;
   _printPgmString(((5520)|0));
   var $2=$1;
   var $3=(($2 << 24) >> 24);
   if ((($3)|(0))==-1) {
    label = 2; break;
   }
   else if ((($3)|(0))==-2) {
    label = 3; break;
   }
   else {
   label = 4; break;
   }
  case 2: 
   _printPgmString(((5504)|0));
   label = 4; break;
  case 3: 
   _printPgmString(((5480)|0));
   label = 4; break;
  case 4: 
   _printPgmString(((5464)|0));
   _delay_ms(500);
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _report_feedback_message($message_code) {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1;
   $1=$message_code;
   _printPgmString(((5432)|0));
   var $2=$1;
   var $3=(($2)&(255));
   if ((($3)|(0))==1) {
    label = 2; break;
   }
   else if ((($3)|(0))==2) {
    label = 3; break;
   }
   else if ((($3)|(0))==3) {
    label = 4; break;
   }
   else if ((($3)|(0))==4) {
    label = 5; break;
   }
   else if ((($3)|(0))==5) {
    label = 6; break;
   }
   else {
   label = 7; break;
   }
  case 2: 
   _printPgmString(((5408)|0));
   label = 7; break;
  case 3: 
   _printPgmString(((5384)|0));
   label = 7; break;
  case 4: 
   _printPgmString(((5360)|0));
   label = 7; break;
  case 5: 
   _printPgmString(((5352)|0));
   label = 7; break;
  case 6: 
   _printPgmString(((5336)|0));
   label = 7; break;
  case 7: 
   _printPgmString(((5328)|0));
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _report_init_message() {
 var label = 0;
 _printPgmString(((5296)|0));
 return;
}
function _report_grbl_help() {
 var label = 0;
 _printPgmString(((4992)|0));
 return;
}
function _report_grbl_settings() {
 var label = 0;
 _printPgmString(((4984)|0));
 var $1=HEAPF32[((((96)|0))>>2)];
 _printFloat($1);
 _printPgmString(((4936)|0));
 var $2=HEAPF32[((((100)|0))>>2)];
 _printFloat($2);
 _printPgmString(((4912)|0));
 var $3=HEAPF32[((((104)|0))>>2)];
 _printFloat($3);
 _printPgmString(((4888)|0));
 var $4=HEAPF32[((((168)|0))>>2)];
 _printFloat($4);
 _printPgmString(((4864)|0));
 var $5=HEAPF32[((((172)|0))>>2)];
 _printFloat($5);
 _printPgmString(((4840)|0));
 var $6=HEAPF32[((((176)|0))>>2)];
 _printFloat($6);
 _printPgmString(((4816)|0));
 var $7=HEAPF32[((((128)|0))>>2)];
 var $8=($7)/(3600);
 _printFloat($8);
 _printPgmString(((4784)|0));
 var $9=HEAPF32[((((132)|0))>>2)];
 var $10=($9)/(3600);
 _printFloat($10);
 _printPgmString(((4752)|0));
 var $11=HEAPF32[((((136)|0))>>2)];
 var $12=($11)/(3600);
 _printFloat($12);
 _printPgmString(((4720)|0));
 var $13=HEAPF32[((((180)|0))>>2)];
 _printFloat($13);
 _printPgmString(((4688)|0));
 var $14=HEAPF32[((((184)|0))>>2)];
 _printFloat($14);
 _printPgmString(((4632)|0));
 var $15=HEAPF32[((((188)|0))>>2)];
 _printFloat($15);
 _printPgmString(((4600)|0));
 var $16=HEAP8[((((109)|0))|0)];
 var $17=(($16)&(255));
 _printInteger($17);
 _printPgmString(((4568)|0));
 var $18=HEAPF32[((((112)|0))>>2)];
 _printFloat($18);
 _printPgmString(((4536)|0));
 var $19=HEAP8[((((120)|0))|0)];
 var $20=(($19)&(255));
 _printInteger($20);
 _printPgmString(((4504)|0));
 var $21=HEAP8[((((120)|0))|0)];
 _print_uint8_base2($21);
 _printPgmString(((4496)|0));
 var $22=HEAP8[((((164)|0))|0)];
 var $23=(($22)&(255));
 _printInteger($23);
 _printPgmString(((4464)|0));
 var $24=HEAPF32[((((140)|0))>>2)];
 _printFloat($24);
 _printPgmString(((4432)|0));
 var $25=HEAPF32[((((124)|0))>>2)];
 _printFloat($25);
 _printPgmString(((4400)|0));
 var $26=HEAP8[((((165)|0))|0)];
 var $27=(($26)&(255));
 _printInteger($27);
 _printPgmString(((4368)|0));
 var $28=HEAP8[((((144)|0))|0)];
 var $29=(($28)&(255));
 var $30=$29 & 1;
 var $31=(($30)|(0))!=0;
 var $32=(($31)&(1));
 _printInteger($32);
 _printPgmString(((4320)|0));
 var $33=HEAP8[((((144)|0))|0)];
 var $34=(($33)&(255));
 var $35=$34 & 2;
 var $36=(($35)|(0))!=0;
 var $37=(($36)&(1));
 _printInteger($37);
 _printPgmString(((4288)|0));
 var $38=HEAP8[((((144)|0))|0)];
 var $39=(($38)&(255));
 var $40=$39 & 4;
 var $41=(($40)|(0))!=0;
 var $42=(($41)&(1));
 _printInteger($42);
 _printPgmString(((4248)|0));
 var $43=HEAP8[((((144)|0))|0)];
 var $44=(($43)&(255));
 var $45=$44 & 32;
 var $46=(($45)|(0))!=0;
 var $47=(($46)&(1));
 _printInteger($47);
 _printPgmString(((4216)|0));
 var $48=HEAP8[((((144)|0))|0)];
 var $49=(($48)&(255));
 var $50=$49 & 8;
 var $51=(($50)|(0))!=0;
 var $52=(($51)&(1));
 _printInteger($52);
 _printPgmString(((4184)|0));
 var $53=HEAP8[((((144)|0))|0)];
 var $54=(($53)&(255));
 var $55=$54 & 16;
 var $56=(($55)|(0))!=0;
 var $57=(($56)&(1));
 _printInteger($57);
 _printPgmString(((4152)|0));
 var $58=HEAP8[((((145)|0))|0)];
 var $59=(($58)&(255));
 _printInteger($59);
 _printPgmString(((4120)|0));
 var $60=HEAP8[((((145)|0))|0)];
 _print_uint8_base2($60);
 _printPgmString(((4112)|0));
 var $61=HEAPF32[((((148)|0))>>2)];
 _printFloat($61);
 _printPgmString(((4080)|0));
 var $62=HEAPF32[((((152)|0))>>2)];
 _printFloat($62);
 _printPgmString(((4048)|0));
 var $63=HEAP16[((((156)|0))>>1)];
 var $64=(($63)&(65535));
 _printInteger($64);
 _printPgmString(((3992)|0));
 var $65=HEAPF32[((((160)|0))>>2)];
 _printFloat($65);
 _printPgmString(((3960)|0));
 return;
}
function _report_gcode_parameters() {
 var label = 0;
 var __stackBase__  = STACKTOP; STACKTOP = (STACKTOP + 16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $coord_data=__stackBase__;
   var $coord_select;
   var $i;
   $coord_select=0;
   label = 2; break;
  case 2: 
   var $2=$coord_select;
   var $3=(($2)&(255));
   var $4=(($3)|(0)) <= 7;
   if ($4) { label = 3; break; } else { label = 26; break; }
  case 3: 
   var $6=$coord_select;
   var $7=(($coord_data)|0);
   var $8=_settings_read_coord_data($6, $7);
   var $9=(($8 << 24) >> 24)!=0;
   if ($9) { label = 5; break; } else { label = 4; break; }
  case 4: 
   _report_status_message(10);
   label = 36; break;
  case 5: 
   _printPgmString(((3952)|0));
   var $12=$coord_select;
   var $13=(($12)&(255));
   if ((($13)|(0))==0) {
    label = 6; break;
   }
   else if ((($13)|(0))==1) {
    label = 7; break;
   }
   else if ((($13)|(0))==2) {
    label = 8; break;
   }
   else if ((($13)|(0))==3) {
    label = 9; break;
   }
   else if ((($13)|(0))==4) {
    label = 10; break;
   }
   else if ((($13)|(0))==5) {
    label = 11; break;
   }
   else if ((($13)|(0))==6) {
    label = 12; break;
   }
   else if ((($13)|(0))==7) {
    label = 13; break;
   }
   else {
   label = 14; break;
   }
  case 6: 
   _printPgmString(((3944)|0));
   label = 14; break;
  case 7: 
   _printPgmString(((3936)|0));
   label = 14; break;
  case 8: 
   _printPgmString(((3928)|0));
   label = 14; break;
  case 9: 
   _printPgmString(((3920)|0));
   label = 14; break;
  case 10: 
   _printPgmString(((3912)|0));
   label = 14; break;
  case 11: 
   _printPgmString(((3904)|0));
   label = 14; break;
  case 12: 
   _printPgmString(((3896)|0));
   label = 14; break;
  case 13: 
   _printPgmString(((3864)|0));
   label = 14; break;
  case 14: 
   $i=0;
   label = 15; break;
  case 15: 
   var $24=$i;
   var $25=(($24)&(255));
   var $26=(($25)|(0)) < 3;
   if ($26) { label = 16; break; } else { label = 24; break; }
  case 16: 
   var $28=HEAP8[((((144)|0))|0)];
   var $29=(($28)&(255));
   var $30=$29 & 1;
   var $31=(($30)|(0))!=0;
   if ($31) { label = 17; break; } else { label = 18; break; }
  case 17: 
   var $33=$i;
   var $34=(($33)&(255));
   var $35=(($coord_data+($34<<2))|0);
   var $36=HEAPF32[(($35)>>2)];
   var $37=$36;
   var $38=($37)*(0.0393701);
   var $39=$38;
   _printFloat($39);
   label = 19; break;
  case 18: 
   var $41=$i;
   var $42=(($41)&(255));
   var $43=(($coord_data+($42<<2))|0);
   var $44=HEAPF32[(($43)>>2)];
   _printFloat($44);
   label = 19; break;
  case 19: 
   var $46=$i;
   var $47=(($46)&(255));
   var $48=(($47)|(0)) < 2;
   if ($48) { label = 20; break; } else { label = 21; break; }
  case 20: 
   _printPgmString(((3856)|0));
   label = 22; break;
  case 21: 
   _printPgmString(((5328)|0));
   label = 22; break;
  case 22: 
   label = 23; break;
  case 23: 
   var $53=$i;
   var $54=((($53)+(1))&255);
   $i=$54;
   label = 15; break;
  case 24: 
   label = 25; break;
  case 25: 
   var $57=$coord_select;
   var $58=((($57)+(1))&255);
   $coord_select=$58;
   label = 2; break;
  case 26: 
   _printPgmString(((3848)|0));
   $i=0;
   label = 27; break;
  case 27: 
   var $61=$i;
   var $62=(($61)&(255));
   var $63=(($62)|(0)) < 3;
   if ($63) { label = 28; break; } else { label = 36; break; }
  case 28: 
   var $65=HEAP8[((((144)|0))|0)];
   var $66=(($65)&(255));
   var $67=$66 & 1;
   var $68=(($67)|(0))!=0;
   if ($68) { label = 29; break; } else { label = 30; break; }
  case 29: 
   var $70=$i;
   var $71=(($70)&(255));
   var $72=((((332)|0)+($71<<2))|0);
   var $73=HEAPF32[(($72)>>2)];
   var $74=$73;
   var $75=($74)*(0.0393701);
   var $76=$75;
   _printFloat($76);
   label = 31; break;
  case 30: 
   var $78=$i;
   var $79=(($78)&(255));
   var $80=((((332)|0)+($79<<2))|0);
   var $81=HEAPF32[(($80)>>2)];
   _printFloat($81);
   label = 31; break;
  case 31: 
   var $83=$i;
   var $84=(($83)&(255));
   var $85=(($84)|(0)) < 2;
   if ($85) { label = 32; break; } else { label = 33; break; }
  case 32: 
   _printPgmString(((3856)|0));
   label = 34; break;
  case 33: 
   _printPgmString(((5328)|0));
   label = 34; break;
  case 34: 
   label = 35; break;
  case 35: 
   var $90=$i;
   var $91=((($90)+(1))&255);
   $i=$91;
   label = 27; break;
  case 36: 
   STACKTOP = __stackBase__;
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _report_gcode_modes() {
 var label = 0;
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $1=HEAP8[((((289)|0))|0)];
   var $2=(($1)&(255));
   if ((($2)|(0))==0) {
    label = 2; break;
   }
   else if ((($2)|(0))==1) {
    label = 3; break;
   }
   else if ((($2)|(0))==2) {
    label = 4; break;
   }
   else if ((($2)|(0))==3) {
    label = 5; break;
   }
   else if ((($2)|(0))==4) {
    label = 6; break;
   }
   else {
   label = 7; break;
   }
  case 2: 
   _printPgmString(((3840)|0));
   label = 7; break;
  case 3: 
   _printPgmString(((3832)|0));
   label = 7; break;
  case 4: 
   _printPgmString(((3824)|0));
   label = 7; break;
  case 5: 
   _printPgmString(((3816)|0));
   label = 7; break;
  case 6: 
   _printPgmString(((3808)|0));
   label = 7; break;
  case 7: 
   _printPgmString(((3800)|0));
   var $9=HEAP8[((((316)|0))|0)];
   var $10=(($9)&(255));
   var $11=((($10)+(54))|0);
   _printInteger($11);
   var $12=HEAP8[((((313)|0))|0)];
   var $13=(($12)&(255));
   var $14=(($13)|(0))==0;
   if ($14) { label = 8; break; } else { label = 12; break; }
  case 8: 
   var $16=HEAP8[((((314)|0))|0)];
   var $17=(($16)&(255));
   var $18=(($17)|(0))==1;
   if ($18) { label = 9; break; } else { label = 10; break; }
  case 9: 
   _printPgmString(((3792)|0));
   label = 11; break;
  case 10: 
   _printPgmString(((3760)|0));
   label = 11; break;
  case 11: 
   label = 13; break;
  case 12: 
   _printPgmString(((3752)|0));
   label = 13; break;
  case 13: 
   var $24=HEAP8[((((291)|0))|0)];
   var $25=(($24 << 24) >> 24)!=0;
   if ($25) { label = 14; break; } else { label = 15; break; }
  case 14: 
   _printPgmString(((3744)|0));
   label = 16; break;
  case 15: 
   _printPgmString(((3736)|0));
   label = 16; break;
  case 16: 
   var $29=HEAP8[((((292)|0))|0)];
   var $30=(($29 << 24) >> 24)!=0;
   if ($30) { label = 17; break; } else { label = 18; break; }
  case 17: 
   _printPgmString(((3728)|0));
   label = 19; break;
  case 18: 
   _printPgmString(((3720)|0));
   label = 19; break;
  case 19: 
   var $34=HEAP8[((((290)|0))|0)];
   var $35=(($34 << 24) >> 24)!=0;
   if ($35) { label = 20; break; } else { label = 21; break; }
  case 20: 
   _printPgmString(((3712)|0));
   label = 22; break;
  case 21: 
   _printPgmString(((3704)|0));
   label = 22; break;
  case 22: 
   var $39=HEAP8[((((293)|0))|0)];
   var $40=(($39)&(255));
   if ((($40)|(0))==0) {
    label = 23; break;
   }
   else if ((($40)|(0))==1) {
    label = 24; break;
   }
   else if ((($40)|(0))==2) {
    label = 25; break;
   }
   else {
   label = 26; break;
   }
  case 23: 
   _printPgmString(((3696)|0));
   label = 26; break;
  case 24: 
   _printPgmString(((3688)|0));
   label = 26; break;
  case 25: 
   _printPgmString(((3664)|0));
   label = 26; break;
  case 26: 
   var $45=HEAP8[((((294)|0))|0)];
   var $46=(($45 << 24) >> 24);
   if ((($46)|(0))==1) {
    label = 27; break;
   }
   else if ((($46)|(0))==-1) {
    label = 28; break;
   }
   else if ((($46)|(0))==0) {
    label = 29; break;
   }
   else {
   label = 30; break;
   }
  case 27: 
   _printPgmString(((3656)|0));
   label = 30; break;
  case 28: 
   _printPgmString(((3648)|0));
   label = 30; break;
  case 29: 
   _printPgmString(((3640)|0));
   label = 30; break;
  case 30: 
   var $51=HEAP8[((((295)|0))|0)];
   var $52=(($51)&(255));
   if ((($52)|(0))==0) {
    label = 31; break;
   }
   else if ((($52)|(0))==1) {
    label = 32; break;
   }
   else {
   label = 33; break;
   }
  case 31: 
   _printPgmString(((3632)|0));
   label = 33; break;
  case 32: 
   _printPgmString(((3624)|0));
   label = 33; break;
  case 33: 
   _printPgmString(((3616)|0));
   var $56=HEAP8[((((312)|0))|0)];
   var $57=(($56)&(255));
   _printInteger($57);
   _printPgmString(((3608)|0));
   var $58=HEAP8[((((291)|0))|0)];
   var $59=(($58 << 24) >> 24)!=0;
   if ($59) { label = 34; break; } else { label = 35; break; }
  case 34: 
   var $61=HEAPF32[((((296)|0))>>2)];
   var $62=$61;
   var $63=($62)*(0.0393701);
   var $64=$63;
   _printFloat($64);
   label = 36; break;
  case 35: 
   var $66=HEAPF32[((((296)|0))>>2)];
   _printFloat($66);
   label = 36; break;
  case 36: 
   _printPgmString(((5328)|0));
   return;
  default: assert(0, "bad label: " + label);
 }
}
function _report_startup_line($n, $line) {
 var label = 0;
 var $1;
 var $2;
 $1=$n;
 $2=$line;
 _printPgmString(((3600)|0));
 var $3=$1;
 var $4=(($3)&(255));
 _printInteger($4);
 _printPgmString(((3592)|0));
 var $5=$2;
 _printString($5);
 _printPgmString(((5528)|0));
 return;
}
function _report_realtime_status() {
 var label = 0;
 var __stackBase__  = STACKTOP; STACKTOP = (STACKTOP + 32)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1) switch(label) {
  case 1: 
   var $i;
   var $current_position=__stackBase__;
   var $print_position=(__stackBase__)+(16);
   var $1=$current_position;
   assert(12 % 1 === 0);HEAP32[(($1)>>2)]=HEAP32[(((((36)|0)))>>2)];HEAP32[((($1)+(4))>>2)]=HEAP32[((((((36)|0)))+(4))>>2)];HEAP32[((($1)+(8))>>2)]=HEAP32[((((((36)|0)))+(8))>>2)];
   var $2=HEAP8[((((33)|0))|0)];
   var $3=(($2)&(255));
   if ((($3)|(0))==0) {
    label = 2; break;
   }
   else if ((($3)|(0))==2) {
    label = 3; break;
   }
   else if ((($3)|(0))==3) {
    label = 4; break;
   }
   else if ((($3)|(0))==4) {
    label = 5; break;
   }
   else if ((($3)|(0))==5) {
    label = 6; break;
   }
   else if ((($3)|(0))==6) {
    label = 7; break;
   }
   else if ((($3)|(0))==7) {
    label = 8; break;
   }
   else {
   label = 9; break;
   }
  case 2: 
   _printPgmString(((5704)|0));
   label = 9; break;
  case 3: 
   _printPgmString(((5696)|0));
   label = 9; break;
  case 4: 
   _printPgmString(((5688)|0));
   label = 9; break;
  case 5: 
   _printPgmString(((5680)|0));
   label = 9; break;
  case 6: 
   _printPgmString(((5672)|0));
   label = 9; break;
  case 7: 
   _printPgmString(((5664)|0));
   label = 9; break;
  case 8: 
   _printPgmString(((5656)|0));
   label = 9; break;
  case 9: 
   _printPgmString(((5648)|0));
   $i=0;
   label = 10; break;
  case 10: 
   var $13=$i;
   var $14=(($13)&(255));
   var $15=(($14)|(0)) < 3;
   if ($15) { label = 11; break; } else { label = 15; break; }
  case 11: 
   var $17=$i;
   var $18=(($17)&(255));
   var $19=(($current_position+($18<<2))|0);
   var $20=HEAP32[(($19)>>2)];
   var $21=(($20)|(0));
   var $22=$i;
   var $23=(($22)&(255));
   var $24=((((96)|0)+($23<<2))|0);
   var $25=HEAPF32[(($24)>>2)];
   var $26=($21)/($25);
   var $27=$i;
   var $28=(($27)&(255));
   var $29=(($print_position+($28<<2))|0);
   HEAPF32[(($29)>>2)]=$26;
   var $30=HEAP8[((((144)|0))|0)];
   var $31=(($30)&(255));
   var $32=$31 & 1;
   var $33=(($32)|(0))!=0;
   if ($33) { label = 12; break; } else { label = 13; break; }
  case 12: 
   var $35=$i;
   var $36=(($35)&(255));
   var $37=(($print_position+($36<<2))|0);
   var $38=HEAPF32[(($37)>>2)];
   var $39=$38;
   var $40=($39)*(0.0393701);
   var $41=$40;
   HEAPF32[(($37)>>2)]=$41;
   label = 13; break;
  case 13: 
   var $43=$i;
   var $44=(($43)&(255));
   var $45=(($print_position+($44<<2))|0);
   var $46=HEAPF32[(($45)>>2)];
   _printFloat($46);
   _printPgmString(((3856)|0));
   label = 14; break;
  case 14: 
   var $48=$i;
   var $49=((($48)+(1))&255);
   $i=$49;
   label = 10; break;
  case 15: 
   _printPgmString(((5640)|0));
   $i=0;
   label = 16; break;
  case 16: 
   var $52=$i;
   var $53=(($52)&(255));
   var $54=(($53)|(0)) < 3;
   if ($54) { label = 17; break; } else { label = 24; break; }
  case 17: 
   var $56=HEAP8[((((144)|0))|0)];
   var $57=(($56)&(255));
   var $58=$57 & 1;
   var $59=(($58)|(0))!=0;
   if ($59) { label = 18; break; } else { label = 19; break; }
  case 18: 
   var $61=$i;
   var $62=(($61)&(255));
   var $63=((((320)|0)+($62<<2))|0);
   var $64=HEAPF32[(($63)>>2)];
   var $65=$i;
   var $66=(($65)&(255));
   var $67=((((332)|0)+($66<<2))|0);
   var $68=HEAPF32[(($67)>>2)];
   var $69=($64)+($68);
   var $70=$69;
   var $71=($70)*(0.0393701);
   var $72=$i;
   var $73=(($72)&(255));
   var $74=(($print_position+($73<<2))|0);
   var $75=HEAPF32[(($74)>>2)];
   var $76=$75;
   var $77=($76)-($71);
   var $78=$77;
   HEAPF32[(($74)>>2)]=$78;
   label = 20; break;
  case 19: 
   var $80=$i;
   var $81=(($80)&(255));
   var $82=((((320)|0)+($81<<2))|0);
   var $83=HEAPF32[(($82)>>2)];
   var $84=$i;
   var $85=(($84)&(255));
   var $86=((((332)|0)+($85<<2))|0);
   var $87=HEAPF32[(($86)>>2)];
   var $88=($83)+($87);
   var $89=$i;
   var $90=(($89)&(255));
   var $91=(($print_position+($90<<2))|0);
   var $92=HEAPF32[(($91)>>2)];
   var $93=($92)-($88);
   HEAPF32[(($91)>>2)]=$93;
   label = 20; break;
  case 20: 
   var $95=$i;
   var $96=(($95)&(255));
   var $97=(($print_position+($96<<2))|0);
   var $98=HEAPF32[(($97)>>2)];
   _printFloat($98);
   var $99=$i;
   var $100=(($99)&(255));
   var $101=(($100)|(0)) < 2;
   if ($101) { label = 21; break; } else { label = 22; break; }
  case 21: 
   _printPgmString(((3856)|0));
   label = 22; break;
  case 22: 
   label = 23; break;
  case 23: 
   var $105=$i;
   var $106=((($105)+(1))&255);
   $i=$106;
   label = 16; break;
  case 24: 
   _printPgmString(((5632)|0));
   STACKTOP = __stackBase__;
   return;
  default: assert(0, "bad label: " + label);
 }
}
// EMSCRIPTEN_END_FUNCS
// EMSCRIPTEN_END_FUNCS
// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;
// === Auto-generated postamble setup entry stuff ===
Module['callMain'] = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(!Module['preRun'] || Module['preRun'].length == 0, 'cannot call main when preRun functions remain to be called');
  args = args || [];
  ensureInitRuntime();
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);
  var ret;
  var initialStackTop = STACKTOP;
  try {
    ret = Module['_main'](argc, argv, 0);
  }
  catch(e) {
    if (e.name == 'ExitStatus') {
      return e.status;
    } else if (e == 'SimulateInfiniteLoop') {
      Module['noExitRuntime'] = true;
    } else {
      throw e;
    }
  } finally {
    STACKTOP = initialStackTop;
  }
  return ret;
}
function run(args) {
  args = args || Module['arguments'];
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return 0;
  }
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    var toRun = Module['preRun'];
    Module['preRun'] = [];
    for (var i = toRun.length-1; i >= 0; i--) {
      toRun[i]();
    }
    if (runDependencies > 0) {
      // a preRun added a dependency, run will be called later
      return 0;
    }
  }
  function doRun() {
    ensureInitRuntime();
    preMain();
    var ret = 0;
    calledRun = true;
    if (Module['_main'] && shouldRunNow) {
      ret = Module['callMain'](args);
      if (!Module['noExitRuntime']) {
        exitRuntime();
      }
    }
    if (Module['postRun']) {
      if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
      while (Module['postRun'].length > 0) {
        Module['postRun'].pop()();
      }
    }
    return ret;
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
    return 0;
  } else {
    return doRun();
  }
}
Module['run'] = Module.run = run;
// {{PRE_RUN_ADDITIONS}}
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
run();
// {{POST_RUN_ADDITIONS}}
  // {{MODULE_ADDITIONS}}
