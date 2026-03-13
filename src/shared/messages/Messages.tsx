
import { useEffect, useRef, useState, type FC } from 'react'
import styles from './Messages.module.css'

export interface MessageProps {
    id: string
    text: string
    sender: 'user' | 'ai' | string //change this to uuid later
    timestamp: Date;
    usedContext?: boolean
    
}

type ExchangeProps = {
 exchange?: MessageProps | null
 status: boolean | null
}

const Messages:FC<ExchangeProps> = ({ exchange=null, status }) => {

  const messageEndRef = useRef<HTMLDivElement | null>(null)

  const [exchanges, setExchanges] = useState<MessageProps[] | []>([])

  useEffect(() => {
    //push new exchange in the state TODO: will save to DB later on
    if(exchange) setExchanges(prev => [...prev, exchange])

  }, [exchange])

  
  useEffect(() => {
    //scroll to bottom whenever exchanges array is updated
    scrollToBottom()
  }, [exchanges])


  const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className={styles.container} >
        {
            exchanges.length == 0 ? (
                <div className={styles.emptyState}>
                    <h3>Testing Ollama LLM</h3>
                </div>
            )
            : (
                exchanges.map( exchange => (
                <div
                 key={exchange.id}
                 //add the wrapper base on who is the sender
                 className={`${styles.exchangeWrapper} ${exchange.sender === 'user' ? styles.userWrapper : styles.aiResponseWrapper }`}
                >
                    <div
                     className={`${styles.message} ${exchange.sender === 'user' ? styles.userMessage : styles.aiMessage}`}
                    >
                        {exchange.text}

                    </div>
                </div>
            ))
            )
        }
        {/* awaiting response */}
        {
            status && (
                <div className={styles.statusMessageContainer}>
                    Generating Response
                </div>
            )
        }
        {/* hidden div to programatically scroll to bottom of the page */}

        <div ref={messageEndRef}/>
    </div>
  )
}

export default Messages