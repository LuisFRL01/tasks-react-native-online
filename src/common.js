import { Alert } from 'react-native'

const server = 'seu ip'

const showError = (err) => {
    if (err.response && err.response.data) {
        Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err.response.data}`)
    } else {
        Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err}`)
    }
}

const showSuccess = (msg) => {
    Alert.alert('Sucesso', msg)
}

export { server, showError, showSuccess }