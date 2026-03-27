import { useState } from 'react'
import type { ParsedReceipt } from './useReceipts'
import * as lamoService from '../services/lamoService'
import * as receiptService from '../services/receiptService'

import type { CaptureResultType } from '../shared/receiptCamera/ReceiptCamera'

export const useReceiptDataProcessing = (onSuccess: (r: ParsedReceipt) => void) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState<string | null>(null)

  const sendForProcessing = async (blob: Blob) => {
    const formData = new FormData()
    formData.append("receipt", blob, "receipt.jpg")

    setProcessingMessage('Extracting Details...')

    try {
      const response = await lamoService.extractReceiptText(formData)
      setProcessingMessage('Processing Data...')
      return { text: response.text, success: true }
    } catch (error) {
      setProcessingMessage('Error something went wrong')
      return { text: '', success: false }
    }
  }

  const handleCapture = async (data: CaptureResultType) => {
    const { preview, blob } = data

    setIsProcessing(true)
    setPreview(preview)

    const { text, success } = await sendForProcessing(blob)

    if (!success) return

    setProcessingMessage('Extraction Began..')

    try {
      const res = await receiptService.add({ text, preview })
      setProcessingMessage('Receipt Saved..')
      onSuccess(res)
    } catch (error) {
      setProcessingMessage('Failed to save receipt')
    }
  }

  return {
    preview,
    isProcessing,
    processingMessage,
    handleCapture
  }
}