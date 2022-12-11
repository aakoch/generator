import tap from 'tap'
import { Generator } from '../src/index.js'

const generator = new Generator()

tap.same(generator.compile("\"input\"")(), "input")