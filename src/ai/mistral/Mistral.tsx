import { useState } from "react"
import useSpeechRecognition from "../../hooks/useSpeechRecognition"
import VoiceInput from "../../shared/voiceInput/VoiceInput"
import Messages, { type MessageProps } from "../../shared/messages/Messages"
import useVoiceRecorder from "../../hooks/useVoiceRecorder"

type MistralProps = {
    containerClass: string
    diarizationDisplayClass: string
    toggleMistralButtonClass: string
}
const Mistral = ({ containerClass, diarizationDisplayClass, toggleMistralButtonClass }: MistralProps) => {

  const {
    text,
    startListening,
    stopListening,
    isListening,
    /*resetText,*/
    hasRecognitionSupport
   } = useSpeechRecognition()

//    const { text, startListening, stopListening, isListening, hasRecognitionSupport } = useVoiceRecorder()

   const [exchange, setExchange] = useState<MessageProps>()

   const [isLoading, setIsLoading] = useState<boolean>(false)
  
   const handleProcessStatus = (isProccesing: boolean) => setIsLoading(isProccesing)

   const handleDiarizationResponse = (response: MessageProps) => {
    setExchange(response)
   }

  return (
    <main className={containerClass}>
        {
            hasRecognitionSupport ? (
                <>
                    <section
                     className={diarizationDisplayClass}
                     style={{ height: exchange !== undefined ? '77vh' : '0rem', marginLeft: '0rem'}}
                    >
                            {
                            <Messages
                             exchange={exchange}
                             status={isLoading}
                             notice={<></>}
                            />
                            }

                    </section>

                    <section className={toggleMistralButtonClass}>
                        {/* process each voice input */}
                        <VoiceInput
                         text={text}
                         sessionId="test_session"
                         startListening={startListening}
                         stopListening={stopListening}
                         isListening={isListening}
                         isLoading={isLoading}
                         onProcessStatus={handleProcessStatus}
                         onDiarizationResponse={handleDiarizationResponse}
                        />
                    </section>
                </>
            ) : (
                <h1>Your browser does not have speech recognition support</h1>
            )
        }
    </main >
  )
}

export default Mistral