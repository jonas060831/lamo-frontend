import { useEffect } from "react"

import * as lamoService from '../../services/lamoService'
import { type ListeningState } from "../../hooks/useSpeechRecognition"
import CircleButton from "../forms/controls/Buttons/CircleButton/CircleButton"

import styles from './VoiceInput.module.css'

type VoiceInputProps = {
    text: string
    sessionId: string
    startListening: () => void,
    stopListening: () => void,
    isListening: ListeningState,
    isLoading: boolean,
    onProcessStatus: (isLoading: boolean) => void
}

const VoiceInput = ({text, sessionId, startListening, stopListening, isListening, isLoading, onProcessStatus }:VoiceInputProps) => {


    useEffect(() => {

        if(!text) return
        onProcessStatus(true)
        const processRequest = async () => {
                try {
                const res = await lamoService.voiceQuery(text, sessionId)

                console.log(res)
                onProcessStatus(false)
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
                    <CircleButton iconName='mic' iconSize={50} handleClick={startListening}/>
                    <div className={styles.tooltiptext}> Tap to Speak </div>
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