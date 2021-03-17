
export function GetRandomDocumentID () {
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const charAmount = 20
    let myString = ""
    for (let i = 0; i < charAmount; i++) {
        myString += glyphs[Math.round(Math.random() * (glyphs.length - 1))]
    }
    return myString
}