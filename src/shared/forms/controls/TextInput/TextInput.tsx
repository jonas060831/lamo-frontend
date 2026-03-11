import { useState, type ChangeEvent, type FC } from 'react'
import styles from '../controls.module.css'

type TextInputType = {
  name: string
  type: 'text' | 'email' | 'password'
  isDisabled: boolean
  label: string
  value: string
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
  required: boolean
}

const TextInput: FC<TextInputType> = ({
  name,
  type,
  isDisabled = false,
  label,
  value,
  handleChange,
  required
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={styles.inputContainer}>
      <input
        name={name}
        type={type}
        id={name}
        autoComplete="off"
        value={value}
        disabled={isDisabled}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
      />
      <label
        className={value || isFocused ? styles.filled : ''}
        htmlFor={name}
      >
        {label}
      </label>
    </div>
  )
}

export default TextInput