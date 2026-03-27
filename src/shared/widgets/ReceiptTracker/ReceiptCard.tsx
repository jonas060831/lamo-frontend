import type { ParsedReceipt } from "../../../hooks/useReceipts"

import styles from './ReceiptCard.module.css'

import costcoLogo from '../../../assets/images/partners/costco.png'


const ReceiptCard = ({ receipt }: { receipt: ParsedReceipt }) => {


  const companyLogo: Record<string, string> = {
    costco: costcoLogo
  }

  return (
    <div className={styles.container}>

        {/* logo */}
        <img src={companyLogo[receipt.company]} alt={receipt.company} style={{ width: '6rem' }}/>

        <h3>You spent: $ {receipt.subtotal}</h3>

    </div>
  )
}

export default ReceiptCard