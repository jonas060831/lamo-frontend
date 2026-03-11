const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/auth`;

export type credentialProps = {
    username: string
    password: string
}
const signIn = async (formData: credentialProps) => {
    try {
        
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        }

        const res = await fetch(`${BASE_URL}/sign-up`, options)

        const data = await res.json()

        if(data.error) throw new Error(data.error)
        
        if(data.token) {
            localStorage.setItem('token', data.token)
            return JSON.parse(atob(data.split('.')[1])).payload
        }

        throw new Error('Invalid response from server')

    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Server Error'
        throw new Error(errorMsg)
    }
}

const myProfile = async () => {
  try {
    const options = {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }

    const res = await fetch(`${BASE_URL}/my-profile`, options)

    const { user } = await res.json()

    if(user.error) throw new Error(user.error)

    const userInfo = {
        _id: user._id,
        username: user.username,
        avatarImg: user.profile.avatarImg,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName
    }
    
    return { userInfo }

  } catch (error) {
    console.log(error)
    const errorMsg = error instanceof Error ? error.message : 'Server Error'
    throw new Error(errorMsg)
  }
}

export {
    signIn,
    myProfile
}