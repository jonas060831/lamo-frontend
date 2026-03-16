import { useEffect, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import * as lamoService from '../../services/lamoService'
import { type ListeningState } from "../../hooks/useSpeechRecognition"
import CircleButton from "../uis/Buttons/CircleButton/CircleButton"

import styles from './VoiceInput.module.css'
import type { MessageProps } from "../messages/Messages"

type VoiceInputProps = {
    text: string
    sessionId: string
    startListening: () => void,
    stopListening: () => void,
    isListening: ListeningState,
    isLoading: boolean,
    onProcessStatus: (isLoading: boolean) => void
    onDiarizationResponse: (response: MessageProps) => void
}

const VoiceInput = ({text, sessionId, startListening, stopListening, isListening, isLoading, onProcessStatus, onDiarizationResponse }:VoiceInputProps) => {

    const lastTextRef = useRef("")

    useEffect(() => {

        if (!text || text === lastTextRef.current) return
        lastTextRef.current = text
        
        onProcessStatus(true) //set loading to update button ui

        //lift state to parent to update message display(from user)
        const userQuery: MessageProps = {
        id: uuidv4(),
        text: text,
        sender: 'user-voice',
        timestamp: new Date()
    }
        onDiarizationResponse(userQuery)

        const processRequest = async () => {
                try {

                //stop listening on the mic first
                stopListening()
                const res = await lamoService.voiceQuery(text, sessionId)

                //lift state to parent to update message display(from ai)
                const aiAnswer: MessageProps = {
                    id: uuidv4(),
                    text: res.answer || res.error || 'I could not process your request.',
                    sender: 'ai-voice',
                    timestamp: new Date()
                } 
                onDiarizationResponse(aiAnswer)

                //testing audio play
                const audio = new Audio("data:audio/wav;base64," + res.audio)
                
                audio.onended = () => {
                    startListening()
                    onProcessStatus(false)
                }
                await audio.play() //play the string audio/wav
                
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Server Error'
                console.log(errorMessage)
            }
        }
        processRequest()
    }, [text])

    switch (isListening) {
            case false:
                return <div className={styles.tooltip}>
                    <CircleButton iconName={ isLoading ? 'loading' : 'mic' } iconSize={50} handleClick={startListening}/>
                    
                    {
                            isLoading ? null : <div className={styles.tooltiptext}>Tap to Speak</div>
                    }
                    
                </div>
            case true:
                return <div className={styles.tooltip}>
                    <CircleButton
                    iconName={isLoading ? 'loading' : 'voice'}
                    iconSize={50}
                    handleClick={stopListening}
                    />
                    
                    <div className={styles.tooltiptext}>
                        {
                            isLoading ? 'Thinking...' : 'Listening...'
                        }
                    </div>
                </div>
            default:
                return <CircleButton iconName='loading' iconSize={50} />

        }
}  

export default VoiceInput