
import { useEffect, useRef, useState, type FC, type ReactNode } from 'react'
import styles from './Messages.module.css'
import highLightCodeSection from '../../utils/codeHighlightSupport'
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

export interface MessageProps {
    id: string
    text: string
    sender: 'user' | 'ai' | 'ai-voice' | string //change this to uuid later
    timestamp: Date;
    usedContext?: boolean
    
    
}

type ExchangeProps = {
 exchange?: MessageProps | null
 status: boolean | null
 notice?: ReactNode
}

const Messages:FC<ExchangeProps> = ({ exchange=null, status, notice }) => {

  const messageEndRef = useRef<HTMLDivElement | null>(null)

  const [exchanges, setExchanges] = useState<MessageProps[]>([])

  useEffect(() => {
    //push new exchange in the state TODO: will save to DB later on

    if(!exchange) return

    if(exchange) {
      setExchanges(prev => {
      if (prev.some(msg => msg.id === exchange.id)) return prev
      return [...prev, exchange]
  })
    }

  }, [exchange])

  
  useEffect(() => {
    //scroll to bottom whenever exchanges array is updated
    scrollToBottom()
  }, [exchanges])

  useEffect(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [exchanges]);


  const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  const renderExchangeContent = (text: string) => {

    const parts = text.split(/```([\s\S]*?)```/g);

    return parts.map((part, index) => {

      // CODE BLOCK
      if (index % 2 === 1) {
        return highLightCodeSection(part, index);
      }

      // TEXT / HEADERS 
      const segments = part.split(/(\*\*.*?\*\*|!\[.*?\]\(.*?\))/g);

      return segments.map((segment, i) => {

        // HEADER **text**
        if (segment.startsWith("**") && segment.endsWith("**")) {
          const headerText = segment.replace(/\*\*/g, "").trim();

          return (
            <h2 key={`${index}-${i}`} className={styles.messageHeader}>
              {headerText}
            </h2>
          );
        }

        // NORMAL TEXT
        return segment.trim() ? (
          <p key={`${index}-${i}`} className={styles.messageText}>
            {segment}
          </p>
        ) : null;
      });

    })

  }

  return (
    <div className={styles.container} >
        {
            exchanges.length === 0 ? (
                <div className={styles.emptyState}>
                    
                    {
                      notice ? (
                        notice
                      ) : (
                        <h3>Testing Ollama LLM</h3>
                      )
                    }
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

                        {/* process text for both user and ai */}
                        {/* code support */}
                        {renderExchangeContent(exchange.text)}

                        
                    </div>
                </div>
            ))
            )
        }
        {/* awaiting response */}
        {
            status && (
                <div className={styles.statusMessageContainer}>
                    
                    {/* if its coming from ai-voice do not show Generating Response message */}
                    {
                      exchange?.sender !== 'ai-voice' && 'Generating Response'
                    }

                </div>
            )
        }
        {/* hidden div to programatically scroll to bottom of the page */}

        <div ref={messageEndRef}/>
    </div>
  )
}

export default Messages