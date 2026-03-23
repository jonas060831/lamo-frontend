import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import styles from './SignInForm.module.css'
import TextInput from '../../uis/Inputs/TextInput/TextInput'

import * as authService from '../../../services/authService'
import { useAuth } from '../../../contexts/UserContext'

import { Navigate, useLocation } from 'react-router-dom'
import PillButton from '../../uis/Buttons/PillButton/PillButton'

export type basicAuthType = {
  username: string
  password: string
}

const SignInForm = () => {
  
  const { search } = useLocation()
  const queryParams = new URLSearchParams(search)
  const redirectUrl = queryParams.get('redirectUrl')
  const { setUser, user } = useAuth()

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

    if(!formData.username || !formData.password) {
        setMessage('Invalid credentials')
        setIsLoading(false)
    }
    else {

      

      try {
        const res = await authService.signIn(formData)
        setUser(res)

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error'
        setIsLoading(false)
        setMessage(errorMessage)
      }
    }
  }


  //do not render the form instead redirect to /
  if(user) return <Navigate to={redirectUrl || "/"} replace/>

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
          />

          <TextInput
            name='password'
            type='password'
            label='Enter Password'
            isDisabled={false}
            value={formData.password}
            handleChange={handleChange}
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