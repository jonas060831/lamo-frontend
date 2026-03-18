import Llama3Chat from '../../ai/llama3/Llama3Chat'
import styles from './index.module.css'


const LandingPage = () => {

  return (
    <Llama3Chat
     containerClass={styles.container}
     messageDisplayClass={styles.messageDisplayContainer}
     chatInputClass={styles.chatInputContainer}
    />
  )
}

export default LandingPage