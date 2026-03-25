import { useEffect, useRef, useState } from "react"
import CircleButton from "../uis/Buttons/CircleButton/CircleButton"

const ReceiptCamera = ({ onClose , onCapture }: { onClose: () => void; onCapture: (imageData: string) => void; }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

  const startCamera = async () => {
    try {
      console.log("Starting camera:", facingMode)

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode }
        }
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }

    } catch (err) {
      console.error("Camera error:", err)
    }
  }

  useEffect(() => {
    startCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [facingMode])

  const toggleCamera = () => {
    setFacingMode(prev => (prev === "user" ? "environment" : "user"))
  }

  const captureImage = () => {
    if (!videoRef.current) return

    const video = videoRef.current

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // convert to image
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9)

    onCapture(imageDataUrl)

    onClose()
    }

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "none" }}>
      
      {/* Camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />


      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none"
        }}
      >
        <div
          style={{
            width: "78%",   
            height: "84%",  
            marginTop: '-3rem',
            border: "3px solid white",
            borderRadius: "12px"
          }}
        />
      </div>

      {/* Flip */}
      <div
        style={{
          position: "absolute",
          bottom: 35,
          left: 30,
          right: 30,
          zIndex: 10,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '2rem'
        }}
      >
        <CircleButton iconName="cameraFlip" iconSize={40} handleClick={toggleCamera} variant="transparent" />
        <CircleButton iconName="circleDot" iconSize={40} handleClick={captureImage} variant="transparent"/>
      </div>

      {/* Close */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 20,
          zIndex: 10
        }}
      >
        <CircleButton iconName="close" iconSize={20} handleClick={onClose} variant="transparent" />
      </div>


      
    </div>
  )
}

export default ReceiptCamera