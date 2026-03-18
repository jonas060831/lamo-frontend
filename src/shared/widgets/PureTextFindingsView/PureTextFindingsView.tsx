import { useEffect } from "react"
import type { FindingsType } from "../../../ai/llama3/Llama3PureText"

type PureTextFindingsViewProps = {
    findings: FindingsType | null
    text: string
}

const PureTextFindingsView = ({findings, text}: PureTextFindingsViewProps) => {

  if(!findings) return null

  useEffect(() => {
    console.log(text)
  }, [])

  return (
    <div>
        
        <h3>Probability : <span> {findings.ai_probability}% AI </span></h3>
        <h3>Reasons:</h3>
         {findings.signals.map((signal: string, index: number) => 
            <p key={index}>• {signal}</p>
         )}
    </div>
  )
}

export default PureTextFindingsView