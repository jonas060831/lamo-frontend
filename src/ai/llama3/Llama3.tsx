import { useState, type FC, type ReactNode } from 'react'
import Messages, { type MessageProps } from '../../shared/messages/Messages'
import ChatInput from '../../shared/chatInput/ChatInput'

type Llama3Props  = {
    containerClass? : string
    messageDisplayClass?: string
    chatInputClass? : string
    heroNotice?: ReactNode
}

const Llama3:FC<Llama3Props> = ({ containerClass, messageDisplayClass, chatInputClass, heroNotice }:Llama3Props) => {
  const [exchange, setExchange] = useState<MessageProps>()
  
  const [responseStatus, setResponseStatus] = useState<boolean | null>(null)

  const handleResponseStatus = (isLoading: boolean) => {
        setResponseStatus(isLoading)
  }

  const handleChatResponse = (response: MessageProps) => {
        setExchange(response)
  }

  return (
    <main className={containerClass}>
        <section className={messageDisplayClass}>
            <Messages
                exchange={exchange}
                status={responseStatus}
                notice={heroNotice}
            />
        </section>
        <section className={chatInputClass}>
            <ChatInput
                onResponse={handleChatResponse}
                onResponseStatus={handleResponseStatus}
            />
        </section>
    </main>
  )

}

export default Llama3