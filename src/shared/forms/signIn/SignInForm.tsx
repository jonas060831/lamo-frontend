import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import styles from './SignInForm.module.css'
import TextInput from '../controls/TextInput/TextInput'

import * as authService from '../../../services/authService'
import { useAuth } from '../../../contexts/UserContext'

import { useNavigate, Navigate } from 'react-router'
import PillButton from '../controls/Buttons/PillButton/PillButton'

export type basicAuthType = {
  username: string
  password: string
}

const SignInForm = () => {
  
  const { setUser, user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const [message, setMessage] = useState<string>('1')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage('1')
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    setIsLoading(true)
    event.preventDefault()
    try {
      const res = await authService.signIn(formData)
      setUser(res)
      navigate('/')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Server Error'
      setIsLoading(false)
      setMessage(errorMessage)
    }
  }


  //do not render the form instead redirect to /
  if(user) return <Navigate to="/" replace/>

  return (
    <main className={styles.container}>
      <section style={{ width: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', margin: '0px auto' }}>
        <h1>Sign In</h1>
        <p style={{ visibility: message.length > 1 ? 'visible' : 'hidden', color: 'red' }}>{message}</p>

        <form
         className={styles.signInFormContainer}
         autoComplete='off'
         onSubmit={handleSubmit}
        >
          <TextInput
            name='username'
            type='email'
            label='Enter Email'
            isDisabled={false}
            value={formData.username}
            handleChange={handleChange}
            required={true}
          />

          <TextInput
            name='password'
            type='password'
            label='Enter Password'
            isDisabled={false}
            value={formData.password}
            handleChange={handleChange}
            required={true}
          />

          <div>
            <PillButton
             title='Sign In'
             iconName={ isLoading ? 'loading' : 'arrowRight'}
            />
          </div>
        </form>
      </section>
    </main>
  )
}

export default SignInForm