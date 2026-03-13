
import { useState, type FC, type SubmitEvent } from 'react'
import styles from './ChatInput.module.css'
import CircleButton from '../forms/controls/Buttons/CircleButton/CircleButton'
import type { MessageProps } from '../messages/Messages'
import * as lamoService from '../../services/lamoService'

type ChatInputProps = {
    onResponse: (response: MessageProps) => void
}

const ChatInput:FC<ChatInputProps> = ({ onResponse }) => {

  const [ input, setInput ] = useState<string>('')
  
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if(!input.trim()) return

    const userMessage: MessageProps = {
        id: Date.now().toString(),
        text: input,
        sender: 'user',
        timestamp: new Date()
    }
    onResponse(userMessage)
    setInput('')

    try {
        const res = await lamoService.smartQuery(input)

        const aiResponse: MessageProps = {
            id: Date.now().toString(),
            text: res.answer,
            sender: 'ai',
            timestamp: new Date()
        }
        onResponse(aiResponse)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error'
        
        const aiResponse: MessageProps = {
            id: Date.now().toString(),
            text: errorMessage,
            sender: 'ai',
            timestamp: new Date()
        }
        onResponse(aiResponse)
    }
    

  }

  return (
    <div
     className={styles.container}
    >
        <form onSubmit={handleSubmit}>

            <input
             name='chatboxTextArea'
             onChange={(event) => setInput(event.target.value)}
             placeholder='ask me anything'
             value={input}
             autoComplete='off'
             />


            <div className={styles.buttonContainer}>
                <CircleButton iconName='ai' iconSize={30}/>
            </div>
        </form>
    </div>
  )
}

export default ChatInput