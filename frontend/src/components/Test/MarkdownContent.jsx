import { MarkdownHooks as ReactMarkdown } from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

const inlineComponents = {
  p: ({ children }) => <span>{children}</span>,
}

// The API wraps math in backticks which Markdown treats as code spans,
// preventing KaTeX from rendering them. Strip those backticks so remark-math
// can see the $ delimiters or LaTeX commands.
function unwrapMath(content) {
  if (!content) return content
  return content
    .replace(/`([^`]+)`/g, (match, inner) => {
      if (/\$/.test(inner) || /\\[a-zA-Z]/.test(inner)) {
        // Already $-delimited: keep as-is. Otherwise add delimiters.
        return /^\$.*\$$/.test(inner) ? inner : `$${inner}$`
      }
      return match
    })
}

export default function MarkdownContent({ content, inline = false }) {
  const rendered = (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={inline ? inlineComponents : undefined}
    >
      {unwrapMath(content)}
    </ReactMarkdown>
  )
  return inline ? rendered : <div className="md-body">{rendered}</div>
}
