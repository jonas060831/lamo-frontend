import Mistral from "../../ai/mistral/Mistral"
import styles from './index.module.css'

const VoiceCommandPage = () => {

  return (
    <div className={styles.container}>
        <Mistral 
         containerClass={styles.mistralContainer}
         diarizationDisplayClass={styles.diarizationContainer}
         toggleMistralButtonClass={styles.buttonContainer}
        />
    </div>
            
  )
}

export default VoiceCommandPage