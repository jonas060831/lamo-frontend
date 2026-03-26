import { useEffect, useState } from 'react'
import styles from './index.module.css'
import * as receiptService from '../../services/receiptService'
import loadingSvg from '../../assets/svgs/loading.svg'
import ReceiptCamera, { type CaptureResultType } from '../../shared/receiptCamera/ReceiptCamera'
import { getDeviceInfo } from '../../utils/regex/deviceCheck'
import PillButton from '../../shared/uis/Buttons/PillButton/PillButton'

import * as lamoService from '../../services/lamoService'


const ReceiptTrackerPage = () => {

  
  //fetch if any receipts

  //if none show add receipt empty page

  //if there is group them by company and show how many receipt is being track in card

  const [receipts ,setReceipts] = useState<null | []>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [processingMessage, setProcessingMessage] = useState<null | string>(null)

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

  const handleCapture = async (data: CaptureResultType) => {
    
    const { preview, blob } = data
    

    setIsProcessing(true)
    setPreview(preview)
    const { text, success } = await sendForProcessing(blob)

    //ok response send to server for formatting and data creation dont forget to include preview
    if(success) {

        setProcessingMessage('Extraction Began..') //3. Start Extracting data
        const res = await receiptService.add({text, preview})
        
        console.log(res)

    }
    else {
        console.log(text)
    }
  }

  const sendForProcessing = async (blob: Blob):Promise<{ text: string, success: boolean }> => {

    const formData = new FormData()
    formData.append("receipt", blob, "receipt.jpg")
    setProcessingMessage('Extracting Details...') //1 send blob for TEXT extraction
    try {
        
        const textResponse = await lamoService.extractReceiptText(formData)


        setProcessingMessage('Processing Data...') //2 text extracted go to data extraction
        return {text: textResponse, success: true}

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error'
        console.log(errorMessage)
        setProcessingMessage('Error something went wrong')
        return {text: errorMessage, success: false}
    }
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