import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import * as lamoService from '../../services/lamoService'
import { type ListeningState } from "../../hooks/useSpeechRecognition"
import CircleButton from "../uis/Buttons/CircleButton/CircleButton"
import type { MessageProps } from "../messages/Messages"
import { Dock } from "../uis/navigational/Dock/Dock"
import { useNavigate } from "react-router"
import Tooltip from "../uis/informational/Tooltip/Tooltip"
import VoiceBars from "../uis/informational/VoiceBars/VoiceBars"
import { getDeviceInfo } from "../../utils/regex/deviceCheck"

type VoiceInputProps = {
  text: string
  sessionId: string
  startListening: () => void
  stopListening: () => void
  isListening: ListeningState
  isLoading: boolean
  onProcessStatus: (isLoading: boolean) => void
  onDiarizationResponse: (response: MessageProps) => void
}

const SILENT_WAV = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"



const VoiceInput = ({
  text,
  sessionId,
  startListening,
  stopListening,
  isListening,
  isLoading,
  onProcessStatus,
  onDiarizationResponse
}: VoiceInputProps) => {



  const lastTextRef = useRef("")
  const navigate = useNavigate()
  const { isSafari, isMobileOrTablet } = getDeviceInfo()

  const [highlightedIndex, setHighlightedIndex] = useState(1)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  // On Safari, this Audio element is created + .play()'d synchronously during
  // the tap gesture. When the real audio arrives we pause it, swap the src,
  // and play again — Safari allows this because the element itself was
  // gesture-activated. A new Audio() created later (outside a gesture) would be blocked.
  const mobileOrTableAudioRef = useRef<HTMLAudioElement | null>(null)

  const [_, setAnalyserReady] = useState(false)

  const isProcessingRef = useRef(false)
  const ignoreUntilRef = useRef(0)

  const unlockAudio = () => {
    if (!isSafari) {
      // Chrome/Firefox: unlock AudioContext
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContext()
      }
      audioCtxRef.current.resume()
      return
    }

    // Safari: create the Audio element we'll reuse for real playback,
    // and call .play() on it NOW while still inside the gesture.
    // Safari permanently gesture-activates this specific element instance.
    const audio = new Audio(SILENT_WAV)
    audio.volume = 0
    mobileOrTableAudioRef.current = audio
    audio.play().catch(() => {/* ignore — element is now gesture-unlocked */})
  }

  useEffect(() => {
    if (!text || text === lastTextRef.current) return
    if (isProcessingRef.current) return
    if (Date.now() < ignoreUntilRef.current) return
    if (text.trim().length < 3) return

    lastTextRef.current = text
    isProcessingRef.current = true
    onProcessStatus(true)

    const userQuery: MessageProps = {
      id: uuidv4(),
      text,
      sender: 'user-voice',
      timestamp: new Date()
    }

    onDiarizationResponse(userQuery)

    const processRequest = async () => {
      try {
        const res = await lamoService.voiceQuery(text, sessionId)

        const aiAnswer: MessageProps = {
          id: uuidv4(),
          text: res.answer || res.error || 'I could not process your request.',
          audioString: res.audio,
          sender: 'ai-voice',
          timestamp: new Date(),
          usedContext: res.used_context,
          usedWebSearch: res.used_web_search
        }

        onDiarizationResponse(aiAnswer)

        const estimatedDuration = (res.audio.length / 16000) * 1000
        let ended = false

        const cleanup = () => {
          if (ended) return
          ended = true
          setIsSpeaking(false)
          ignoreUntilRef.current = Date.now() + 800
          isProcessingRef.current = false
          onProcessStatus(false)
        }

        setTimeout(cleanup, estimatedDuration + 500)

        if (isMobileOrTablet) {
          // Reuse the gesture-unlocked Audio element from the tap.
          // Pause it (it was playing a silent clip), swap in the real src,
          // then play. Safari allows this because the element was activated
          // during the tap — it does NOT check gestures on subsequent .play() calls
          // on the same already-unlocked element.
          const audio = mobileOrTableAudioRef.current ?? new Audio()
          audio.pause()
          audio.volume = 1
          audio.src = "data:audio/wav;base64," + res.audio

          //set up audio context + analyser for voicebars
          if(!audioCtxRef.current || audioCtxRef.current.state == 'closed') {
            audioCtxRef.current = new AudioContext()
          }

          const ctx = audioCtxRef.current
          await ctx.resume()

          const analyser = ctx.createAnalyser()
          analyser.fftSize = 64

          const source = ctx.createMediaElementSource(audio)
          source.connect(analyser)
          analyser.connect(ctx.destination)

          analyserRef.current = analyser
          setAnalyserReady(prev => !prev)

          audio.onplay = () => {
            ctx.resume()
            setTimeout(() => setIsSpeaking(true), 50)
          }

          audio.onended = cleanup

          await audio.play().catch(err => {
            console.log("Playback failed:", err)
            cleanup()
          })

        } else {
          // Chrome / Firefox: fresh Audio element + Web Audio graph for VoiceBars
          const audio = new Audio("data:audio/wav;base64," + res.audio)

          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
            audioCtxRef.current = new AudioContext()
          }
          const ctx = audioCtxRef.current
          await ctx.resume()

          const analyser = ctx.createAnalyser()
          analyser.fftSize = 64

          const source = ctx.createMediaElementSource(audio)
          source.connect(analyser)
          analyser.connect(ctx.destination)

          audioCtxRef.current = ctx
          analyserRef.current = analyser
          setAnalyserReady(prev => !prev)

          audio.onplay = () => {
            ctx.resume()
            setTimeout(() => setIsSpeaking(true), 50)
          }
          audio.onended = cleanup

          await audio.play().catch(err => {
            console.log("Playback failed:", err)
            cleanup()
          })
        }

      } catch (err) {
        console.log(err)
        isProcessingRef.current = false
        onProcessStatus(false)
      }
    }

    processRequest()

  }, [text])

  const aiSelection = [
    {
      label: "Chat",
      component: (
        <CircleButton iconName="ai" iconSize={20} handleClick={() => navigate("/")} />
      )
    },
    {
      label: "Tap to Speak",
      component: (
        <CircleButton
          iconName={isLoading ? "loading" : "mic"}
          iconSize={20}
          handleClick={() => {
            unlockAudio()

            navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
              }
            })
              .then(() => startListening())
              .catch((error) => {
                console.log('Mic permission denied:', error)
                onProcessStatus(false)
              })
          }}
        />
      )
    },
    {
      label: "Pure Text",
      component: (
        <CircleButton
          iconName="crosshair"
          iconSize={20}
          handleClick={() => navigate('/pure-text', { replace: true })}
        />
      )
    },
    {
      label: "Receipts",
      component: (
        <CircleButton iconName="receipt" iconSize={20} />
      )
    },
  ]

  switch (isListening) {
    case false:
      return (
        <Dock
          highlightedIndex={highlightedIndex}
          items={aiSelection}
          setHighlightedIndex={setHighlightedIndex}
        />
      )

    case "starting":
      return (
        <Tooltip text="Starting...">
          <CircleButton iconName="loading" iconSize={50} />
        </Tooltip>
      )

    case true:
      return (
        <Tooltip text={
          isSpeaking
            ? "Speaking..."
            : isLoading
            ? "Thinking..."
            : "Listening..."
        }>
          {isSpeaking && analyserRef.current ? (
            <CircleButton
              iconName="animatingVoiceBars"
              iconSize={50}
              element={
                <VoiceBars
                  analyser={analyserRef.current}
                  width={50}
                  height={50}
                />
              }
            />
          ) : (
            <CircleButton
              iconName={isLoading ? "loading" : "voice"}
              iconSize={50}
              handleClick={stopListening}
            />
          )}
        </Tooltip>
      )

    default:
      return null
  }
}

export default VoiceInput 