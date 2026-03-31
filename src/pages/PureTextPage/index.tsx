import { useState } from 'react'
import Llama3PureText from '../../ai/llama3/Llama3PureText'
import { Dock } from '../../shared/uis/navigational/Dock/Dock'

import styles from './index.module.css'
import CircleButton from '../../shared/uis/Buttons/CircleButton/CircleButton'
import { useNavigate } from 'react-router'

const PureTextPage = () => {

  const navigate = useNavigate()

  const [highlightedIndex, setHighlightedIndex] = useState(2)


  const aiSelection = [
        {
            label: "Chat",
            component: (
            <CircleButton
                iconName="ai"
                iconSize={20}
                handleClick={() => navigate("/")}
            />
            ),
        },
        {
            // label: isLoading ? undefined : "Tap to Speak",
            label: 'Voice',
            component: (
              <CircleButton
                iconName='voice'
                iconSize={20}
                handleClick={() => navigate('/voice', { replace: true })}
              />
            )
        },
        {
            label: "Pure Text",
            component: 
            <CircleButton
             iconName="crosshair"
             iconSize={20}
             handleClick={() => navigate("/pure-text", { replace: true })}
            />,
        },
        {
            label: "Receipts",
            component:
            <CircleButton
             iconName="receipt"
             iconSize={20}
             handleClick={() => navigate('/receipt-tracker', { replace: true })}
            />,
        },
    ];


  return (
    <>
      <Llama3PureText
        containerClass={styles.container}
        topContainerClass={styles.topContainer}
        formContainerClass={styles.formContainer}
        widgetContainerClass={styles.widgetContainer}
        bottomContainerClass={styles.bottomContainer}
        >
          {/* other actions to modify result */}
      </Llama3PureText>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-2rem' }}>
        <Dock highlightedIndex={highlightedIndex} items={aiSelection} setHighlightedIndex={setHighlightedIndex}/>
      </div>
    </>
  )
}

export default PureTextPage