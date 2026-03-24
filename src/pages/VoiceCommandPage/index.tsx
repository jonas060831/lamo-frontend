import Mistral from "../../ai/mistral/Mistral"
import styles from './index.module.css'
import { v4 as uuidv4 } from 'uuid'

const VoiceCommandPage = () => {
  const sessionId = uuidv4()
  
  return (
    <div className={styles.container}>
        <Mistral
         containerClass={styles.mistralContainer}
         diarizationDisplayClass={styles.diarizationContainer}
         toggleMistralButtonClass={styles.buttonContainer}
         sessionId={sessionId}
        />
    </div>
            
  )
}

export default VoiceCommandPage