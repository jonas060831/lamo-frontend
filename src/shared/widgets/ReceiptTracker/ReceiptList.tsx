import type { ParsedReceipt } from "../../../hooks/useReceipts"
import ReceiptCard from "./ReceiptCard"



import styles from './ReceiptList.module.css'
import ReceiptsFilter from "./ReceiptsFilter"

const ReceiptList = ({ receipts }: { receipts: ParsedReceipt[] }) => {
  

  return (
    <div className={styles.container}>

        <ReceiptsFilter receipts={receipts}/>

        <div className={styles.cardContainer}>

            {
                receipts.map((receipt, index) => (
                    <ReceiptCard key={index} receipt={receipt}/>
                    
                ))
            }
        </div>
    </div>
  )
}

export default ReceiptList