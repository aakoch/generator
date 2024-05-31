import debugFunc from 'debug'
// import eachFunc from './each.js'
// import whileFunc from './while.js'
// import processCodeBlock from './processCodeBlock.js'
// import assignmentModuleFunction from './assignment.js'
// import evaluateUnbufferedCode from './unbuf_code.js'
import assert from 'assert'
// import { run } from './run.js'
// import { createMixin } from './mixin.js'
// import { create } from 'domain'
import {inspect} from 'util'
// import escapeHtml from 'escape-html'
const debug = debugFunc('generator')

// const MixinStack = class {
//   add(name, obj) {
//     this[name] = obj
//   }
//   get(key) {
//     return this[key]
//   }
// }



class Generator {

  constructor() {}

  compile(code, variables, arrayName = 'returnArray') {
    assert(typeof code === 'string')
    debug('entering compile with code="' + inspect(code, false, 5) + '" variables="' + variables)
    let functionString;
    if (variables === undefined || Object.keys(variables).length > 0) { //  || Object.empty(variables)) {
      functionString = 'return ' + code;
    }
    else {
      functionString = 'let ' + arrayName + ' = []; ' + code  + '; return ' + arrayName + '.join("")';
    }
    debug('functionString="' + functionString)
    const func = Function(Object.keys(variables ?? {}), functionString)
    debug('compile: returning ', func.toString())
    return func;
  }


  // static codeResults = {
  //   strings: [],
  // }

  // static exist(obj) {
  //   if (typeof obj === 'undefined') return ''
  //   else return null
  // }
  // static isSelfClosingTag(tag) {
  //   const selfClosing = ['meta', 'input'].includes(tag.toLowerCase())
  //   debug('isSelfClosingTag(): tag ' + tag + ' is ' + (selfClosing ? '' : 'not ') + 'self-closing')
  //   return selfClosing
  // }

  // static findUniqueAttrs(arr) {
  //   if (arr.length === 0) return []

  //   const attrNameMap = {}
  //   arr.forEach(element => {
  //     if (attrNameMap.hasOwnProperty(element.name) && attrNameMap[element.name] != undefined) {
  //       attrNameMap[element.name] = this.merge(attrNameMap[element.name], element.val)
  //     } else {
  //       attrNameMap[element.name] = element
  //     }
  //   })
  //   return Object.values(attrNameMap)
  // }

  // static handleMultipleAttrVals(val) {
  //   if (typeof val === 'string') {
  //     return val
  //   } else if (Array.isArray(val)) {
  //     return val.join(' ')
  //   } else {
  //     return val
  //   }
  // }

  // // TODO:
  // static merge(obj1, obj2) {
  //   return obj1
  // }

  // static usesTerseHtml(attr) {
  //   return attr.name === 'checked'
  // }

