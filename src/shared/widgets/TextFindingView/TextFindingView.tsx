
import { useEffect } from "react"
import type { FindingType } from "../../../pages/PureTextPage"

type TextFindingViewProps = {
    findings: FindingType | null
    text: string
}

const TextFindingView = ({findings, text}: TextFindingViewProps) => {

  if(!findings) return null

  useEffect(() => {
    //word count
    const wordCount = text.split(" ").length
    console.log(wordCount)
  }, [])

  return (
    <div style={{ paddingLeft: '2rem' }}>
        
        <h3>Probability : <span style={{ color: findings.ai_probability < 50 ? 'green' : 'red' }} > {findings.ai_probability}% AI </span></h3>
        <h3>Reasons:</h3>
         {findings.signals.map((signal: string, index: number) => 
            <p key={index} style={{ color: 'gray', cursor: 'pointer'}}>• {signal}</p>
         )}
    </div>
  )
}

export default TextFindingView