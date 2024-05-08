import debugFunc from 'debug'
const debug = debugFunc('generator:parseCode')

const preparse = function(obj) {
  return { code: obj }
}

const parse = function(obj, codeParam) {

  if (!obj.hasOwnProperty('code')) {
    obj = preparse(obj)
  }

  const code = (obj.code ?? '') + '\n' + (codeParam ?? '')
  debug('code=', code)
  const func = Function(code + '; return ' + obj.val);

  const ret = {}
  debug('func=', func.toString())
  ret[obj.val] = func()
  return ret
}

export default parse;