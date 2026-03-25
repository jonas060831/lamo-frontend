import { useEffect, useRef, useState } from "react"

const ReceiptCamera = ({ onClose }: { onClose?: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

  const startCamera = async () => {
    try {
      // stop previous stream before switching
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Camera error:", err)
    }
  }

  useEffect(() => {
    startCamera()

    return () => {
      // cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [facingMode])

  const toggleCamera = () => {
    setFacingMode(prev => (prev === "user" ? "environment" : "user"))
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      
      {/* Camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Overlay Frame */}
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
            width: "80%",
            height: "50%",
            border: "3px solid white",
            borderRadius: "12px"
          }}
        />
      </div>

      {/* Toggle Camera Button */}
      <button
        onClick={toggleCamera}
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          padding: "10px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          zIndex: 10
        }}
      >
        Flip
      </button>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "8px 12px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          zIndex: 10
        }}
      >
        ✕
      </button>
    </div>
  )
}

export default ReceiptCamera