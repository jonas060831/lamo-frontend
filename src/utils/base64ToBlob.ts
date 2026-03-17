const base64ToBlob = (base64: string, mime = "audio/wav") => {
    const byteChars = atob(base64)
    const byteNumbers = new Array(byteChars.length);

    for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars[i];
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], {type: mime})
    
}

export default base64ToBlob