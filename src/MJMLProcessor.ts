import { parse } from './mjml-to-ast.js'

export default class MJMLProcessor {
  availableExtensions() {
    return ['.mjml']
  }

  processor(_ext: string) {
    return {
      preProcess(text: string, _filePath: string) {
        return parse(text)
      },
      postProcess(messages: any[], filePath?: string) {
        return {
          messages,
          filePath: filePath ?? '<mjml>'
        }
      }
    }
  }
}
