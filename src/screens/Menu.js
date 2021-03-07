import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DrawerItemList } from '@react-navigation/drawer'
import { Gravatar } from 'react-native-gravatar'

import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions } from '@react-navigation/native'

import { FontAwesome } from '@expo/vector-icons';

export default (props) => {

    const logout = () => {
        delete axios.defaults.headers.common["Authorization"]
        AsyncStorage.removeItem("userData")
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

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>Tasks</Text>
                    <Gravatar style={styles.avatar}
                        options={{
                            email: props.email,
                            secure: true
                        }} />
                    <View style={styles.userInfo}>
                        <Text style={styles.name}>{props.name}</Text>
                        <Text style={styles.email}>{props.email}</Text>
                    </View>
                    <TouchableOpacity onPress={logout}>
                        <View style={styles.logoutIcon}>
                            <FontAwesome name="sign-out" size={38} color="#800" />
                        </View>
                    </TouchableOpacity>
                </View>
                <DrawerItemList {...props} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#DDD'
    },
    title: {
        color: '#000',
        fontSize: 30,
        padding: 10
    },
    avatar: {
        width: 60,
        height: 60,
        borderWidth: 3,
        borderRadius: 30,
        margin: 10,
        backgroundColor: '#222'
    },
    userInfo: {
        marginLeft: 10,
    },
    name: {
        fontSize: 20,
        marginBottom: 5,
    },
    email: {
        fontSize: 15,
        marginBottom: 10,
    },
    logoutIcon: {
        marginLeft: 10,
        marginBottom: 10
    }
})