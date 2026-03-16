
import { useState, type FC, type SubmitEvent } from 'react'
import styles from './ChatInput.module.css'
import CircleButton from '../uis/Buttons/CircleButton/CircleButton'
import type { MessageProps } from '../messages/Messages'
import * as lamoService from '../../services/lamoService'
import Popover from '../uis/navigational/Popover/Popover'

type ChatInputProps = {
    onResponse: (response: MessageProps) => void
    onResponseStatus: (isLoading: boolean) => void
}

const ChatInput:FC<ChatInputProps> = ({ onResponse, onResponseStatus }) => {

  const [ input, setInput ] = useState<string>('')
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [sessionId] = useState(() => `session_${Date.now()}`); // Unique session ID
  
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if(!input.trim()) return

    setIsLoading(true)
    onResponseStatus(true)
    const userMessage: MessageProps = {
        id: (Date.now() + 1).toString(),
        text: input,
        sender: 'user',
        timestamp: new Date()
    }
    onResponse(userMessage)
    setInput('')

    try {
        const res = await lamoService.smartQuery(input, sessionId)

        const aiResponse: MessageProps = {
            id: Date.now().toString(),
            text: res.answer || res.error || 'I could not process your request.',
            sender: 'ai',
            timestamp: new Date()
        }
        onResponse(aiResponse)
        onResponseStatus(false)
        setIsLoading(false)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error'
        
        const aiResponse: MessageProps = {
            id: Date.now().toString(),
            text: errorMessage,
            sender: 'ai',
            timestamp: new Date()
        }
        onResponse(aiResponse)
        onResponseStatus(false)
        setIsLoading(false)
    }
  }

  const handlePopoverMenu = () => {

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
            
            <div className={styles.moreContainer}>
                
                <Popover
                 direction='top-left'
                 trigger={
                    <CircleButton
                     variant='link'
                     iconName='chevronUp'
                     iconSize={20}
                     handleClick={handlePopoverMenu}
                    />
                 }
                >
                    <div>
                     <button>Voice</button>
                      <hr />
                     <button>Costco Receipt</button>
                     <hr />
                     <button>...</button>   
                    </div>
                </Popover>
            </div>

            <div className={styles.sendContainer}>
                <CircleButton iconName={isLoading ? 'loading' : 'ai'} iconSize={30}/>
            </div>

        </form>
    </div>
  )
}

export default ChatInput