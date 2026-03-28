import * as receiptService from '../../../services/receiptService'
import type { ParsedReceipt } from "../../../hooks/useReceipts"


import styles from './ReceiptCard.module.css'

import costcoLogo from '../../../assets/images/partners/costco.png'
import addOneMonth from "../../../utils/addOneMonth"
import { useEffect, useState } from "react"
import PillButton from "../../uis/Buttons/PillButton/PillButton"

import activity from '../../../assets/svgs/activity.svg'
import gitCommit from '../../../assets/svgs/gitCommit.svg'
import loadingSpinner from '../../../assets/svgs/loading.svg'


const ReceiptCard = ({ receipt }: { receipt: ParsedReceipt }) => {


  const [priceDropData, setPriceDropData] = useState<{ totalBack: number, qualifiedItems: number } | null>(null)

  const companyLogo: Record<string, string> = {
    costco: costcoLogo
  }

  useEffect(() => {
    const getData = async () => {
        try {
            const data = await receiptService.computePriceDrop(receipt.items, receipt.company, receipt.storeNumber)

            setPriceDropData(data)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Server Error'
            
            console.log(errorMessage)
        }
    }

    getData()
  }, [receipt])

  if(!priceDropData) return (
    <div className={styles.container}>
        <img src={loadingSpinner}  style={{ width: '3rem' }}/>
    </div>
  )
  

  return (
    <div className={styles.container}>

        {/* logo */}
        <div style={{ display: 'flex', flexDirection: 'row',justifyContent: 'space-between' }}>
            <img src={companyLogo[receipt.company]} alt={receipt.company} style={{ width: '6rem' }}/>
            {
                priceDropData.totalBack > 0 ? (
                    <div>
                        <PillButton title="Ready to claim" iconName="checkMark" variant='success' />
                    </div>
                ) : (
                    <div>
                        <PillButton title="Tracking Prices" variant="info" iconName="crosshair"/>
                    </div>
                )
            }
        </div>
        
        {
            priceDropData.totalBack > 0 ? (
                <span style={{ fontSize: 'large' }}>
                    <span style={{ color: 'green', fontWeight: 'bolder',  marginRight: '0.3rem' }}>${priceDropData.totalBack.toFixed(2)}</span>
                    back
                </span>
            ) : (
                <span style={{ visibility: 'hidden' }}>|</span>
            )
        }
        <h3>You spent: $ {receipt.total?.toFixed(2)}</h3>

        <div style={{ color: 'gray' }} className={styles.priceDropIndicator}>
            {
                priceDropData.qualifiedItems > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={activity} style={{ width: '1.5rem', marginRight: '0.2rem' }}/>

                        {priceDropData.qualifiedItems} item{ priceDropData.qualifiedItems > 1 ? 's' : '' } dropped in price
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={gitCommit} style={{ width: '1.5rem', marginRight: '0.2rem' }}/>
                        No price drop found yet
                    </div>
                )
            }
        </div>

        <div className={styles.footer}>
            <span>Tracking window</span> <br />
            <span>Still tracking until: <span style={{ fontWeight: 'bolder' }}>{addOneMonth(receipt!.date!)}</span></span>
        </div>
    </div>
  )
}

export default ReceiptCard