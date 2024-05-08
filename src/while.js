
import debugFunc from 'debug'
const debug = debugFunc('generator:while')
import generator from './index.js'
import util from 'util'

function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

function createVarAssignmentString(variables) {
  let variableAssignments = []
  for (const key in variables) {
    if (Object.hasOwnProperty.call(variables, key)) {
      const element = variables[key];
      variableAssignments.push('let ' + key + '=' + element);
    }
  }
  return variableAssignments.join(';')
}

function runCode(code, variables) {
  const variableAssignmentString = createVarAssignmentString(variables)

  const funcString = variableAssignmentString + '; ' + code;
  debug('funcString=', funcString)
  const func = Function(funcString);
  const funcReturn =  func()
  debug('funcReturn=', funcReturn)
  return variables;
}

export default function(obj, variables) {
  debug('obj=', obj)
  debug('variables=', variables)

  let variableAssignmentString = createVarAssignmentString(variables);

  const condition = obj.val

  debug("condition=" + condition)

  let i=0
  let returnArray = [];
  
  // let funcString = ';' + variableAssignmentString + 
  let funcString = '; return ' + condition;

  debug("funcString=" + funcString)
  const func = Function(Object.keys(variables), funcString);
  debug("func=" + func.toString())
  let funcResult;

  while (funcResult = func(Object.values(variables))) {
    debug("funcResult=" + funcResult)
    let html
    
    if (obj.hasOwnProperty('children')) {
      // obj.children
      obj.children.forEach(element => {
        if (element.type === 'code') {
          runCode(element.val, variables)
        }
        else {
          html += generator.fromObject(element)
        }
      });
    }
    else {
      return ''
    }
    
    returnArray.push(html)
    
    variableAssignmentString = createVarAssignmentString(variables);
    funcString = ';' + variableAssignmentString + '; return ' + condition;

    if (i++ > 100) throw new Error('Too many recursions. So far returnArray=' + returnArray.join('\n'));
  }

  // debug("loopVar=" + loopVar)
  // debug("loopOverVar=" + loopOverVar)
  
  // if (!variables.hasOwnProperty(loopOverVar)) {
  //   throw new Error(loopOverVar + ' in each has to be defined before it can be used')
  // }
  // if (typeof variables[loopOverVar] === 'string' || !isIterable(variables[loopOverVar])) {
  //   throw new Error(loopOverVar + ' has to be iterable')
  // }
  
  // debug("variables[loopOverVar]=" + variables[loopOverVar])


  // let returnArray = variables[loopOverVar].map(item => {
  //   return generator.fromObject(obj.children).replaceAll('item', item)
  // })

  return returnArray.join('\n').trim()
}