
import './codeHighlightSupport.css'
const highLightCodeSection = (code: string, key: number) => {
  return (
    <pre key={key}>
      <code>{code.trim()}</code>
    </pre>
  )
}

export default highLightCodeSection