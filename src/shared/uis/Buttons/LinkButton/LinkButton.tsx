import { type FC } from "react"

import arrowRight from '../../../../assets/svgs/arrowRight.svg'
import loading from '../../../../assets/svgs/loading.svg'
import powerOff from '../../../../assets/svgs/power-off.svg'

type LinkButtonProps = {
    title: string
    iconName?: 'arrowRight' | 'loading' | 'powerOff'
    handleClick?: () => void
}

import styles from './LinkButton.module.css'

const LinkButton:FC<LinkButtonProps> = ({ title, iconName='loading', handleClick }) => {

  
  const renderIcon = () => {

    const iconMap = {
        'arrowRight' : arrowRight,
        'loading' : loading,
        'powerOff' : powerOff
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
     className={`${styles.button} ${styles.linkButton}`}
     onClick={handleClick}
    >
        {renderIcon()}
        {title}
    </button>
  )
}

export default LinkButton