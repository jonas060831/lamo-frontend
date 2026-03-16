
import type { FC } from 'react'
import ai from '../../../../assets/svgs/ai.svg'
import loading from '../../../../assets/svgs/loading.svg'
import voice from '../../../../assets/svgs/voice.svg'
import receipt from '../../../../assets/svgs/receipt.svg'
import mic from '../../../../assets/svgs/mic.svg'
import horizontalEllipses from '../../../../assets/svgs/horizontalEllipses.svg'
import chevronUp from '../../../../assets/svgs/chevronUp.svg'

import styles from './CircleButton.module.css'

export type CircleButtonProps = {
    iconName: 'ai' | 'loading' | 'voice' | 'receipt' | 'mic' | 'horizontalEllipses' | 'chevronUp'
    variant?: 'dynamic' | 'dark' | 'light' | 'success' | 'danger' | 'info' | 'link'
    iconSize: number
    type?: 'button' | 'submit'
    handleClick?: () => void
}

const CircleButton:FC<CircleButtonProps> = ({ iconName, variant='dynamic',iconSize, type='button',handleClick }) => {

  const renderIcon = () => {

    const iconMap = {
        'ai' : ai,
        'loading' : loading,
        'voice' : voice,
        'receipt' : receipt,
        'mic' : mic,
        'horizontalEllipses' : horizontalEllipses,
        'chevronUp' : chevronUp
    }

    const svgSource = iconMap[iconName]
    return (
        <img
         className='svg'
         src={svgSource}
         width={`${iconSize}px`}
         height='auto'
        />
    )
  }

  return (
    <button 
     className={`${styles.button} ${styles[variant]}`}
     type={type}
     disabled={iconName == 'loading' ? true : false}
     onClick={handleClick}
    >
        {renderIcon()}
    </button>
  )
}

export default CircleButton