import debugFunc from 'debug'
import assignment from "./assignment.js";
const debug = debugFunc('generator:tag')

function isSelfClosingTag(tag = '') {
  const selfClosing = ['meta', 'input'].includes(tag.toLowerCase())
  debug('isSelfClosingTag(): tag ' + tag + ' is ' + (selfClosing ? '' : 'not ') + 'self-closing')
  return selfClosing
}

const compile = function (context, obj, variables, childrenCallback = () => Function('')) {
  
  // let childrenCallbackFunction = () => ''
  // if (obj.hasOwnProperty('children')) {
  //   childrenCallbackFunction = childrenCallback(obj.children)
  // }

  // debug('tag: obj=', obj)
  // let attrs = ''
  // if (obj.attrs?.length) {
  //   attrs = ' ' + obj.attrs.join(' ').trim()
  // }
  // // if (!obj.hasOwnProperty('name')) {
  // //   return () => [
  // //     // '<'.concat(obj.name ?? 'div', attrs, '>', this.functions.if_assignment(obj, variables), obj.hasOwnProperty('val') ? ' ' + obj.val : ''),
  // //     '<'.concat(obj.name ?? 'div', attrs, '>', obj.hasOwnProperty('val') ? ' ' + obj.val : ''),
  // //     childrenCallbackFunction(),
  // //     `</${obj.name ?? 'div'}>`,
  // //   ]
  // // } else 
  // if (isSelfClosingTag(obj.name)) {
  //   // return () => '<'.concat(obj.name ?? 'div', attrs, '>', this.functions.if_assignment(obj, variables), obj.hasOwnProperty('val') ? ' ' + obj.val : '') // + '/>'
  //   return () => '<'.concat(obj.name ?? 'div', attrs, '>', obj.hasOwnProperty('val') ? ' ' + obj.val : '') // + '/>'
  // } else if (obj.hasOwnProperty('assignment')) {
  //   // return () => this.functions.assignment(obj, variables)
  //   let evaluated = assignment(obj, variables)(variables);
  //   return () => ['<'.concat(obj.name ?? 'div', attrs, '>' + evaluated),
  //     childrenCallbackFunction(),
  //     `</${obj.name ?? 'div'}>`]
  // } else {
  //   return () => [
  //     // '<'.concat(obj.name ?? 'div', attrs, '>', this.functions.if_assignment(obj, variables), obj.hasOwnProperty('val') ? '' + obj.val : ''),
  //     '<'.concat(obj.name ?? 'div', attrs, '>', obj.hasOwnProperty('val') ? '' + obj.val : ''),
  //     childrenCallbackFunction(),
  //     `</${obj.name ?? 'div'}>`,
  //   ]
  // }
  return () => Object.values(variables)
}

const run = function (func, variables, arrayName = 'returnArray') {
  // try {
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