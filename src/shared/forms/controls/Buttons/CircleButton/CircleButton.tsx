
import type { FC } from 'react'
import ai from '../../../../../assets/svgs/ai.svg'
import loading from '../../../../../assets/svgs/loading.svg'

import styles from './CircleButton.module.css'

type CircleButtonProps = {
    iconName: 'ai' | 'loading'
    variant?: 'dynamic' | 'dark' | 'light' | 'success' | 'danger' | 'info' | 'link'
    iconSize: number 
    handleClick?: () => void
}

const CircleButton:FC<CircleButtonProps> = ({ iconName, variant='dynamic',iconSize, handleClick }) => {

  const renderIcon = () => {

    const iconMap = {
        'ai' : ai,
        'loading' : loading
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
     disabled={iconName == 'loading' ? true : false}
     onClick={handleClick}
    >
        {renderIcon()}
    </button>
  )
}

export default CircleButton