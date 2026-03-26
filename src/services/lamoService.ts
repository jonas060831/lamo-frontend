const BASE_URL = `${import.meta.env.VITE_LAMO_AI_SERVER_URL}`

const smartQuery = async (textQuery: string, sessionId: string) => {

        /*
        Testing: Relevance Check between supplied context and LLM general knowledge
        Each conversation gets a unique session_id that maps to a list of questions and answers
        exchanged between the user and the LLM. It lives only in the server's memory
        and is never saved to a database — meaning it's lost if the server restarts or
        the session expires after 2 hours of inactivity.
        */
        try {
            const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: textQuery, session_id: sessionId })
        }
        const req = await fetch(`${BASE_URL}/smart-query`, options)

        const data = await req.json()

        return data

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error'
        return errorMessage
    }

}

const voiceQuery = async (textQuery: string, sessionId: string) => {

    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ question: textQuery, session_id: sessionId })
        }

        const res = await fetch(`${BASE_URL}/voice-query`, options)

        const data = await res.json()

        return data
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error'
        return errorMessage
    }
}

const processText = async (text: string, num_reasons: number =3, session_id?: string) => {
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ text, num_reasons, session_id })
        }
        const res = await fetch(`${BASE_URL}/detect-ai`, options)

        const data = res.json()

        return data


    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error'
        return errorMessage
    }
}

const extractReceiptText = async (formData: FormData) => {

    try {
        
        const options = {
            method: 'POST',
            body: formData
        }
        //response is a text form   
        const response = await fetch(`${BASE_URL}/extract-receipt-details`, options)

        const data = await response.json()

        return data

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error'
        return errorMessage
    }
}

export {
    smartQuery, //text query
    voiceQuery, //voice query
    processText,
    extractReceiptText //google vision api
}