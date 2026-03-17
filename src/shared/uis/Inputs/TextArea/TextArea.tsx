import type { ChangeEvent } from "react"

import styles from './TextArea.module.css'

type TextAreaProps = {
    name: string
    id: string
    value: string
    handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
    placeholder: string
}

const TextArea = ({name, id, value, handleChange, placeholder}: TextAreaProps) => {
  return (
    <div className={styles.container}>
        <textarea
         name={name}
         id={id}
         value={value}
         onChange={handleChange}
         placeholder={placeholder}
        >
        </textarea>
    </div>
    
  )
}

export default TextArea