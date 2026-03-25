import { useEffect, useRef, useState } from "react"
import CircleButton from "../uis/Buttons/CircleButton/CircleButton"

const ReceiptCamera = ({ onClose }: { onClose?: () => void }) => {
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
            height: "80%",  
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
          left: 20,
          padding: "10px 16px",
          zIndex: 10
        }}
      >
        <CircleButton iconName="cameraFlip" iconSize={40} handleClick={toggleCamera} variant="transparent" />
      </div>

      {/* Close */}
      <div
        style={{
          position: "absolute",
          top: 20,
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