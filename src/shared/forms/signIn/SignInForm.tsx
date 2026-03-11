import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import styles from './SignInForm.module.css'
import TextInput from '../controls/TextInput/TextInput'

import * as authService from '../../../services/authService'
import { useAuth } from '../../../contexts/UserContext'
import { useNavigate } from 'react-router'


export type basicAuthType = {
    username: string
    password: string
}
const SignInForm = () => {
  
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [message, setMessage] = useState<string>('')


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage('');
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };


  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    try {
        
        const res = await authService.signIn(formData)

        console.log(res)

        setUser(res)
        navigate('/')

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error'
        setMessage(errorMessage)
    }

  }
  return (
    <main className={styles.container}>

        <section style={{ width: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', margin: '0px auto' }}>
            
            <h1>Sign In</h1>
            <p>{message}</p>

            <form autoComplete='off' onSubmit={handleSubmit} >
                <TextInput
                 name='username'
                 type='email'
                 label='Enter Email'
                 isDisabled={false}
                 value={formData.username}
                 handleChange={handleChange}
                 required={true}
                />
                <br />
                <TextInput
                 name='password'
                 type='password'
                 label='Enter Password'
                 isDisabled={false}
                 value={formData.password}
                 handleChange={handleChange}
                 required={true}
                />
                <br />
                <div>
                    <button>Sign In</button>
                </div>
            </form>
        </section>

    </main>
  )
}

export default SignInForm