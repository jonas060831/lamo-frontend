import { useState, type ChangeEvent, type FC } from 'react'
import styles from '../controls.module.css'

import eyeOpen from '../../../../assets/svgs/eyeOpen.svg'
import eyeClose from '../../../../assets/svgs/eyeClose.svg'

type TextInputType = {
  name: string
  type: 'text' | 'email' | 'password'
  isDisabled: boolean
  label: string
  value: string
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

const TextInput: FC<TextInputType> = ({
  name,
  type,
  isDisabled = false,
  label,
  value,
  handleChange,
  required=false
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true)

  const togglePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsPasswordHidden(prev => !prev)

  }

  return (
    <div className={styles.inputContainer}>
      <input
        name={name}
        type={type == 'password' && !isPasswordHidden ? 'text' : type }
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

      {
        (type === "password" && value.length > 0) && (
          <button
           className={styles.passwordVisibilityToggle}
           onClick={togglePasswordVisibility}
           type='button'
          >
            {
              isPasswordHidden ? (
                <>
                  <img className={`svg ${styles.passwordSvg}`} src={eyeClose} alt='eye close' />
                </>
              ) : (
                <img className={`svg ${styles.passwordSvg}`} src={eyeOpen} alt='eye open'/>
              )
            }
          </button>
        )
      }
    </div>
  )
}

export default TextInput