import debugFunc from 'debug'
const debug = debugFunc('generator:tag')

import { Generator } from './index.js'
const generator = new Generator()

function generateAttrs(attrs = []) {
  return attrs.map(attr => {
    if (attr.val) {
      return `" ${attr.name}=\\"" + ${attr.val} + "\\""`
    }
    else {
      return `" ${attr.name}"`
    }
  }).join(" + ")
}

// These rules need to be defined somewhere that they can be overwritten. 
function isSelfClosing(tagName) {
  return false
}

// These rules need to be defined somewhere that they can be overwritten. 
function isNotClosing(tagName) {
  // At one point you could have a "li" tag not closed. I'm not sure with HTML5.
  return tagName === "li"
}

// These rules need to be defined somewhere that they can be overwritten. 
function isOpeningTagOnly(tagName) {
  return tagName === "link" || tagName === "meta"
}

// These rules need to be defined somewhere that they can be overwritten. 
function hasEmptyBody(tagName) {
  return tagName === "script"
}

function generateTag(tag) {
  let code = '"<" + tag.name'

  if (isSelfClosing(tag.name)) {
    // I'm not sure if this condition ever happens. I need to review the specs. XD XD
    if (tag.val) {
      code += ' + ' + generateAttrs(tag.attrs) + ' " value=\\"" + tag.val + "\\" />"'
    }
    else {
      code += ' + ' + generateAttrs(tag.attrs) + ' + " />"'
    }
  }
  else if (isNotClosing(tag.name)) {
    code += ' + ' + generateAttrs(tag.attrs) + ' ">" + tag.val'
  }
  else if (isOpeningTagOnly(tag.name)) {
    code += ' + ' + generateAttrs(tag.attrs) + ' + ">"'
  }
  else if (hasEmptyBody(tag.name)) {
    code += ' + ' + generateAttrs(tag.attrs) + ' + "></" + tag.name + ">"'
  }
  else {
    code += ' + ' + generateAttrs(tag.attrs) + ' ">" + tag.val + "</" + tag.name + ">"'
  }

  debug("Self-closing tag code=" + code)

  const variables = { "tag" : tag }
  const func = generator.compile(code, variables)
  debug('func=' + func.toString())
  debug('tag=', tag)
  debug('variables=', variables)
  return func(...Object.values(variables))
}

export default generateTag