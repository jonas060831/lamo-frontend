import { type FC } from "react"

import arrowRight from '../../../../assets/svgs/arrowRight.svg'
import loading from '../../../../assets/svgs/loading.svg'

type PillButtonProps = {
    title: string
    variant?: 'dynamic' | 'dark' | 'light' | 'success' | 'danger' | 'info' | 'link'
    iconName?: 'arrowRight' | 'loading'
    handleClick?: () => void
}

import styles from './PillButton.module.css'

const PillButton:FC<PillButtonProps> = ({ title, variant='dynamic', iconName='loading', handleClick  }) => {

  
  const renderIcon = () => {

    const iconMap = {
        'arrowRight' : arrowRight,
        'loading' : loading
    }

    const svgSource = iconMap[iconName]
    return (
        <img
         className="svg"
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
    >
        {renderIcon()}
        {title}
    </button>
  )
}

export default PillButton