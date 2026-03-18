import { useState, type ChangeEvent } from 'react'
import CircleButton from '../../shared/uis/Buttons/CircleButton/CircleButton'
import styles from './index.module.css'

import * as lamoService from '../../services/lamoService'
import TextArea from '../../shared/uis/Inputs/TextArea/TextArea'
import TextFindingView from '../../shared/widgets/TextFindingView/TextFindingView'


export type FindingType = {
 ai_probability: number,
 confidence: number,
 signals: string []
}
const PureTextPage = () => {

  const [text, setText] = useState<string>('')
  const [findings, setFindings] = useState<FindingType | null>(null)
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
    <main className={styles.container}>

        <div className={styles.topContainer}>
          
          <div className={styles.textInputCheck}>
            <TextArea
             name='textToProcess'
             id='1'
             value={text}
             handleChange={handleChange}
             placeholder="Paste your text here to check for AI generation"
            />
            
            <div className={styles.buttonContainer}>
              <CircleButton iconName={isLoading ? 'loading' : 'crosshair'} iconSize={20} handleClick={handleProcessText}/>
            </div>
          </div>
          <div className={styles.widgetContainer}>
              <TextFindingView findings={findings} text={text} />
          </div>
          
        </div>
        <div className={styles.actionContainer}>
          {/* other actions will go here */}
        </div>
    </main>
  )
}

export default PureTextPage