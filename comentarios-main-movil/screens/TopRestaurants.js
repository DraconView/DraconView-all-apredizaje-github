import React, { useState, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native' // recargar el metodo cada vez que cargue la pantalla 

import Loading from '../components/Loading'
import ListTopRestaurants from '../components/ranking/ListTopRestaurants'
import { getTopRestaurants } from '../utils/actions'

export default function TopRestaurants({ navigation }) { //[CAP102] ?debe recibir la navegacion asi no se la mande nadie
    const [restaurants, setRestaurants] = useState(null) // estado para tener todos los restaurantes, y los restaurantes va iniciar como una coleccion vacia
    const [loading, setLoading] = useState(false) // loading arraca en false

    useFocusEffect(
        useCallback(() => {
            async function getData() { //[CAP101] 
                setLoading(true) // pone el loading a dar vueltas
                const response = await getTopRestaurants(10) // llama al metodo de utils(solo devuelve 10)
                if (response.statusResponse) { // cuando traiga los resultado
                    setRestaurants(response.restaurants) // setRestaurants va tomar estos datos 
                }
                setLoading(false)
            }
            getData() // es obligatorio para que esto se ejecute 
        }, [])
    )

    return (
        <View>
            <ListTopRestaurants // cuando se llame este componente espera 2 parametros restaurants y navigation
                restaurants={restaurants}
                navigation={navigation}
            />
            <Loading isVisible={loading} text="Por favor espere..."/>
        </View>
    )
}

const styles = StyleSheet.create({})
