import Llama3 from '../../ai/llama3/Llama3'
import styles from './index.module.css'


const LandingPage = () => {

  return (
    <Llama3
     containerClass={styles.container}
     messageDisplayClass={styles.messageDisplayContainer}
     chatInputClass={styles.chatInputContainer}
    />
  )
}

export default LandingPage