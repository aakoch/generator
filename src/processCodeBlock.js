import generator from './index.js'
import debugFunc from 'debug'
import { inspect } from 'node:util'
const debug = debugFunc('generator:processCodeBlock')

const process = function (arr) {
  const functions = {
    unbuf_code_block: function (obj) {
      if (obj.hasOwnProperty('children')) {
        const children = process(obj.children)
        // if (children.hasOwnProperty('code')) {
        //   return children.code
        // }
        return children
      }
      return {}
    },
    unbuf_code: function (obj) {
      if (obj.hasOwnProperty('children')) {
        // return obj.val + process(obj.children).code
        return obj.val + process(obj.children)
      }
      else {
        return obj.val
      }
    },
    each: function (obj) {
      if (obj.hasOwnProperty('children')) {
        const children = process(obj.children)
        // if (children.hasOwnProperty('code')) {
        //   return children.code
        // }
        return children
      }
      return {}
    },
    tag: function (obj) {
      return obj
    }
  }

  const processObj = function (obj) {
    debug('processObj: obj=', obj)

    if (functions.hasOwnProperty(obj['type'])) {
      const ret = functions[obj['type']](obj)
      debug('processObj: ret=', ret)
      return ret
    }
    else {
      throw new Error('No handler for "' + obj['type'] + '" implemented yet')
    }
  }

  if (arr == undefined) {
    return undefined
  }

  if (!Array.isArray(arr)) {
    // throw new Error('process expects an array but was given ' + typeof arr + '=' + inspect(arr))
    arr = [arr]
  }

  const code = []
  const ret = arr.map(obj => {
    return processObj(obj)
  }).flat()

  // .map(item => {
  //   if (typeof item == 'string') {
  //     code.push(item)
  //     return undefined
  //   }
  //   else 
  //     return item
  // }).flat()
  debug('process: ret=', ret)

  // const ret2 = { code: code, nodes: ret }

  // debug('process: ret2=', ret2)
  return ret
}

export default process;