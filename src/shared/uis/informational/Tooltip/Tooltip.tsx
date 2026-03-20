

import type { ReactNode } from 'react'
import styles from './Tooltip.module.css'


type TooltipProps = {
    text?: string | null
    children: ReactNode
    component?: ReactNode  
}
const Tooltip = ({text, children, component}: TooltipProps) => {
  return (
    <div
     className={styles.tooltip}
    >
        {children}
        <div className={styles.tooltiptext}>
          {text}
          {component}
        </div>
    </div>
  )
}

export default Tooltip