  static functions = {
    append: obj => ['\n<!-- Placeholder for append: ' + obj.val + '-->', ''],
    assignment: (obj, variables) => {
      debug('assignment: obj=', obj, ', variables=', variables)
      // let ret = assignmentModuleFunction(obj, variables, "var i = 9; var avatar = '219b77f9d21de75e81851b6b886057c7'")
      // debug('assignment: ret=', ret.toString())
      // debug('assignment: returning=', ret(Object.values(variables)))
      // return ret(Object.values(variables))
      let func = assignmentModuleFunction(obj, variables)
      debug('assignment: function=', func.toString())
      let ret = func(variables)
      debug('assignment: ret=', ret)
      return ret
    },
    attrs: (obj, variables, mixinStack, options) => {
      debug('attrs: obj=', obj)
      const uniqueAttrs = this.findUniqueAttrs(obj.attrs)
      const retAttrs = uniqueAttrs.map(attr => {
        // debug('attrs: attr.name=', attr.name)
        // // if (attr.name === 'class') {
        // //   attr.name = 'clazz'
        // // }
        // debug('attrs: attr.val=', attr.val)
        // debug('attrs: typeof attr.val=', typeof attr.val)
        // const innerFuncStr = codeStack.join(';\n') + ';\n return (' + attr.val + ');';
        // debug('attrs: innerFuncStr=', innerFuncStr)
        // const funcStr = Function(innerFuncStr).toString()
        // debug('attrs: funcStr=', funcStr)
        // attr.val = evaluateUnbufferedCode( { type: 'unbuf_code', val: funcStr})
        // // if (typeof attr.val === 'string' && (attr.val.includes('"') || attr.val.includes("'"))) {
        // //   console.error('WARN: attributes should already be resolved but "' + attr.val +
        // //   '" contains a single or double quote')
        // // }
        if (this.usesTerseHtml(attr) && (attr.val === true || attr.val.toLowerCase() === 'true')) {
        //   if (typeof attr.val == 'undefined' || attr.val === false || attr.val === 'false') {
        //     return ''
        //   }
        //   else {
        //     return attr.name
        //   }
          return attr.name
        }
        else {
          return attr.name + '="' + escapeHtml(this.handleMultipleAttrVals(attr.val)) + '"'
        }
      })
      debug('attrs: retAttrs=', retAttrs)
      return retAttrs
    },
    attrs_start: obj => ['\n<!-- attrs_start -->' + obj.attrs, ''],
    attrs_end: obj => {
      if (obj.val === '') {
        return ['', '']
      }
      else {
        debug('obj.val=', obj.val)
        debug('obj=', obj)
        return ['\n<!-- attrs_end -->' + JSON.stringify(obj.val[0].name ?? obj.val[0]), '']
      }
    },
    attrs_cont: obj => ['\n<!-- attrs_cont -->' + this.functions.attrs({attrs:obj.val}).toString().replace('undefined', ''), ''],
    block: obj => ['\n<!-- Placeholder for block: ' + obj.val + '-->', ''],
    case: obj => ['\n<!-- Placeholder for case: ' + obj.val + '-->', ''],
    classes: obj => {
      debug('classes=', obj.classes)
      return 'class="' + obj.classes.join(' ') + '"'
    },
    code: obj => {
      // debug('code(): this=', this)
      // this.codeResults.strings.push(obj.val)
      // debug('code: obj=', obj)

      // function runCode(str, key){
      //   return Function('"use strict";' + str + '; return ' + key + ';');
      // }

      // var ret = runCode(obj.val, obj.key)()
      // debug('code: ret=', ret);
      // codeResults[obj.key] = ret;
      // return [ ret, '' ]
    },
    comment: obj => ['', ''],
    condition: obj => ['(' + obj.condition + ')', ''],
    conditional: obj => [obj.name + this.if_condition(obj), ''],
    default: obj => ['\n<!-- Placeholder for default: ' + obj.val + '-->', ''],
    doctype: obj => ['<!DOCTYPE ' + (obj.val ?? 'html') + '>', ''],
    each: (obj, variables) => {
      return eachFunc(obj, this.convertToVariables(this.codeResults))
    },
    else: obj => ['\n<!-- Placeholder for else: ' + obj.val + '-->', ''],
    escaped_text: obj => ['\n<!-- Placeholder for escaped_text: ' + obj.val + '-->', ''],
    extend: obj => ['\n<!-- The "extend" keyword should not be used. Use "extends". ' + obj.val + '-->', ''],
    extends: obj => ['\n<!-- Placeholder for extends: ' + obj.val + '-->', ''],
    for: obj => eachFunc(obj, {}),
    groups: obj => ['\n<!-- Placeholder for groups: ' + obj.val + '-->', ''],
    html_comment: obj => ['<!--', '-->'],
    id: obj => [' id="' + obj.id + '"', ''],
    if: obj => ['\n<!-- Placeholder for if: ' + obj.val + '-->', ''],
    include: obj => ['\n<!-- Placeholder for include: ' + obj.val + '-->', ''],
    interpolation: obj => {
      debug('obj=', obj)
      if (obj.hasOwnProperty('name')) {
        const key = obj.name.slice(2, -1)
        debug('Looking for ' + key)
        for (const str of this.codeResults.strings) {
          let func = Function('"use strict";' + str + '; return ' + key + ';')
          let ret = func()
          if (ret != undefined) {
            debug("Eureka! I've found it!", ret)
            return [ret, '']
          }
        }
      }
      return ['', '']
    },
    // MULTI_LINE_ATTRS_END: obj => [')', ''],
    name: obj => ['<' + obj.name + '>', ''],
    prepend: obj => ['\n<!-- Placeholder for prepend: ' + obj.val + '-->', ''],
    pug_keyword: obj => {
      switch (obj.name) {
        case 'doctype':
          return this.functions.doctype(obj)
        case 'block':
          return this.functions.block(obj)
        default:
          throw new Error("I don't know what to do with this keyword: " + obj.name)
      }
    },
    tag: (obj, variables) => {
      debug('tag: ', obj)

      return '<' + obj.name + '>';

    },
    tag_with_multiline_attrs: obj => [(obj.name ?? '') + this.functions.if_id(obj) + this.functions.if_classes(obj) + this.functions.attrs_start(obj)],
    text: obj => [obj.val, '\n'],
    unbuf_code: obj => {
      this.codeResults.strings.push(obj.val)
    },
    unbuf_code_block: (obj, mixinStack) => {
      processCodeBlock(obj, mixinStack)
    },
    unless: obj => ['\n<!-- Placeholder for unless: ' + obj.val + '-->', ''],
    val: obj => [obj.val, ''],
    when: obj => ['\n<!-- Placeholder for when: ' + obj.val + '-->', ''],
    while: obj => whileFunc(obj, {}),
    yield: obj => ['', '']
  }

