import { useEffect } from "react"
import type { FindingType } from "../../../pages/PureTextPage"

type TextFindingViewProps = {
    findings: FindingType
}

const TextFindingView = ({findings}: TextFindingViewProps) => {

  useEffect(() => {
    console.log(findings)
  }, [findings])

  if(!findings) return null
  return (
    <div style={{ paddingLeft: '2rem' }}>
        
        <h3>Probability : <span style={{ color: findings.ai_probability < 50 ? 'green' : 'red' }} > {findings.ai_probability}% AI </span></h3>
        <h3>Reasons:</h3>
         {findings.signals.map((signal: string, index: number) => 
            <p key={index}>• {signal}</p>
         )}
    </div>
  )
}

export default TextFindingView