import debugFunc from 'debug'
const debug = debugFunc('generator:run')
import { inspect } from 'util'

const compile = function (code, variables, arrayName = 'returnArray') {
  let functionString
  if (variables === undefined) { // || Object.empty(variables)) {
    functionString = 'return ' + code;
  }
  else {
    functionString = 'let ' + arrayName + ' = []; ' + code  + '; return ' + arrayName + '.join("")';
  }
  const func = Function(Object.keys(variables ?? {}), functionString)
  return func;
}

const run = function (code, variables, arrayName = 'returnArray') {
  // try {
    const func = compile(code, variables, arrayName)
    debug('func=', func.toString())
    const result = func(Object.values(variables ?? {}))
    return result
  // }
  // catch (e) {
  //   throw new EvalError("Could not evaluate: " + code + " with variables = " + inspect(variables))
  // }
}

export {
  compile,
  run
}
