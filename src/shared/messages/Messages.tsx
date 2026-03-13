
import { useEffect, useState, type FC } from 'react'
import styles from './Messages.module.css'

export interface MessageProps {
    id: string
    text: string
    sender: 'user' | 'ai' | string //change this to uuid later
    timestamp: Date;
    usedContext?: boolean

}

type ExchangeProps = {
 exchange?: MessageProps
}

const Messages:FC<ExchangeProps> = ({ exchange }) => {

  const [exchanges, setExchanges] = useState<MessageProps[] | []>([])

  useEffect(() => {
    console.log(exchange)
    if(exchange) setExchanges(prev => [...prev, exchange])

  }, [exchange])

  if(!exchange) return <></>

  return (
    <div 
     className={styles.container}
     style={{ display: 'flex', flexDirection: 'column', gap: '1rem'}}
    >
        {
            exchanges?.map((exchange, idx) => (
                <div key={idx} style={{ backgroundColor: exchange.sender !== 'ai' ? 'red' : 'none', }}>
                    {exchange.text}
                </div>
            ))
        }
    </div>
  )
}

export default Messages