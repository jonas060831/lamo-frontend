

import { useState } from 'react'
import ChatInput from '../../shared/chatInput/ChatInput'
import Messages, { type MessageProps } from '../../shared/messages/Messages'
import styles from './index.module.css'


const LandingPage = () => {

  
  const [exchange, setExchange] = useState<MessageProps>()
  const [responseStatus, setResponseStatus] = useState<boolean | null>(null)

  const handleResponseStatus = (isLoading: boolean) => {
    setResponseStatus(isLoading)
  }
  const handleChatResponse = (response: MessageProps) => {
    setExchange(response)
  }

  return (
    <>
      <main 
      className={styles.container}
      >
        <section>
          <Messages
           exchange={exchange}
           status={responseStatus}
          />
        </section>

        <section className={styles.chatInputContainer}>
          <ChatInput
           onResponse={handleChatResponse}
           onResponseStatus={handleResponseStatus}
          />
        </section>

      </main>
    </>
  )
}

export default LandingPage