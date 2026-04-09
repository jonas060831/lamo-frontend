import type { ParsedReceipt } from "../../../hooks/useReceipts"
import ReceiptCard from "./ReceiptCard"

import styles from './ReceiptList.module.css'

const ReceiptList = ({ receipts }: { receipts: ParsedReceipt[] }) => {

  if(receipts.length === 0) return (
    <div className={styles.container}>
        <h3>No Receipt Found Please adjust your search</h3>
    </div>
  )
  
  return (
    <div className={styles.container}>

        <div className={styles.cardContainer}>

            {
                receipts.map((receipt, index) => (
                    <ReceiptCard
                     key={index}
                     receipt={receipt}
                    />
                ))
            }
        </div>
    </div>
  )
}

export default ReceiptList