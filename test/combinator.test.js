import * as CC from '../src/Combinator'
import * as c from '@geekagency/composite-js'
import chalk from 'chalk'
test('[AC] ',()=>{
  let combine = CC.combineObject;

  let enhancer = fn => args => {
    // z is the value (function)
  //  console.log('fn',fn,typeof z ==='function'?fn.toString():'Naf')
  //  console.log('enhancer args',args)
    return fn(args)
  }

  let my_combinable_fn = (x=c.identity)=>{
    //x is the function parameter
  //  console.log('x',x,typeof x ==='function'?x.toString():'Naf')
    return x('blabla')
  }

  let res = combine(
    CC.asFunctionProp('coucou',my_combinable_fn),
  )(enhancer)


  expect (
    res.coucou
  ).toBeInstanceOf(Function)

  expect (res.coucou()).toBe('blabla')
  expect (res.coucou(y=>y+'ahi')).toBe('blablaahi')
})


test('[ColorLogger]',()=>{
  const safeLog = c.safePropCall(console)('log')
  const safeChalk = c.safePropCall(chalk)

  const colorize = color => safeChalk(color)
  //const colorLog = color =>  c.compose(safeLog,safeChalk(color));
  const logTask = c.compose(colorize('bgGreen'),colorize('black'));
  const skipTask = c.compose(colorize('bgRed'),colorize('yellow'));
  const erroredTask = c.compose(colorize('bgRed'),colorize('black'));
  let combine = CC.combineObject;


  let combinedColorizer= combine(
    CC.asFunctionProp('error',colorize('red')),
    CC.asFunctionProp('warn',colorize('yellow')),
    CC.asFunctionProp('log',colorize('green')),
    CC.asFunctionProp('info',colorize('grey')),
    CC.asFunctionProp('task',logTask),
    CC.asFunctionProp('skippedTask',skipTask),
    CC.asFunctionProp('erroredTask',erroredTask)

  )


  let safeOutputConsole = combinedColorizer(x => arg=>console.log(x('logging '+arg)))
  // by default combinator use an identity enhancer to call a FN with the final argument
  let safeOutputConsoleTester = combinedColorizer(x => arg=> x(arg))
  let noEnhancedConsoleTester = combinedColorizer()
  safeOutputConsole.error('error')
  safeOutputConsole.warn('warn')
  safeOutputConsole.log('log')
  safeOutputConsole.info('info')
  safeOutputConsole.task('applied task')
  safeOutputConsole.skippedTask('skipped task')
  safeOutputConsole.erroredTask('errored task')

  expect(safeOutputConsoleTester.error('error')).toContain('error')
  expect(safeOutputConsoleTester.warn('error')).toContain('error')
  expect(safeOutputConsoleTester.log('error')).toContain('error')
  expect(safeOutputConsoleTester.info('error')).toContain('error')
  expect(safeOutputConsoleTester.task('error')).toContain('error')
  expect(safeOutputConsoleTester.skippedTask('error')).toContain('error')
  expect(safeOutputConsoleTester.erroredTask('error')).toContain('error')

  console.log(noEnhancedConsoleTester.error('error'))
  console.log(noEnhancedConsoleTester.warn('skip'))
  console.log(noEnhancedConsoleTester.error('error'))

  //both way should be strictly equals
  expect(noEnhancedConsoleTester.error('error')).toEqual(safeOutputConsoleTester.error('error'))
  expect(noEnhancedConsoleTester.skippedTask('skippedTask')).toEqual(safeOutputConsoleTester.skippedTask('skippedTask'))


})
