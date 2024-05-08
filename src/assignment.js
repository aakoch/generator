import debugFunc from 'debug'
const debug = debugFunc('generator:assignment')
import { compile } from './run.js'
import assert from 'assert'
import { inspect } from 'util'

const assignment = function (obj, variables = {}, extraCode = '') {
  assert.ok(obj.assignment, "Object not of type assignable: " + inspect(obj))
  const str = extraCode + ';\nreturnArray.push(' + (obj.assignment_val ?? obj.val) +');'
  debug('str=', str)
  debug('variables=', variables)
  const func = compile(str, variables, 'returnArray')
  debug('func=' + func.toString())
  return func
}

export default assignment

// const assignment2 = function (obj, variables = {}) {
//   assert.ok(obj.assignment)
//   const str = 'returnArray.push("<' + obj.name + '>"); returnArray.push(' + obj.assignment_val +'); returnArray.push("</' + obj.name + '>");'
//   debug('str=', str)
//   debug('variables=', variables)
//   return compile(str, variables, 'returnArray')
// }

// export {
//   assignment,
//   assignment2
// }