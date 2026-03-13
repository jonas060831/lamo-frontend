

import { useState } from 'react'
import ChatInput from '../../shared/chatInput/ChatInput'
import Messages, { type MessageProps } from '../../shared/messages/Messages'
import styles from './index.module.css'


const LandingPage = () => {

  
  const [exchange, setExchange] = useState<MessageProps>()
  const handleChatResponse = (response: MessageProps) => {
    setExchange(response)
  }

  return (
    <>
      <main 
      className={styles.container}
      >
        <section>
          <Messages exchange={exchange}/>
        </section>

        <section className={styles.chatInputContainer}>
          <ChatInput onResponse={handleChatResponse}/>
        </section>

      </main>
    </>
  )
}

export default LandingPage