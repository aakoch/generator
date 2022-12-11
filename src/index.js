import debugFunc from 'debug'
const debug = debugFunc('generator:index')

import { inspect } from 'util'

class Generator {
  compile(code, variables, arrayName = 'returnArray') {

    // extraCode + ';\nreturnArray.push(' + (obj.assignment_val ?? obj.val) +');'

    let functionString
    // if (variables === undefined || variables === {}) {
    //   functionString = 'return ' + code
    // } else {
      functionString = 'let ' + arrayName + ' = []; ' + arrayName + '.push(' + code + '); return ' + arrayName + '.join("")'
    // }
    
    const func = Function(Object.keys(variables ?? {}), functionString)
    return func
  }

}

//
// const func = Function(Object.keys(variables), funcString);
// debug("func=" + func.toString())
// let funcResult;

// while (funcResult = func(Object.values(variables))) {

export { Generator }