  // static {
  //   const existFunc = this.exist
  //   const functionsObj = this.functions
  //   for (const funcKey in this.functions) {
  //     if (Object.hasOwnProperty.call(this.functions, funcKey)) {
  //       // debug("this.functions=", this.functions)
  //       this.functions['if_' + funcKey] = function (obj, variables) {
  //         debug('static: funcKey=', funcKey)
  //         debug('static: obj[funcKey]=', obj[funcKey])
  //         debug('static: functionsObj=', functionsObj)
  //         debug('static: functionsObj[funcKey]=', functionsObj[funcKey].toString())
  //         return existFunc(obj[funcKey]) ?? functionsObj[funcKey](obj, variables)
  //       }
  //     }
  //   }
  // }

  // static convertToVariables(codeResults) {
  //   return codeResults.strings
  // }

  // #codeStack = []

  // mixinStack = new MixinStack()

  // mixin = function(obj, variables) {
  //   // const obj2 = {}
  //   // obj2[obj.val.substring(0, obj.val.indexOf('('))] = [(obj.name ?? '') + (obj.attrs ? '(' + obj.attrs + ')' : ''), '']
  //   // mixinStack.add(obj2)
  //   // debug('mixinStack=', mixinStack)
  //   const [name, mixin] = createMixin(obj);
  //   this.mixinStack.add(name, mixin)
  //   delete obj.children // hopefully we've already processed the body of the mixin
  //   return ['', '']
  // }
  // mixin_call = function(obj, variables) {
  //   debug('mixin_call(): obj=', obj)
  //   debug('mixin_call(): mixinStack=', this.mixinStack)
  //   debug('mixin_call(): obj.name=', obj.name)
  //   debug('mixin_call(): mixinStack.get(obj.name)=', this.mixinStack.get(obj.name))
  //   let mixin = this.mixinStack.get(obj.name)
  //   return mixin ? mixin.fn(evaluateUnbufferedCode(obj.params)) : ''
  // }

  walk (obj, variables) {
    debug('Entering walk...')

    let output = ''
    let child = ''
    if (Array.isArray(obj)) {
      debug('obj is an array')
      obj.forEach(node => {
        output += this.walk(node, variables)
      })
      // if (output.includes('undefined')) {
      //   throw new Error(output + '\n' + JSON.stringify(obj, null, '  '));
      // }
    } else if (obj.hasOwnProperty('children')) {
      debug('obj has children')
      obj.children.forEach(node => {
        child += this.walk(node, variables)
      })
    }

    const outputOfUnknownType = this.visit(obj, variables);
    
    if (typeof outputOfUnknownType === 'string') {
      output += '\n' + outputOfUnknownType
    }
    else if (typeof outputOfUnknownType === 'undefined') {
      output += ''
    }
    else {
      debug('type of outputOfUnknownType=', typeof outputOfUnknownType)
      output += outputOfUnknownType()
    }
      // if (output.includes('undefined')) {
      //   throw new Error(output + '\n' + JSON.stringify(obj, null, '  '));
      // }
    assert(typeof output === 'string')
    return output
  }


