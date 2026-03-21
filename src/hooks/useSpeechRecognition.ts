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

  const isUserActivatedRef = useRef(false)

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
      // if (shouldRestartRef.current) {
      //   setTimeout(() => recognition.start(), 200)
      // } else {
      //   setIsListening(false)
      // }

      if(shouldRestartRef.current && isUserActivatedRef.current) {
        try {
          recognition.start()

        } catch (error) {
          console.log('Restart blocked:', error)
          setIsListening(false)
        }
      } else {
        setIsListening(false)
      }
    }
    recognition.onerror = async (event: any) => {

      console.log("Speech Error:", event.error)

      if(event.error === "not-allowed") {
        isUserActivatedRef.current = false
        shouldRestartRef.current = false
      }

      setIsListening(false)
    }

  }, [])

  const startListening = () => {
    const recognition = recognitionRef.current
    if (!recognition) return

    // shouldRestartRef.current = true
    // setIsListening("starting")
    // setTimeout(() => {
    //     recognition.start()
    // },1000)

    isUserActivatedRef.current = true

    shouldRestartRef.current = true

    setIsListening("starting")

    recognition.start()

    try {
      
    } catch (error) {
      console.log('Start error', error)
      setIsListening(false)
    }
  }

  const stopListening = () => {
    const recognition = recognitionRef.current
    if (!recognition) return

    shouldRestartRef.current = false
    isUserActivatedRef.current = false
    
    try {
      recognition.stop()

    } catch (error) {
      console.log("Stop error: ", error)
    }
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
