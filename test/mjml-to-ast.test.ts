import { test } from '@textlint/ast-tester'
import { describe, it } from 'vitest'
import { parse } from '../src/mjml-to-ast'

describe('parse', () => {
  it('should return AST that can pass isTxtAst', () => {
    const ast = parse('<mjml><mj-body><mj-section><mj-column><mj-text>Lorem ipsum</mj-text></mj-column></mj-section></mj-body></mjml>')
    test(ast)
  })
})
