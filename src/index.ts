import type { TextlintPluginCreator } from '@textlint/types'
import MJMLProcessor from './MJMLProcessor.js'

const plugin: TextlintPluginCreator = {
  Processor: MJMLProcessor
}

export default plugin
