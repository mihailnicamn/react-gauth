import cryptoJs from "crypto-js"


const encrypt = (data, key) => {
    const encrypted = cryptoJs.AES.encrypt(data, key).toString()
    return encrypted.toString()
}
const decrypt = (data, key) => {
    const decrypted = cryptoJs.AES.decrypt(data, key)
    return decrypted.toString(cryptoJs.enc.Utf8)
}

const hasPassword = () => {
    return !!window.sessionPassword
}
const isInit = () => {
    return !!window.localStorage.getItem('gauth')
}
const setPassword = (password) => {
    window.sessionPassword = password
}
const init = (password) => {
    window.localStorage.setItem('gauth', encrypt(JSON.stringify([]), password))
}
const goodPassword = (password) => {
    let result = false
    try {
        JSON.parse(decrypt(localStorage.getItem('gauth'), password))
        result = true
    } catch (e) {
        result = false
    }
    console.log('goodPassword', result)
    return result
}
const destroyPassword = () => {
    window.sessionPassword = undefined
}
const data = () => {
    try {
        if (!hasPassword()) return []
        if (!isInit()) return []
        const data = JSON.parse(decrypt(localStorage.getItem('gauth'), window.sessionPassword))
        return data
    } catch (e) {
        return []
    }
}
const removeData = (indexes) => {
    if (!hasPassword()) return false
    if (!isInit()) return false
    const data = JSON.parse(decrypt(localStorage.getItem('gauth'), window.sessionPassword))
    const _data = data.filter((item, index) => {
        return !indexes.includes(index)
    })
    const encrypted = encrypt(JSON.stringify(_data), window.sessionPassword)
    localStorage.setItem('gauth', encrypted)
    return true
}
const updateData = (index, data) => {
    if (!hasPassword()) return false
    if (!isInit()) return false
    let _data = JSON.parse(decrypt(localStorage.getItem('gauth'), window.sessionPassword))
    _data[index] = {
        ..._data[index],
        ...data
    }
    const encrypted = encrypt(JSON.stringify(_data), window.sessionPassword)
    localStorage.setItem('gauth', encrypted)
    return true
}

const updatePassword = (password) => {
    if (!hasPassword()) return false
    if (!isInit()) return false
    const data = JSON.parse(decrypt(localStorage.getItem('gauth'), window.sessionPassword))
    const newData = encrypt(JSON.stringify(data), password)
    window.sessionPassword = password
    localStorage.setItem('gauth', newData)
    return true
}

const addData = (data) => {
    if (!hasPassword()) return false
    if (!isInit()) return false
    if (!data) return false
    const _data = JSON.parse(decrypt(localStorage.getItem('gauth'), window.sessionPassword))
    _data.push(data)
    const encrypted = encrypt(JSON.stringify(_data), window.sessionPassword)
    localStorage.setItem('gauth', encrypted)
    return true
}


export default {
    encrypt,
    decrypt,
    hasPassword,
    isInit,
    setPassword,
    init,
    goodPassword,
    destroyPassword,
    data,
    addData,
    removeData,
    updateData,
    updatePassword  
}