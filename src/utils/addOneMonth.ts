
//FORMAT DD/MM/YYYY HH:MM
const addOneMonth = (dateString: string) => {

    //convert to date
    const date = new Date(dateString)

    //add 1 month
    const nextDate = new Date(date)
    nextDate.setDate(date.getDate() + 30)

    //FORMAT as MM/DD
    const month = String(nextDate.getMonth() + 1).padStart(2, '0')
    const day = String(nextDate.getDate()).padStart(2, '0')

    return `${month}/${day}`
}

export default addOneMonth