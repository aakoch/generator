
import generator from './index.js'
import debugFunc from 'debug'
import assert from 'assert'
const debug = debugFunc('codeGenerator:unbuf_code')
import { run } from './run.js'
import assignment from './assignment.js'
import { inspect } from 'util'

const embedChildren = function (children, variables) {
  const returnArr = []
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.type === 'unbuf_code' || child.type === 'code') {
      returnArr.push(child.val)
    }
    else if (child.hasOwnProperty('assignment')) {
      returnArr.push('returnArray.push(')
      returnArr.push(assignment(child, variables))
      returnArr.push('(' + Object.keys(variables) + ')')
      returnArr.push(');')
    }
    else {
      returnArr.push('returnArray.push(')
      returnArr.push('"' + generator.fromObject(child, variables) + '"')
      returnArr.push(');')
    }
  }
  return returnArr.join('\n')
}

const evaluateUnbufferedCode = function(objOrArray, variables) {
  if (typeof objOrArray === 'string') {
    return evaluateUnbufferedCode({type: "unbuf_code", val: objOrArray})
  }
  debug('evaluateUnbufferedCode(): objOrArray=', objOrArray, ', variables=', variables)
  const codeArray = []
  if (Array.isArray(objOrArray)) {
    for (let index = 0; index < objOrArray.length; index++) {
      const obj = objOrArray[index];
      pushValAndChildren(codeArray, obj, variables)
    }
  }
  else {
    const obj = objOrArray
    pushValAndChildren(codeArray, obj, variables)
  }
  const str = codeArray.join('\n')
  debug('evaluateUnbufferedCode(): str=', str)
  debug('evaluateUnbufferedCode(): variables=', variables)
  return run(str, variables)
}

function pushValAndChildren(codeArray, obj, variables) {
  debug('pushValAndChildren(): codeArray=', codeArray, ', obj=', obj, ', variables=', variables)
  if (obj.type == 'code') { 
    obj.type == 'unbuf_code'
  }
  assert.strictEqual(obj.type, 'unbuf_code')
  codeArray.push(obj.val)
  if (obj.hasOwnProperty('children')) {
    codeArray.push('{')
    codeArray.push(embedChildren(obj.children, variables))
    codeArray.push('}')
  }
}

export default evaluateUnbufferedCode
