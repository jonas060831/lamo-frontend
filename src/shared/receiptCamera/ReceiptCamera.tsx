import { useEffect, useRef } from "react"


const ReceiptCamera = () => {

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {

    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        if(videoRef.current) {
            videoRef.current.srcObject = stream
        }
    })
  }, [])

  return <div style={{ position: "relative", width: "100%", height: "100%" }}>
  
  {/* Camera */}
  <video
    ref={videoRef}
    autoPlay
    playsInline
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />

  {/* Overlay */}
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
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
</div>
}

export default ReceiptCamera