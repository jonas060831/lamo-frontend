import { useState } from "react"
import useSpeechRecognition from "../../hooks/useSpeechRecognition"
import VoiceInput from "../../shared/voiceInput/VoiceInput"

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

   const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const handleProcessStatus = (isProccesing: boolean) => {
    setIsLoading(isProccesing)
  }

  return (
    <main className={containerClass}>
        {
            hasRecognitionSupport ? (
                <>
                    <section className={diarizationDisplayClass}>
                            {text}
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