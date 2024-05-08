
import debugFunc from 'debug'
const debug = debugFunc('generator:mixin')
import assignmentModuleFunction from '../src/assignment.js'

class Mixin {
  constructor(name, params, body) {
    this.fn = assignmentModuleFunction(body, params)
    debug('fn=', this.fn.toString())
  }
  call(values) {
    const evaluatedValues = eval(values);
    return this.fn(evaluatedValues)
  }
}

const declarationRegex = /(?<NAME>\w+)\((?<PARAMS>[\w,]+)\)/g
function createMixin(mixinJson) {
  // header(title)

  debug('mixinJson.val=', mixinJson.val)
  const matches = declarationRegex.exec(mixinJson.val)
  debug('matches=', matches)
  if (matches) {
    const name = matches.groups.NAME
    const params = matches.groups.PARAMS.split(',')
    const body = mixinJson.children[0]

    debug('name=', name)
    debug('params=', params)
    debug('body=', body)
    return [name, new Mixin(name, params, body)]
  }
  return ['', '']
}

function generate(inputJsonArr) {
  const [name, aMixin] = createMixin(inputJsonArr[0])
  debug("sending to mixin call=", inputJsonArr[1])

  const mixins = {};
  mixins[name] = aMixin

  const retHtml = mixins[inputJsonArr[1].name].call(inputJsonArr[1].params)
  debug("retHtml=", retHtml)
  return retHtml
}

export { createMixin }