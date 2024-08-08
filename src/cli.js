import { fileURLToPath } from 'url';
import fs from 'fs'
import path from 'path';
import debugFunc from 'debug'
const debug = debugFunc('generator')
import chalk from 'chalk';
const __filename = fileURLToPath(import.meta.url);
// import generator from './index.ts'
import CliTransformer from './cliTransformer.js'
import { parseArguments } from '@foo-dog/utils'
import stream from 'stream'

function printUsage() {
  const help = [''];
  const p = str => help.push(str ?? '')
  const b = str => help.push(chalk.bold(str))
  b("Generator")
  p('Reads a Foo-Dog AST and generates HTML')
  p()
  b('Usage')
  p(chalk.blue('node ' + path.basename(__filename) + ' [-h] [inFile] [outFile]'))
  p('inFile and outFile are both optional and will default to stdin and stdout if omitted.')
  p('You can also use "-" for inFile and outFile for their respective streams.')
  p()

  console.log(help.join('\n'))
}


async function run() {
  const options = await parseArguments(process, printUsage)
  try {
    options.in.createStream()
      .pipe(new CliTransformer(options.in.name === 'stdin'))
      .pipe(options.out.createStream());

    // if (options.in.name == 'stdin') {
    //     let str = process.stdin.read();
    //     if (str != null && str !== '') {
    //       process.stdout.write(str)
    //       const obj = generator.fromString(str)
    //       const jsonString = JSON.stringify(obj, null, '  ');
    //       if (options.out == 'stdout') {
    //         process.stdout.write(jsonString)
    //       }
    //       else {
    //         fs.writeFileSync(options.out, jsonString)
    //       }
        
    //   }
    // }
    // else {
    //   const html = generator.fromString(fs.readFileSync(options.in.name))
    //   if (options.out) {
    //     if (options.out.name == 'stdout') {
    //       process.stdout.write(html)
    //     }
    //     else {
    //       fs.writeFileSync(options.out.name, html)
    //     }
    //   }
    // }
  } catch (e) {
    if (chalk.stderr.supportsColor) {
      console.error(chalk.stderr(chalk.red(e.message)))
      console.error(e)
    }
    else {
      console.error('*'.repeat(30) + '\n' + e.message)
      console.error(e)
    }
  }
}

run()