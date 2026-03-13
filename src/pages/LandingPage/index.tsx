

import { useState } from 'react'
import ChatBox from '../../shared/chatbox/ChatBox'
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

        <section className={styles.chatContainer}>
          <ChatBox onResponse={handleChatResponse}/>
        </section>

      </main>
    </>
  )
}

export default LandingPage