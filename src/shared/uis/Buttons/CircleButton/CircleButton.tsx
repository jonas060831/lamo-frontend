
import { type FC, type ReactNode } from 'react'
import ai from '../../../../assets/svgs/ai.svg'
import loading from '../../../../assets/svgs/loading.svg'
import voice from '../../../../assets/svgs/voice.svg'
import receipt from '../../../../assets/svgs/receipt.svg'
import mic from '../../../../assets/svgs/mic.svg'
import horizontalEllipses from '../../../../assets/svgs/horizontalEllipses.svg'
import chevronUp from '../../../../assets/svgs/chevronUp.svg'
import crosshair from '../../../../assets/svgs/crosshair.svg'
import cameraFlip from '../../../../assets/svgs/cameraFlip.svg'
import close from '../../../../assets/svgs/close.svg'

import styles from './CircleButton.module.css'

export type CircleButtonProps = {
    iconName: 'ai' | 'loading' | 'voice' | 'receipt' | 'mic' | 'horizontalEllipses' | 'chevronUp' | 'animatingVoiceBars' | 'crosshair' | 'cameraFlip' | "close"
    variant?: 'dynamic' | 'dark' | 'light' | 'success' | 'danger' | 'info' | 'link' | "transparent"
    iconSize: number
    type?: 'button' | 'submit'
    element?: ReactNode
    handleClick?: () => void
}

const CircleButton:FC<CircleButtonProps> = ({ iconName, variant='dynamic',iconSize, type='button', element, handleClick }) => {

  const renderIcon = () => {

    const iconMap = {
        'ai' : ai,
        'loading' : loading,
        'voice' : voice,
        'receipt' : receipt,
        'mic' : mic,
        'horizontalEllipses' : horizontalEllipses,
        'chevronUp' : chevronUp,
        'crosshair' : crosshair,
        'cameraFlip' : cameraFlip,
        'close' : close
    }

    const svgSource = iconName === 'animatingVoiceBars' ? null :iconMap[iconName]
    return (
        <img
         className='svg'
         src={svgSource!}
         width={`${iconSize}px`}
         height='auto'
        />
    )
  }


  if(iconName === 'animatingVoiceBars') {
      return (
        <button 
          className={`${styles.button} ${styles[variant]}`}
          type={type}
          disabled={false}
          onClick={handleClick}
          >
              {element}
          </button>
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