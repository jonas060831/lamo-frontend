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

const VoiceInput = ({text, sessionId, startListening, stopListening, isListening, isLoading, onProcessStatus, onDiarizationResponse }:VoiceInputProps) => {
    const lastTextRef = useRef("")
    const navigate = useNavigate()
    const [highlightedIndex, setHighlightedIndex] = useState(1);
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [_, setAudioBase64] = useState("")
    const analyserRef = useRef<AnalyserNode | null>(null)
    const audioCtxRef = useRef<AudioContext | null>(null)

    const isProcessingRef = useRef(false)
    const ignoreUntilRef = useRef(0)
    
    useEffect(() => {
        if (!text || text === lastTextRef.current) return

        if(isProcessingRef.current) {
            console.log('Already processing, skipping this text')
            return
        }

        if (Date.now() < ignoreUntilRef.current) {
            console.log("🚫 Ignoring mic (cooldown)")
            return
        }

        if (text.length < 3) return // ignore tiny noise
        
        lastTextRef.current = text
        isProcessingRef.current = true
        
        onProcessStatus(true)
        //set loading to update button ui //
        // lift state to parent to update message display(from user)
        const userQuery: MessageProps = {
            id: uuidv4(),
            text: text, sender: 'user-voice',
            timestamp: new Date()
        }
        
        onDiarizationResponse(userQuery)

        const processRequest = async () => {
            try {
                    const res = await lamoService.voiceQuery(text, sessionId)
                    
                    //lift state to parent to update message display(from ai)
                    const aiAnswer: MessageProps = {
                    id: uuidv4(),
                    text: res.answer || res.error || 'I could not process your request.',
                    audioString: res.audio, sender: 'ai-voice',
                    timestamp: new Date(),
                    usedContext: res.used_context, usedWebSearch: res.used_web_search
                    }
                    
                    onDiarizationResponse(aiAnswer)
                    setAudioBase64(res.audio)
                    
                    setIsSpeaking(true)
                    //create base64 to be use for animating the voice svg file
                    //testing audio play
                    const audio = new Audio("data:audio/wav;base64," + res.audio)
                    
                    // Set up analyser BEFORE playing
                    const ctx = new AudioContext()
                    const analyser = ctx.createAnalyser()
                    
                    analyser.fftSize = 64
                    
                    const source = ctx.createMediaElementSource(audio)
                    
                    source.connect(analyser)
                    analyser.connect(ctx.destination)
                    
                    audioCtxRef.current = ctx
                    analyserRef.current = analyser
                    audio.onplay = () => {
                        ctx.resume()
                        setIsSpeaking(true)
                    }
                
                    audio.onended = () => {
                        setIsSpeaking(false)
                        
                        ignoreUntilRef.current = Date.now() + 800

                        isProcessingRef.current = false
                        onProcessStatus(false)
                        ctx.close() 
                    }
                
                // still used to trigger VoiceBars mount
                await audio.play()
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Server Error'
                console.log(errorMessage)
                isProcessingRef.current = false
                onProcessStatus(false)
            }
        }
        processRequest()

    }, [text])
    
    const aiSelection = [
        { 
            label: "Chat",
            component: ( <CircleButton iconName="ai" iconSize={20} handleClick={() => navigate("/")} /> )
        },
        { 
            // label: isLoading ? undefined : "Tap to Speak",
            label: "Tap to Speak",
            component: (
                <CircleButton
                 iconName={isLoading ? "loading" : "mic"}
                 iconSize={20}
                 handleClick={async () => {
                    try {
                        await navigator.mediaDevices.getUserMedia({ 
                            audio: {
                                echoCancellation: true,
                                noiseSuppression: true,
                                autoGainControl: true
                            }
                        })
                        startListening()
                    } catch (error) {
                        console.log('Mic permission denied:', error)
                        onProcessStatus(false)
                    }
                 }}
                />
            ),
         },
         {
            label: "Pure Text",
            component:
             <CircleButton
              iconName="crosshair"
              iconSize={20}
              handleClick={() => navigate('/pure-text', { replace: true })}
            />,
        },
        {
            label: "Receipts",
            component:
             <CircleButton
              iconName="receipt"
              iconSize={20}
            />,
        },
    ];


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
                {isSpeaking ? (
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