import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions } from '@react-navigation/native'

export default (props) => {

    useEffect(() => {

        async function checkLogin() {
            const userDataJson = await AsyncStorage.getItem('userData')
            let userData = null

            try {
                userData = JSON.parse(userDataJson)
            } catch (e) {

            }

            if (userData && userData.token) {
                axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Home',
                                params: userData,
                            },
                        ],
                    })
                );
            } else {
                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Auth',
                            },
                        ],
                    })
                )
            }
        }

        checkLogin()
    }, [])

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#FFF" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    }
})