import { type FC } from "react"

import arrowRight from '../../../../assets/svgs/arrowRight.svg'
import loading from '../../../../assets/svgs/loading.svg'
import voice from '../../../../assets/svgs/voice.svg'
import horizontalEllipses from '../../../../assets/svgs/horizontalEllipses.svg'
import receipt from '../../../../assets/svgs/receipt.svg'
import userAdd from '../../../../assets/svgs/userAdd.svg'
import crosshair from '../../../../assets/svgs/crosshair.svg'
import upload from '../../../../assets/svgs/upload.svg'
import checkMark from '../../../../assets/svgs/checkmark.svg'
import chevronUp from '../../../../assets/svgs/chevronUp.svg'

type PillButtonProps = {
    title: string
    variant?: 'dynamic' | 'dark' | 'light' | 'success' | 'danger' | 'info' | 'link' | 'translucent' | 'transparent'
    iconName?: 'arrowRight' | 'loading' | 'voice' | 'horizontalEllipses' | 'receipt' | 'userAdd' | 'crosshair' | 'upload' | 'checkMark' | 'chevronUp' |'none'
    justifyContent?: 'flex-start' | 'center' | 'flexEnd'
    handleClick?: () => void
}

import styles from './PillButton.module.css'

const PillButton:FC<PillButtonProps> = ({ title, variant='dynamic', iconName='none', justifyContent='center', handleClick  }) => {

  
  const renderIcon = () => {

    const iconMap = {
        'arrowRight' : arrowRight,
        'loading' : loading,
        'voice' : voice,
        'horizontalEllipses' : horizontalEllipses,
        'receipt' : receipt,
        'userAdd' : userAdd,
        'crosshair' : crosshair,
        'upload' : upload,
        'checkMark' : checkMark,
        'chevronUp' : chevronUp,
        'none': undefined,
    }

    const svgSource = iconMap[iconName]

    const className = variant === 'success' || variant === 'info' ? 'svgWhite' : 'svg'
    return (
        <img
         className={className}
         src={svgSource}
         width='20px'
         height='auto'
        />
    )
  }

  return (
    <button 
     className={`${styles.button} ${styles[variant]}`}
     onClick={handleClick}
     style={{ justifyContent: justifyContent }}
    >
        {renderIcon()}
        {title}
    </button>
  )
}

export default PillButton