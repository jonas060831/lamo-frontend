import ReceiptCamera, { type CaptureResultType } from "../../receiptCamera/ReceiptCamera"
import PillButton from "../../uis/Buttons/PillButton/PillButton"

interface IEmptyState {
    isMobileOrTablet: boolean
    preview: string | null
    isProcessing: boolean
    processingMessage: string | null
    showCamera: boolean
    setShowCamera: (isShowingCamera: boolean) => void
    onCapture: (data: CaptureResultType) => Promise<void>
}

const EmptyState = ({isMobileOrTablet, preview, isProcessing, processingMessage, showCamera, setShowCamera, onCapture}: IEmptyState) => {
  return (
    <div>
        {
            isMobileOrTablet ? (
                <div>
                    {
                        preview && (
                            <img
                            src={preview}
                            alt='receipt preview'
                            style={{ width: '50%', borderRadius: '12px', margin: 'auto', display: 'flex' }}
                            />
                        )
                    }

                    {
                        isProcessing ? (
                            <h3>{processingMessage}</h3>
                        ) : (
                            <PillButton title='Add Receipt' iconName='upload' handleClick={() => setShowCamera(true)} />
                        )
                    }

                    {showCamera && (
                        <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "black",
                        zIndex: 9999,
                        }}>
                            <ReceiptCamera onCapture={onCapture} onClose={() => setShowCamera(false)}/>
                        </div>
                    )}                    
                </div>
            ) : (
                <>
                upload receipt
                </>
            )
        }
    </div>
  )
}

export default EmptyState