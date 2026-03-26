const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/receipts`;

const index = async () => {

    try {
        const options = {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
        }
        const response = await fetch(BASE_URL, options)
        
        const data = response.json()

        return data

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error'
        return errorMessage
    }
}


const add = async (receipt: { text: string, preview: string}) => {

    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json', 
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(receipt)
        }
        const response = await fetch(BASE_URL, options)
        
        const data = await response.json()

        return data

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error'
        return errorMessage
    }
}


export {
 index,
 add
}