import { useState, type ChangeEvent, type ReactNode } from "react"
import CircleButton from "../../shared/uis/Buttons/CircleButton/CircleButton"
import TextArea from "../../shared/uis/Inputs/TextArea/TextArea"

import * as lamoService from '../../services/lamoService'
import PureTextFindingsView from "../../shared/widgets/PureTextFindingsView/PureTextFindingsView"


export type FindingsType = {
 ai_probability: number,
 confidence: number,
 signals: string []
}


/*
Desktop

|top  = formContainer, widgetContainer in a single row
|bottom = bommtomContainer in a single row

all others

formContainer
widgetContainer
bottomContainer

*/
type Llama3PureTextProps = {
    containerClass: string
    topContainerClass: string
    formContainerClass: string
    widgetContainerClass: string
    bottomContainerClass: string
    children?: ReactNode
}

const Llama3PureText = ({containerClass, topContainerClass, formContainerClass, widgetContainerClass, bottomContainerClass , children}: Llama3PureTextProps) => {

  const [ text, setText ] = useState('')
  const [findings, setFindings] = useState<FindingsType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      event.preventDefault()
      
      const value = event.target.value
  
      setText(value)
    }
  
    const handleProcessText = async () => {
  
      if(text.trim() === '') return
  
      setIsLoading(true)
      try {
        
        const data = await lamoService.processText(text)
  
        if(data.error) {
          alert(data.error)
          setIsLoading(false)
        }
        else {
        setFindings(data)
        setIsLoading(false)}
  
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error'
        console.log(errorMessage)
      }
    }
  return (
    // container
    <main className={containerClass}> 

        {/* top container */}
        <div className={topContainerClass}>

            {/* text area and button */}
            <section className={formContainerClass}> 
                
                <form>
                    <TextArea
                    name='textToProcess'
                    id='1'
                    value={text}
                    handleChange={handleChange}
                    placeholder="Paste your text here to check for AI generation"
                    />
                    
                    <CircleButton 
                    iconName={isLoading ? 'loading' : 'crosshair'}
                    iconSize={20}
                    handleClick={handleProcessText}
                    type='submit'
                    />
                </form>
            </section>

            {/* widgetContainer */}
            <section className={widgetContainerClass}>
                <PureTextFindingsView findings={findings} text={text} />
            </section>
        </div>

        

        {/* bottomContainer */}
        <section className={bottomContainerClass}>
            {children}
        </section>
    </main>
  )
}

export default Llama3PureText