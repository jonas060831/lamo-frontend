import { useState } from 'react'
import styles from './index.module.css'
import loadingSvg from '../../assets/svgs/loading.svg'
import { getDeviceInfo } from '../../utils/regex/deviceCheck'

import EmptyState from '../../shared/widgets/ReceiptTracker/EmptyState'
import ReceiptList from '../../shared/widgets/ReceiptTracker/ReceiptList'
import { useReceipts } from '../../hooks/useReceipts'
import { useReceiptDataProcessing } from '../../hooks/useReceiptDataProcess'




const ReceiptTrackerPage = () => {

  
  //fetch if any receipts

  //if none show add receipt empty page

  //if there is group them by company and show how many receipt is being track in card

  const [showCamera, setShowCamera] = useState(false)

  const { isMobileOrTablet } = getDeviceInfo()
  const { receipts, addReceipt } = useReceipts()

  const {
    preview,
    isProcessing,
    processingMessage,
    handleCapture
  } = useReceiptDataProcessing(addReceipt)

  //initial state
  if(!receipts) return (
    <div className={styles.container}>
        <img src={loadingSvg} className='svg' width={80}/>
    </div>
  )
  //no receipts yet after fetch
  if(receipts.length === 0) return (
    <div className={styles.container}>

        <EmptyState
         isMobileOrTablet={isMobileOrTablet}
         preview={preview}
         isProcessing={isProcessing}
         processingMessage={processingMessage}
         showCamera={showCamera}
         setShowCamera={setShowCamera}
         onCapture={handleCapture}
        />
    </div>
  )
  //receipts array is populated
  return <ReceiptList receipts={receipts}/>
}

export default ReceiptTrackerPage