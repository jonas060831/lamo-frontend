import { useEffect, useRef, useState } from "react"

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

export type ListeningState = true | false | "starting"
 

const useSpeechRecognition = () => {

  const recognitionRef = useRef<any>(null)
  const shouldRestartRef = useRef(false)

  const [text, setText] = useState("")
  const [isListening, setIsListening] = useState<ListeningState>(false)

  const hasRecognitionSupport = !!SpeechRecognition

  useEffect(() => {
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognitionRef.current = recognition

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const last = event.results[event.results.length - 1]

      if (last.isFinal) {
        setText(last[0].transcript)
      }
    }

    recognition.onend = () => {
      if (shouldRestartRef.current) {
        setTimeout(() => recognition.start(), 200)
      } else {
        setIsListening(false)
      }
    }
    recognition.onerror = async (event: any) => {
      setIsListening(false)
      console.log(event.error)
      console.log('error here')
    }

  }, [])

  const startListening = () => {
    const recognition = recognitionRef.current
    if (!recognition) return

    shouldRestartRef.current = true
    setIsListening("starting")
    setTimeout(() => {
        recognition.start()
    },1000)
  }

  const stopListening = () => {
    const recognition = recognitionRef.current
    if (!recognition) return

    shouldRestartRef.current = false
    
    setIsListening("starting")
    setTimeout(() => {
        setIsListening(false)
        recognition.stop()
    },1000)
  }

  const requestPermission = () => {
    const recognition = recognitionRef.current
    if (!recognition) return

    try {
      recognition.start()

      // stop immediately after permission is granted
      setTimeout(() => {
        recognition.stop()
      }, 100)

    } catch (err) {
      console.warn("Permission request failed", err)
    }
  }

  const resetText = () => {
    setText('')
  }

  return {
    text,
    isListening,
    startListening,
    stopListening,
    resetText,
    hasRecognitionSupport,  
    requestPermission,
  }
}

export default useSpeechRecognition
