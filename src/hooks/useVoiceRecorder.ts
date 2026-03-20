import { useEffect, useRef, useState } from "react"

export type ListeningState = true | false | "starting"

const useVoiceRecorder = () => {

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const [text, setText] = useState("")
  const [isListening, setIsListening] = useState<ListeningState>(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const silenceTimerRef = useRef<number | null>(null)
  const isStoppingRef = useRef(false)

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop()
      streamRef.current?.getTracks().forEach(track => track.stop())
    }
  }, [])

  const startListening = async () => {

    if (isListening === true) return

    // Reset old states
    isStoppingRef.current = false
    cleanupAudio()
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    chunksRef.current = []

    setIsListening("starting")

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    streamRef.current = stream

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm"
    })

    chunksRef.current = []
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.onstart = () => {
      setIsListening(true)
    }

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = async () => {
      isStoppingRef.current = false
      cleanupAudio()

      try {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm"
        })

        if (blob.size === 0) {
          setIsListening(false)
          return
        }

        const formData = new FormData()
        formData.append("audio", blob)

        const res = await fetch(`${import.meta.env.VITE_LAMO_AI_SERVER_URL}/transcribe-audio`, {
          method: "POST",
          body: formData
        })

        const data = await res.json()
        const finalText = data.text?.trim()

        if (finalText) {
          setText(finalText)
        }

      } catch (err) {
        console.error("Transcription failed", err)
      } finally {
        setIsListening(false)
      }
    }

    mediaRecorder.start()

    startSilenceDetection(stream)
  }

  const startSilenceDetection = (stream: MediaStream) => {
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)

    source.connect(analyser)
    analyser.fftSize = 2048

    const dataArray = new Uint8Array(analyser.fftSize)

    audioContextRef.current = audioContext
    analyserRef.current = analyser

    let silenceStart: number | null = null
    let hasSpoken = false

    const checkSilence = () => {
      analyser.getByteTimeDomainData(dataArray)

      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        const val = (dataArray[i] - 128) / 128
        sum += val * val
      }

      const rms = Math.sqrt(sum / dataArray.length)

      const SILENCE_THRESHOLD = 0.02
      const SILENCE_DURATION = 1500

      if (rms > SILENCE_THRESHOLD) {
        hasSpoken = true
        silenceStart = null
      } else {
        if (!hasSpoken) {
          silenceStart = null
        } else {
          if (!silenceStart) {
            silenceStart = Date.now()
          } else {
            const elapsed = Date.now() - silenceStart

            if (elapsed > SILENCE_DURATION) {
              stopListening()
              return
            }
          }
        }
      }

      silenceTimerRef.current = requestAnimationFrame(checkSilence)
    }

    checkSilence()
  }

  const cleanupAudio = () => {
    if (silenceTimerRef.current) {
      cancelAnimationFrame(silenceTimerRef.current)
      silenceTimerRef.current = null
    }

    analyserRef.current?.disconnect()
    analyserRef.current = null

    audioContextRef.current?.close()
    audioContextRef.current = null
  }

  const stopListening = () => {
    if (isStoppingRef.current) return
    isStoppingRef.current = true

    const recorder = mediaRecorderRef.current

    if (recorder && recorder.state === "recording") {
      recorder.stop()
    }

    // ✅ FIX: stop mic stream
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null

    cleanupAudio()

    setIsListening(false)
  }

  const resetText = () => {
    setText("")
  }

  return {
    text,
    isListening,
    startListening,
    stopListening,
    resetText,
    hasRecognitionSupport: true
  }
}

export default useVoiceRecorder