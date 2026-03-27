import type { ParsedReceipt } from "../../../hooks/useReceipts"

import styles from './ReceiptsFilter.module.css'

const ReceiptsFilter = ({ receipts }: { receipts: ParsedReceipt[] }) => {

  console.log(receipts)
  return (
    <div className={styles.container}>
      ReceiptsFilter
    </div>
  )
}

export default ReceiptsFilter