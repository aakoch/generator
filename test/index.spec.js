import tap from 'tap'
import { Generator } from '../src/index.js'
import debugFunc from 'debug'
const debug = debugFunc('generator:test:index.spec')

const generator = new Generator()

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

tap.test(
  'basic test that a string in a basic object is resturned using Objec.values', (t) => {
    const variables = { someOtherKey: 'someOtherValue' }
    const func = generator.compile('someOtherKey', variables)
    debug('func=' + func.toString())
    tap.same(func(Object.values(variables)), 'someOtherValue')
    t.end()
  },
)

// const func = Function(Object.keys(variables), funcString);
// debug("func=" + func.toString())
// let funcResult;

// while (funcResult = func(Object.values(variables))) {
