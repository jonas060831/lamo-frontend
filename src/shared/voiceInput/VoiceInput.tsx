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

// A short silent WAV played synchronously on tap to unlock Safari's audio gate.
// Safari requires Audio.play() in the same synchronous call stack as the gesture.
// Once unlocked this way, all subsequent playback through the same AudioContext
// is permitted — even after async gaps like API calls.
const SILENT_WAV = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"

// Safari (iOS + macOS) routes AudioContext output through the ear speaker and
// blocks createMediaElementSource after async gaps. Skip Web Audio on Safari —
// a plain Audio element uses the correct speaker route and just works.
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

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

  const [highlightedIndex, setHighlightedIndex] = useState(1)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const [_, setAnalyserReady] = useState(false)

  const isProcessingRef = useRef(false)
  const ignoreUntilRef = useRef(0)

  // Must be called synchronously inside the tap handler, before any await.
  // Safari invalidates the gesture token the moment execution hits an await,
  // so audio unlocking must be the very first thing that runs on tap.
  const unlockAudio = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext()
    }
    audioCtxRef.current.resume()

    // Safari also checks the Audio element itself — play a silent clip now
    // so this element's playback is gesture-activated before any async work.
    const silent = new Audio(SILENT_WAV)
    silent.volume = 0
    silent.play().catch(() => {/* ignore */})
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

        // Fresh Audio element every turn — createMediaElementSource permanently
        // binds an element and throws InvalidStateError if called again on it.
        const audio = new Audio("data:audio/wav;base64," + res.audio)

        const estimatedDuration = (res.audio.length / 16000) * 1000

        let ended = false

        const cleanup = () => {
          if (ended) return
          ended = true

          setIsSpeaking(false)

          ignoreUntilRef.current = Date.now() + 800
          isProcessingRef.current = false
          onProcessStatus(false)

          // Do NOT close ctx — closing it revokes the unlock and would require
          // another user gesture to resume audio on the next turn.
        }

        audio.onended = cleanup

        // iOS fallback in case onended doesn't fire
        setTimeout(cleanup, estimatedDuration + 500)

        if (isSafari) {
          // Safari: plain Audio element only — no Web Audio graph.
          // createMediaElementSource routes audio through the ear speaker on iOS,
          // and breaks playback on macOS Safari after async gaps.
          audio.onplay = () => {
            setTimeout(() => {
              setIsSpeaking(true)
            }, 50)
          }

          await audio.play().catch(err => {
            console.log("Playback failed:", err)
            cleanup()
          })

        } else {
          // Chrome / Firefox: wire through Web Audio for VoiceBars visualizer.
          // Reuse the already-unlocked AudioContext from the tap.
          // Since it was resumed synchronously during the gesture, Chrome allows
          // playback through it even after async gaps.
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

            setTimeout(() => {
              setIsSpeaking(true)
            }, 50)
          }

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
            // Unlock audio SYNCHRONOUSLY before any await — this must be the
            // very first thing called. Safari drops the gesture token on the
            // first await, so getUserMedia must come after, not before.
            unlockAudio()

            navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
              }
            })
              .then(() => {
                startListening()
              })
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
          {isSpeaking && analyserRef.current && !isSafari ? (
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