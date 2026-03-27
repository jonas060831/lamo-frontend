import { useEffect, useState } from 'react'
import * as receiptService from '../services/receiptService'


export interface ParsedItem {
  number: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ParsedReceipt {
  owner: string
  company: string
  storeNumber: string
  rawText: string
  subtotal?: number
  tax?: number
  total?: number
  items: ParsedItem[]
  date?: string
  totalItemsSold?: number
  preview?: string
}


export const useReceipts = () => {
  const [receipts, setReceipts] = useState<ParsedReceipt[] | null>(null)

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const data = await receiptService.index()
        setReceipts(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchReceipts()
  }, [])

  const addReceipt = (receipt: ParsedReceipt) => {
    setReceipts(prev => prev ? [...prev, receipt] : [receipt])
  }

  return { receipts, addReceipt }
}