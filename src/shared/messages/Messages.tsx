
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
    <div 
     className={styles.container}
     style={{ display: 'flex', flexDirection: 'column', gap: '1rem'}}
    >
        {
            exchanges.length == 0 ? (
                <div className={styles.emptyState}>
                    <h3>Testing Ollama LLM</h3>
                </div>
            )
            : (
                exchanges.map((exchange, idx) => (
                <div key={idx} style={{ backgroundColor: exchange.sender !== 'ai' ? 'red' : 'none', }}>
                    {exchange.text}
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