  visit(obj, variables) {
    assert.ok(obj)
    debug('Entering visit... obj=', obj, ', variables=', variables)
    let output
    debug('obj.type=' + obj.type)
    if (typeof obj.type === 'undefined') {
      debug('object type is undefined. obj=', obj)
    } else {
      debug('looking for a generator to handle obj.type=', obj.type)
      if (!this.hasOwnProperty(obj.type) && !this.constructor.functions.hasOwnProperty(obj.type)) {
        throw new Error('No method to handle type "' + obj.type + '"')
      }

      debug('this.constructor.functions[obj.type]=', this.constructor.functions[obj.type]);
      let currentlyNotAFunction = this.constructor.functions[obj.type](obj, variables)
      debug('currentlyNotAFunction=', currentlyNotAFunction)
      if (typeof currentlyNotAFunction === 'string') {
        output = this.compile('"' + currentlyNotAFunction + '"');
      }
      else {
        output = currentlyNotAFunction()
      }

    //   if (obj.type === 'comment') {
    //     output = ''
    //   } else if (obj.type === 'code' || obj.type === 'unbuf_code') {
    //     //this.constructor.codeResults[obj.name] = this.constructor.functions.code.call(this, obj, variables)
    //   } else if (obj.type === 'unbuf_code_block') {
    //     // Without a block, the element is accepted and no code is generated
    //     debug('obj=', obj)
    //     if (obj.hasOwnProperty('children')) {
    //       obj.children.forEach(obj2 => {
    //         debug('obj.name=', obj.name)
    //         debug('obj2=', obj2)
    //         this.constructor.codeResults[obj.name] = this.constructor.functions.code.call(this, obj2, variables)
    //       })
    //     }
    //   } else if (obj.hasOwnProperty('assignment')) {
    //     output = this.constructor.functions.assignment.call({}, obj, variables)
    //   } else {
    //     debug('calling functions.' + obj.type + ', with variables=', variables)


    //     let result
    //     if (this.hasOwnProperty(obj.type)) {
    //       result = this[obj.type](obj, variables)
    //     }
    //     else {
    //       result = this.constructor.functions[obj.type].call({}, obj, variables)
    //     }

    //     debug('result=', result)

    //     if (Array.isArray(result)) {
    //       if (result.length == 2) {
    //         output = result[0]
    //         if (obj.hasOwnProperty('children')) {
    //           for (let index = 0; index < obj.children.length; index++) {
    //             const el = obj.children[index];
    //             debug('variables=', variables)
    //             output += this.walk(el, variables)
    //           }
    //           // if (output.includes('undefined')) {
    //           //   throw new Error(output + '\n' + JSON.stringify(obj, null, '  '));
    //           // }
    //         }
    //         output += result[1] ?? ''
    //       } else {
    //         console.error('result was not of expected length of 2 but instead = ' + result.length)
    //       }
    //     } else if (typeof result === 'string') {
    //       output = result
    //       if (obj.hasOwnProperty('children')) {
    //         obj.children.forEach(el => {
    //           output += this.walk(el, variables)
    //         })
    //         // if (output.includes('undefined')) {
    //         //   throw new Error(output + '\n' + JSON.stringify(obj, null, '  '));
    //         // }
    //       }
    //     }
    //   }
    }

    return output
  }

  // createNewStack(mixinStack) {
  //   const mixinStack2 = new MixinStack()
  //   const mixinStackProto = Object.getPrototypeOf(mixinStack)
  //   Object.setPrototypeOf(mixinStack2, mixinStackProto)
  //   return mixinStack2
  // }


  // fromString(str) {
  //   debug('Entering fromString...')
  //   const ast = JSON.parse(str)
  //   debug('Finished')
  //   return this.fromObject(ast)
  // }
  
  fromObject(obj, variables = {}) {
    debug('Entering fromObject... obj=', obj)
    const html = this.walk(obj, variables)
    debug('Finished')
    return html
  }

}

export default Generator;
