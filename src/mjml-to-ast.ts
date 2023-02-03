import {
  TxtHtmlNode,
  TxtImageNode,
  TxtParentNode,
} from '@textlint/ast-node-types'
import rehypeParse from 'rehype-parse/lib/index.js'
import { StructuredSource } from 'structured-source'
import traverse from 'traverse'
import { unified } from 'unified'

interface Node {
  type: string
  tagName: string
}

const nameToType = {
  'br': 'break',
  'mj-image': 'Image',
  'mj-text': 'Paragraph',
} as Record<string, string>

const typeToType = {
  'root': 'Document',
  'text': 'Str',
} as Record<string, string>

function mapNodeType(node: Node) {
  if (node.type === 'element') {
    const mappedType = nameToType[node.tagName]
    if (mappedType) {
      return mappedType
    }
    return node.tagName
  }
  const mappedType = typeToType[node.type]
  if (mappedType) {
    return mappedType
  }
  return node.type
}

export function parse(mjml: string) {
  const parseMjml = unified().use(rehypeParse, { fragment: true })
  const ast = parseMjml.parse(mjml)
  const src = new StructuredSource(mjml)
  const tr = traverse(ast)
  tr.forEach(function (node) {
    if (typeof node === 'object' && !Array.isArray(node)) {
      if (!('type' in node)) {
        return
      }

      if (node.type) {
        node.type = mapNodeType(node)
      } else {
        node.type = 'unknown' as const
      }

      if (typeof node.position === 'object') {
        const position = node.position
        const positionCompensated = {
          start: { line: position.start.line, column: position.start.column - 1 },
          end: { line: position.end.line, column: position.end.column - 1 },
        } as const
        const range = src.locationToRange(positionCompensated)
        node.loc = positionCompensated
        node.range = range
        node.raw = mjml.slice(range[0], range[1])
      } else if (this.parent === undefined) {
        const range = [0, mjml.length] as const
        const position = src.rangeToLocation(range)
        node.loc = position
        node.range = range
        node.raw = mjml
      }

      const txtNode = node as TxtHtmlNode |
        TxtImageNode
      if (txtNode.type === 'Image') {
        if (txtNode.properties.alt !== undefined) txtNode.alt = txtNode.properties.alt
        if (txtNode.properties.title !== undefined) txtNode.title = txtNode.properties.title
        if (txtNode.properties.src !== undefined) txtNode.src = txtNode.properties.src
      }
    }
  })

  return ast as unknown as TxtParentNode
}
