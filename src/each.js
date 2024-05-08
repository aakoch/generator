import debugFunc from 'debug'
const debug = debugFunc('generator:each')
import generator from '../src/index.js'
import assignmentModuleFunction from './assignment.js'

function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false
  }
  return typeof obj[Symbol.iterator] === 'function'
}

function assignment(obj, variables) {
  debug('assignment: obj=', obj, ', variables=', variables)
  let ret = assignmentModuleFunction(obj, variables)(Object.values(variables))
  debug('assignment: returning=', ret)
  return ret
}

export default function (obj, variables) {
  debug('obj=', obj)
  debug('variables=', variables)
  const inIndex = obj.val.indexOf(' in ')
  const loopVarName = obj.val.substring(0, inIndex)
  const loopOverVar = obj.val.substring(inIndex + 4)
  debug('inIndex=' + inIndex)
  debug('loopVar=' + loopVarName)
  debug('loopOverVar=' + loopOverVar)

  if (obj.assignment) {


    const loopConstruct = `
      ${variables};
      let outputBuffer_thatWontClash = '';
      for (let i_thatWontClash = 0; i_thatWontClash < ${loopOverVar}.length; i_thatWontClash++) {
        console.log('inside loopConstruct: ', ${loopOverVar}[i_thatWontClash]);
        outputBuffer_thatWontClash += contentCallback_thatWontClash(${loopOverVar}[i_thatWontClash], i_thatWontClash)
      }
      return outputBuffer_thatWontClash;
    `
    
    const func = Function('contentCallback_thatWontClash', 'console', loopConstruct)
  
    // const forLoopStart = variables.join(';\n') + ';\nreturn ' + loopOverVar + '.map(' + loopVar + ' => { console.log(item);'
    // const forLoopEnd = '\n});'
    // const str = forLoopStart + 'return generator.fromObject(obj, ' + loopVar + ')' + forLoopEnd
    // debug('str=' + str)
    // const func = Function('generator', 'obj', str)
    debug('func=', func.toString())

    // const ret = func(generator, obj)
    const contentCallback_thatWontClash = (loopVarValue, i) => {
      const tempObj = {}
      tempObj[loopVarName] = loopVarValue
      console.log('inside contentCallback_thatWontClash(): tempObj=', tempObj)
      console.log('inside contentCallback_thatWontClash(): i=', i)
      const genOutput = generator.fromObject(obj, tempObj)
      return `this is a test: ${loopVarValue}, ${i}
      generator output = ${genOutput}`
    }
    const ret = func(contentCallback_thatWontClash, console)
    debug('func()=' + ret)
    return ret
  }
  // if (!variables.hasOwnProperty(loopOverVar)) {
  //   throw new Error('"' + loopOverVar + '" in each has to be defined before it can be used')
  // }
  // if (typeof variables[loopOverVar] === 'string' || !isIterable(variables[loopOverVar])) {
  //   throw new Error('"' + loopOverVar + '" has to be iterable')
  // }

  // debug("variables[loopOverVar]=" + variables[loopOverVar])

  // if (!obj.hasOwnProperty('children')) {
  //   return ''
  // }

  // obj.children.forEach(element => {

  // });

  // let returnArray = variables[loopOverVar].map(item => {
  //   debug("toGenerator=", obj.children, { item: item })
  //   const fromGenerator = generator.fromObject(obj.children, { item: item });
  //   debug("fromGenerator=", fromGenerator)
  //   return fromGenerator //.replaceAll('item', item)
  // })

  // return returnArray.join('\n')
}
