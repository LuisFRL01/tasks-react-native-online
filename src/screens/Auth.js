import React, { useState } from 'react'
import { StyleSheet, ImageBackground, Text, View, TouchableOpacity } from 'react-native'

import { CommonActions } from '@react-navigation/native'

import commonStyles from '../commonStyles'

import backgroundImage from '../../assets/imgs/login.jpg'

import AuthInput from '../components/AuthInput'

import { server, showError, showSuccess } from '../common'
import axios from 'axios'

import AsyncStorage from '@react-native-async-storage/async-storage'

export default (props) => {

    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        stageNew: false
    })

    const validations = []

    validations.push(state.email && state.email.includes("@"))
    validations.push(state.password && state.password.trim().length >= 6)

    if (state.stageNew) {
        validations.push(state.name && state.name.trim().length >= 4)
        validations.push(state.password === state.confirmPassword)
    }

    const validForm = validations.reduce((t, a) => t && a)

    signinOrSingup = () => {
        if (state.stageNew) {
            singup();
        } else {
            signin()
        }
    }

    singup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: state.name,
                email: state.email,
                password: state.password,
                confirmPassword: state.confirmPassword,
            })

            showSuccess("Usuário cadastrado")
            setState({ stageNew: true })
        } catch (e) {
            showError(e)
        }
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email: state.email,
                password: state.password,
            })

            AsyncStorage.setItem('userData', JSON.stringify(res.data))
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{
                        name: 'Home',
                        params: res.data
                    }]
                })
            )
        } catch (e) {
            showError(e)
        }
    }

    return (
        <ImageBackground style={styles.background} source={backgroundImage}>
            <Text style={styles.title}>
                Tasks
            </Text>
            <View style={styles.formContainer}>
                <Text style={styles.subTitle}>
                    {state.stageNew ? "Crie a sua conta" : "Informe os seus dados"}
                </Text>
                {
                    state.stageNew &&
                    <AuthInput icon="user" placeholder="Nome" style={styles.input} value={state.name} onChangeText={name => setState({ ...state, name })} />
                }
                <AuthInput icon="at" placeholder="E-mail" style={styles.input} value={state.email} onChangeText={email => setState({ ...state, email })} />
                <AuthInput icon="lock" placeholder="Senha" secureTextEntry={true} style={styles.input}
                    value={state.password} onChangeText={password => setState({ ...state, password })} />
                {
                    state.stageNew &&
                    <AuthInput icon="asterisk" placeholder="Confirmar Senha" secureTextEntry={true} style={styles.input}
                        value={state.confirmPassword} onChangeText={confirmPassword => setState({ ...state, confirmPassword })} />
                }
                <TouchableOpacity onPress={signinOrSingup} disabled={!validForm}>
                    <View style={[styles.button, validForm ? {} : { backgroundColor: "#AAA" }]}>
                        <Text style={styles.buttonText}>
                            {state.stageNew ? "Cadastre-se" : "Entrar"}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => { setState({ stageNew: !state.stageNew }) }}>
                <Text style={styles.buttonText}>
                    {state.stageNew ? "Já possui conta?" : "Não possui conta?"}
                </Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 70,
        color: commonStyles.colors.secondary,
        marginBottom: 10
    },
    subTitle: {
        color: "#FFF",
        fontSize: 20,
        textAlign: "center",
        marginBottom: 10
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%'
    },
    input: {
        marginTop: 10,
        backgroundColor: "#FFF",
    },
    button: {
        backgroundColor: "#080",
        marginTop: 10,
        padding: 15,
        alignItems: 'center',
        borderRadius: 7
    },
    buttonText: {
        color: "#FFF",
        fontSize: 20
    }
})