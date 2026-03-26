import { useEffect, useRef, useState } from "react"

import cameraFlip from '../../assets/svgs/cameraFlip.svg'
import close from '../../assets/svgs/close.svg'
import circleDot from '../../assets/svgs/circleDot.svg'

export type CaptureResultType = {
    preview: string
    blob: Blob
}

const ReceiptCamera = ({ onClose , onCapture }: { onClose: () => void; onCapture: (data: CaptureResultType) => void; }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

  const overlayRef = useRef<HTMLDivElement>(null)

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

  const toggleCamera = () => {
    setFacingMode(prev => (prev === "user" ? "environment" : "user"))
  }

  const captureImage = () => {
    if (!videoRef.current || !overlayRef.current) return

    const video = videoRef.current
    const overlay = overlayRef.current

    // DOM dimensions
    const videoRect = video.getBoundingClientRect()
    const overlayRect = overlay.getBoundingClientRect()

    // scale from DOM → actual video pixels
    const scaleX = video.videoWidth / videoRect.width
    const scaleY = video.videoHeight / videoRect.height

    // calculate crop area
    const cropX = (overlayRect.left - videoRect.left) * scaleX
    const cropY = (overlayRect.top - videoRect.top) * scaleY
    const cropWidth = overlayRect.width * scaleX
    const cropHeight = overlayRect.height * scaleY

    // draw to canvas
    const canvas = document.createElement("canvas")
    canvas.width = cropWidth
    canvas.height = cropHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(
        video,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
    )

    const preview = canvas.toDataURL("image/jpeg", 0.9)

    canvas.toBlob((blob) => {
        
        if(!blob) return
        //send to parent
        onCapture({preview, blob })

    }, "image/jpeg", 0.9)

    onClose()
   }

  useEffect(() => {
    startCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [facingMode])

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
        {/* overlay */}
        <div
         ref={overlayRef}
         style={{
          width: "78%",   
          height: "85%",  
          marginTop: '-3rem',
          border: "3px solid white",
          borderRadius: "12px"
        }}
        />
      </div>

      {/* bottom container */}
      <div
        style={{
          position: "absolute",
          bottom: 42,
          left: 30,
          right: 30,
          zIndex: 10,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '2rem'
        }}
      >
        <img
         src={cameraFlip}
         style={{ width: '40px', height: 'auto' }}
         onClick={toggleCamera}
        /> 

        <img
         src={circleDot}
         style={{ width: '40px', height: 'auto' }}
         onClick={captureImage}
        /> 
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
        <img
         src={close}
         style={{ width: '30px', height: 'auto' }}
         onClick={onClose}
        />
      </div>


      
    </div>
  )
}

export default ReceiptCamera