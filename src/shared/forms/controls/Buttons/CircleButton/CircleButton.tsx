
import type { FC } from 'react'
import ai from '../../../../../assets/svgs/ai.svg'

import styles from './CircleButton.module.css'

type CircleButtonProps = {
    iconName: 'ai'
    variant?: 'dynamic' | 'dark' | 'light' | 'success' | 'danger' | 'info' | 'link'
    iconSize: number 
    handleClick?: () => void
}

const CircleButton:FC<CircleButtonProps> = ({ iconName, variant='dynamic',iconSize, handleClick }) => {

  const renderIcon = () => {

    const iconMap = {
        'ai' : ai
    }

    const svgSource = iconMap[iconName]
    return (
        <img
         src={svgSource}
         width={`${iconSize}px`}
         height='auto'
        />
    )
  }

  return (
    <button 
     className={`${styles.button} ${styles[variant]}`}
     onClick={handleClick}
    >
        {renderIcon()}
    </button>
  )
}

export default CircleButton