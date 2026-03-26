import { useEffect, useState } from 'react'
import styles from './index.module.css'
import * as receiptService from '../../services/receiptService'
import loadingSvg from '../../assets/svgs/loading.svg'
import ReceiptCamera, { type CaptureResultType } from '../../shared/receiptCamera/ReceiptCamera'
import { getDeviceInfo } from '../../utils/regex/deviceCheck'
import PillButton from '../../shared/uis/Buttons/PillButton/PillButton'


const ReceiptTrackerPage = () => {

  
  //fetch if any receipts

  //if none show add receipt empty page

  //if there is group them by company and show how many receipt is being track in card

  const [receipts ,setReceipts] = useState<null | []>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const { isMobileOrTablet } = getDeviceInfo()

  useEffect(() => {

    const fetchReceipts = async () => {

        try {
            
            const data = await receiptService.index()

            setReceipts(data)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Server Error'
            console.log(errorMessage)
        }
    }

    fetchReceipts()
  }, [])

  const handleCapture = (data: CaptureResultType) => {
    
    const { preview, blob } = data
    console.log(blob)
    setPreview(preview)
  }

  
  if(!receipts) return (
    <div className={styles.container}>

        <img src={loadingSvg} className='svg' width={80}/>
    </div>
  )

  if(receipts.length === 0) return (
    <div className={styles.container}>

        {
            isMobileOrTablet ? (
                <div>
                    {
                        preview && (
                            <img
                            src={preview}
                            alt='receipt preview'
                            style={{ width: '50%', borderRadius: '12px' }}
                            />
                        )
                    }
                    
                    <PillButton title='Add Receipt' iconName='upload' handleClick={() => setShowCamera(true)} />

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
                                <ReceiptCamera onCapture={handleCapture} onClose={() => setShowCamera(false)}/>
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

  return (
    <div
     className={styles.container}
    >
        
    </div>
  )
}

export default ReceiptTrackerPage