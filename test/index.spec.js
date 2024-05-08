import tap from 'tap'
import Generator from '../src/index.js'
import debugFunc from 'debug'
const debug = debugFunc('generator:test:index.spec')


const generator = new Generator()
debug('generator=', generator)
debug('generator.compile=', generator.compile)

tap.test('basic test that a literal string is returned', (t) => {
  const func = generator.compile('"input"', {})
  debug('func=' + func.toString())
  t.same(func(), 'input')
  t.end()
})

tap.test('basic test that a string in a basic object is returned', (t) => {
  const variables = { someKey: 'someValue' }
  const func = generator.compile('someKey', variables)
  debug('func=' + func.toString())
  tap.same(func(variables.someKey), 'someValue')
  t.end()
})

tap.test('basic test that a string in a basic object is returned using Object.values', (t) => {
  const variables = { someOtherKey: 'someOtherValue' }
  const func = generator.compile('someOtherKey', variables)
  debug('func=' + func.toString())
  tap.same(func(Object.values(variables)), ['someOtherValue'])
  t.end()
})

tap.test('basic tag test using a template (not realistic)', (t) => {
  const tag = { type: 'tag', name: 'p', val: 'test' }
  const code = `"<${tag.name}>${tag.val}</${tag.name}>"`
  const func = generator.compile(code, tag)
  debug('func=' + func.toString())
  tap.same(func(Object.values(tag)), '<p>test</p>')
  t.end() 
})

tap.test('basic tag test', (t) => {
  const tag = { type: 'tag', name: 'p', val: 'test' }
  const code = '"<" + tag.name + ">" + tag.val + "</" + tag.name + ">"'
  const variables = { "tag" : tag }
  const func = generator.compile(code, variables)
  debug('func=' + func.toString())
  tap.same(func(tag), '<p>test</p>')
  t.end()
})

tap.test('basic tag test 2', (t) => {
  const tag = { type: 'tag', name: 'p', val: 'test' }
  const code = '"<" + tag.name + ">" + tag.val + "</" + tag.name + ">"'
  const variables = { "extra": "not used", "tag" : tag }
  const func = generator.compile(code, variables)
  debug('func=' + func.toString())
  debug('tag=', tag)
  debug('variables=', variables)
  debug('Object.values(variables)=', Object.values(variables))
  tap.same(func(...Object.values(variables)), '<p>test</p>')
  t.end()
})



// import tap from 'tap'
// import {compile, run} from '../src/tag.js'

// function handleChildren(children) {
//   return () => children.map(child => prepare({}, child, {}, handleChildren)).join('')  
// }

// function prepare(context, json, variables = {}) {
//   return run(compile(context, json, {}, handleChildren), variables).join('')
// }

// tap.same(prepare({}, ),
//   "<li>10</li>")
