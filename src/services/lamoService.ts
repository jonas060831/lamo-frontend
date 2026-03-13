const BASE_URL = `${import.meta.env.VITE_LAMO_AI_SERVER_URL}`

const smartQuery = async (textQuery: string) => {

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
            body: JSON.stringify({ question: textQuery })
        }
        const req = await fetch(`${BASE_URL}/smart-query`, options)

        const data = await req.json()

        return data

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server Error'
        return errorMessage
    }

}

export {
    smartQuery
}