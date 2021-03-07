import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

import moment from 'moment'
import 'moment/locale/pt-br'

import { FontAwesome } from '@expo/vector-icons';

import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'


import Task from '../components/Task'
import AddTask from './AddTask'

import commonStyles from '../commonStyles'

import { server, showError } from '../common'
import axios from 'axios'

export default (props) => {

    const [tasks, setTasks] = useState([]);

    const [showDoneTasks, setShowDoneTasks] = useState(true)

    const [showAddTask, setShowAddTask] = useState(false)

    const [visibleTasks, setVisibleTasks] = useState([])

    useEffect(() => {

        async function getTask() {
            const stringShowDoneTasks = await AsyncStorage.getItem('tasksState')
            const savedShowDoneTasks = JSON.parse(stringShowDoneTasks) || true
            setShowDoneTasks(savedShowDoneTasks.showDoneTasks)
            filterTasks()
        }

        getTask()
        loadTasks()
    }, [])

    loadTasks = async () => {
        try {
            const maxDate = moment().add({ days: props.daysAhead }).format("YYYY-MM-DD 23:59:59")
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            setTasks(res.data)
            filterTasks()
        } catch (e) {
            showError(e)
        }
    }

    toggleTask = async (taskID) => {
        try {
            await axios.put(`${server}/tasks/${taskID}/toggle`)
            loadTasks()
        } catch (e) {
            showError(e)
        }
    }

    toggleFilter = () => {
        setShowDoneTasks(!showDoneTasks)
    }

    useEffect(() => {
        filterTasks()
    }, [showDoneTasks]);

    useEffect(() => {
        filterTasks()
    }, [tasks]);

    filterTasks = () => {
        let visibleTasks = null
        if (showDoneTasks) {
            visibleTasks = [...tasks]
        } else {
            const pending = taks => taks.doneAt === null
            visibleTasks = tasks.filter(pending)
        }

        setVisibleTasks(visibleTasks)
        AsyncStorage.setItem('tasksState', JSON.stringify({ showDoneTasks: showDoneTasks }))
    }

    addTask = async (newTask) => {
        if (!newTask.desc || !newTask.desc.trim()) {
            Alert.alert("Dados inválidos", "Descrição não foi informada")
            return
        }

        try {
            await axios.post(`${server}/tasks`, {
                desc: newTask.desc,
                estimateAt: newTask.date,
            })

            loadTasks()
            setShowAddTask(false)
        } catch (e) {
            showError(e)
        }
    }

    deleteTask = async (taskID) => {
        try {
            await axios.delete(`${server}/tasks/${taskID}`)
            loadTasks()
        } catch (e) {
            showError(e)
        }
    }

    getImageBackground = () => {
        switch (props.daysAhead) {
            case 0: return todayImage
            case 1: return tomorrowImage
            case 7: return weekImage
            default: return monthImage
        }
    }

    getColorAddTask = () => {
        switch (props.daysAhead) {
            case 0: return commonStyles.colors.today
            case 1: return commonStyles.colors.tomorrow
            case 7: return commonStyles.colors.week
            default: return commonStyles.colors.month
        }
    }

    const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

    return (
        <SafeAreaView style={styles.container}>
            <AddTask isVisible={showAddTask} onCancel={() => { setShowAddTask(false) }} onSave={addTask} />
            <ImageBackground source={getImageBackground()} style={styles.background}>
                <View style={styles.iconBar}>
                    <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                        <FontAwesome name="bars" size={20} color={commonStyles.colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleFilter}>
                        {
                            showDoneTasks ?
                                <FontAwesome name="eye" size={20} color={commonStyles.colors.secondary} /> :
                                <FontAwesome name="eye-slash" size={20} color={commonStyles.colors.secondary} />
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>{props.title}</Text>
                    <Text style={styles.subtitle}>{today}</Text>
                </View>
            </ImageBackground>
            <View style={styles.tasklist}>
                <FlatList data={visibleTasks} keyExtractor={item => `${item.id}`}
                    renderItem={({ item }) => { return <Task {...item} toggleTask={toggleTask} onDelete={deleteTask} /> }} />
            </View>
            <TouchableOpacity activeOpacity={0.7} style={
                [
                    styles.addButton,
                    { backgroundColor: getColorAddTask() }
                ]} onPress={() => { setShowAddTask(true) }}>
                <FontAwesome name="plus" size={20} color={commonStyles.colors.secondary} />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3,
    },
    tasklist: {
        flex: 7,
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20,
    },
    subtitle: {
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    iconBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    }
})