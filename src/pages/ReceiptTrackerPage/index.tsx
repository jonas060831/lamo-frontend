import { useState } from 'react'
import styles from './index.module.css'
import loadingSvg from '../../assets/svgs/loading.svg'
import { getDeviceInfo } from '../../utils/regex/deviceCheck'

import EmptyState from '../../shared/widgets/ReceiptTracker/EmptyState'
import ReceiptList from '../../shared/widgets/ReceiptTracker/ReceiptList'
import { useReceipts } from '../../hooks/useReceipts'
import { useReceiptDataProcessing } from '../../hooks/useReceiptDataProcess'

import partners from '../../assets/images/header/partners.png'
import CircleButton from '../../shared/uis/Buttons/CircleButton/CircleButton'
import { useNavigate } from 'react-router'
import { Dock } from '../../shared/uis/navigational/Dock/Dock'



const ReceiptTrackerPage = () => {

  const navigate = useNavigate()

  const [highlightedIndex, setHighlightedIndex] = useState(3)
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

        <img className={styles.header} src={partners} alt='receipt empty header'/>

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

  const aiSelection = [
      {
          label: "Chat",
          component: (
          <CircleButton
              iconName="ai"
              iconSize={20}
              handleClick={() => navigate("/")}
          />
          ),
      },
      {
          // label: isLoading ? undefined : "Tap to Speak",
          label: 'Voice',
          component: (
            <CircleButton
              iconName='voice'
              iconSize={20}
              handleClick={() => navigate('/voice', { replace: true })}
            />
          )
      },
      {
          label: "Pure Text",
          component: 
          <CircleButton
            iconName="crosshair"
            iconSize={20}
            handleClick={() => navigate("/pure-text", { replace: true })}
          />,
      },
      {
          label: "Receipts",
          component:
          <CircleButton
            iconName="receipt"
            iconSize={20}
            handleClick={() => navigate('/receipt-tracker', { replace: true })}
          />,
      },
  ];


  return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    
    <EmptyState
      isMobileOrTablet={isMobileOrTablet}
      preview={preview}
      isProcessing={isProcessing}
      processingMessage={processingMessage}
      showCamera={showCamera}
      setShowCamera={setShowCamera}
      onCapture={handleCapture}
    />
    
    <ReceiptList receipts={receipts}/>
    <Dock items={aiSelection} highlightedIndex={highlightedIndex} setHighlightedIndex={setHighlightedIndex}/>
  </div>
}

export default ReceiptTrackerPage