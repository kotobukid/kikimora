const now = new Date()

const date_to_string = (d) => {
    return `${d.getFullYear()}${('0' + (d.getMonth() + 1)).slice(-2)}${('0' + d.getDate()).slice(-2)}`
}

console.log('now')
console.log(date_to_string(now))
console.log('now + 45day')
now.setDate(now.getDate() + 45)
console.log(date_to_string(now))
console.log('2020/02/28')
console.log(date_to_string(new Date(2000, 1, 28)))
