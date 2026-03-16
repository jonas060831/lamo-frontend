

import CircleButton from '../../uis/Buttons/CircleButton/CircleButton'

import styles from './index.module.css'

import type { CircleButtonProps } from '../../uis/Buttons/CircleButton/CircleButton'
import { useNavigate } from 'react-router'

const aiOptions: { iconName: CircleButtonProps['iconName'], text: string, url: string }[] = [
    {
        iconName: 'voice',
        text: 'Try Voice',
        url: '/voice'
    },
    {
        iconName: 'receipt',
        text: 'Track Your Costco Receipt',
        url: '/costco-receipt'
    }
]


const AuthenticatedOptions = () => {
  
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {
            aiOptions.map((option, index) => (
                
                <div
                 key={index}
                 onClick={() => navigate(option.url)}
                 className={styles.card}
                >
                    
                    <CircleButton
                     iconName={option.iconName}
                     iconSize={30}
                    />
                    
                    {option.text}
                </div>
            ))
        }
    </div>
  )
}

export default AuthenticatedOptions