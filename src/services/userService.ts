const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/users`

const index = async () => {
    try {
        
      const options = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
      const res = await fetch(BASE_URL, options)

      const data = await res.json()

      if(data.error) throw new Error(data.error)

      return data

    } catch (error) {
        console.log(error)
        const errorMsg = error instanceof Error ? error.message : 'Server Error'
        throw new Error(errorMsg);
    }
}

export { index }