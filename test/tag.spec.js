import tap from 'tap'
import generateTag from '../src/tag.js'
import debugFunc from 'debug'
const debug = debugFunc('generator:test:tag.spec')

tap.test('basic tag test', (t) => {
  const tag = { type: 'tag', name: 'p', val: 'test' }
  tap.same(generateTag(tag), '<p>test</p>')
  t.end()
})

tap.test('basic self-closing tag test', (t) => {
  const tag = {
    type: 'tag',
    name: 'meta',
    attrs: [
      { name: "property", val: "'article:published_time'" }, { name: "content", val: "'2009-07-25T19:41:42+00:00'" },
    ]
  }
  tap.same(generateTag(tag), '<meta property="article:published_time" content="2009-07-25T19:41:42+00:00">')
  t.end()
})

tap.test('basic no-closing tag test', (t) => {
  const tag = { type: 'tag', name: 'li', val: 'test' }
  tap.same(generateTag(tag), '<li>test')
  t.end()
})

// "attrs": [ {"name": "key", "val": "answer"}, {"name": "value", "val": 42} ], 

tap.test('meta tag test', (t) => {
  const tag = {"source":"/Users/aakoch/projects/new-foo/workspaces/pug-lexing-transformer/all.pug","name":"meta","type":"tag","attrs":[
    { "name": "name", val: "\"description\"" },
    { "name": "content", val: "\"Software Developer and Clean Code Advocate\""}
  ],"lineNumber": 2396}
  tap.same(generateTag(tag), '<meta name="description" content="Software Developer and Clean Code Advocate">')
  t.end()
})

tap.test('title tag test', (t) => {
  const tag = {"source":"/Users/aakoch/projects/new-foo/workspaces/pug-lexing-transformer/all.pug","name":"title","type":"tag","val":"Adam Koch - #{title}","lineNumber": 2784}
  tap.same(generateTag(tag), '<title>Adam Koch - #{title}</title>')
  t.end()
})

tap.test('link tag test', (t) => {
  const tag = {"source":"/Users/aakoch/projects/new-foo/workspaces/pug-lexing-transformer/all.pug","name":"link","type":"tag","attrs":[  
    { "name": "rel", val: "\"stylesheet\"" },
    { "name": "type", val: "\"text/css\"" },
    { "name": "href", val: "\"https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css\""}
  ],"lineNumber": 2807}
  tap.same(generateTag(tag), '<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css">')
  t.end()
})

tap.test('script (linked) tag test', (t) => {
  const tag = {"source":"/Users/aakoch/projects/new-foo/workspaces/pug-lexing-transformer/all.pug","name":"script","type":"tag","attrs":[ { name: "async" }, { name: "src", val: "\"https://www.googletagmanager.com/gtag/js?id=UA-452464-5\"" }],"lineNumber": 2809}
  tap.same(generateTag(tag), '<script async src="https://www.googletagmanager.com/gtag/js?id=UA-452464-5"></script>')
  t.end()
})
