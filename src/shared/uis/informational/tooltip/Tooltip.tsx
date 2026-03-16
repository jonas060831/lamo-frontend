

import type { ReactNode } from 'react'
import styles from './Tooltip.module.css'


type TooltipProps = {
    text: string | null
    children: ReactNode
}
const Tooltip = ({text, children}: TooltipProps) => {
  return (
    <div
     className={styles.tooltip}
    >
        {children}
        <div className={styles.tooltiptext}>{text}</div>
    </div>
  )
}

export default Tooltip