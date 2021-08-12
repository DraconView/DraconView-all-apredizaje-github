import React, { useState, useEffect, useCallback } from 'react'     //[CAP60] useCallback refrescar el screens
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'           //[CAP60] useCallback trabajan juntos, useFocusEffect(se carga cada vez que se ejecuta la pantalla) se necesitan los 2
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import ListRestaurants from '../../components/restaurants/ListRestaurants'
import { getMoreRestaurants, getRestaurants } from '../../utils/actions' 


export default function Restaurants({ navigation }) {               //[CAP60] m3nu
    const [user, setUser] = useState(null)                          //[CAP60] m3nu estado indica si hay usuario o no hay usuario como no lo sabe se define en null
    const [startRestaurant, setStartRestaurant] = useState(null)    //[CAP60]
    const [restaurants, setRestaurants] = useState([])              //[CAP60] almacenara la coleccion de restaurantes, en un arreglo vacio
    const [loading, setLoading] = useState(false)

    const limitRestaurants = 7                                      //[CAP60] se indica el limite de restaurantes a mostrar

    useEffect(() => { //[CAP60] m3nu cuando carga la pagina por primera vez 
        firebase.auth().onAuthStateChanged((userInfo) => { //onAuthStateChanged(cuando el estado cambie)
            userInfo ? setUser(true) : setUser(false) //si esta logueado devuelve verdadero o falso
        })
    }, [])
   //[CAP86] EXPLICACION IMPORTANTE DEL useCallback Y async
    useFocusEffect(                     //[CAP60] se ejecuta cada vez que cargue la pagina   
        useCallback(() => {             //[CAP60] realiza un llamdo asincrono para obtener la lista de restaurantes
            async function getData() {  //[CAP60] 
                setLoading(true)
                const response = await getRestaurants(limitRestaurants) //[CAP60] va traer los restaurantes
                if (response.statusResponse) { //[CAP60] si puede, establece los objetos  
                    setStartRestaurant(response.startRestaurant) //es lo que hay en la respuesta en su variable startRestaurant 
                    setRestaurants(response.restaurants) // setRestaurants(la coleccion de restaurantes) es lo que hay en objeto response.restaurants(en coleccion de restaurants)
                }
                setLoading(false)
            }
            getData()
        }, []) //aqui se puede indicar las veces que se quiere ejecutar
    )
//------------------------------------------------ //[CAP80] funcion que llama  
    const handleLoadMore = async() => { // >>2hLM4
        if (!startRestaurant) { // si no(!) startRestaurant significa que llego al fin de los resultados 
            return 
        }
        // pero si hay mas resultados..
        setLoading(true) // componente cargando 
        const response = await getMoreRestaurants(limitRestaurants, startRestaurant) // pedir mas resultados
        if (response.statusResponse) {
            setStartRestaurant(response.startRestaurant) // si hay otro ultimo restaurante se guarda en startRestaurant
            setRestaurants([...restaurants, ...response.restaurants]) // ...(junta lo que lleva en restaurants concadena con la respuesta del nuevo restaurants)
        }
        setLoading(false)
    }

    if (user === null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <View style={styles.viewBody}> //[CAP60] m3nu aqui se le cambia el estilo a toda la vista 
            {
                size(restaurants) > 0 ? ( // si el tamaño de la coleccion es mayor a 0
                    <ListRestaurants //[CAP81] >>1LR renderiza el componente y envia por parametro
                        restaurants={restaurants} // restaurants que es lo contiene el estado de restaurants
                        navigation={navigation} // navigation es la que le pasaron a este componente 
                        handleLoadMore={handleLoadMore} // >>1hLM4 =>ListRestaurants
                    />
                ) : ( // esto debe ser el false o no 
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No hay restaurantes registrados.</Text>
                    </View>
                )
            }
            {
                user && ( //[CAP60] m3nu si hay usuario mostrar este icono
                    <Icon
                        type="material-community"
                        name="plus"
                        color="#442484"
                        reverse
                        containerStyle={styles.btnContainer}
                        onPress={() => navigation.navigate("add-restaurant")}
                    />
                )
            }
            <Loading isVisible={loading} text="Cargando restaurantes..."/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: { //ocupar todo el espacio disponible
        flex: 1,
    },
    btnContainer: {
        position: "absolute", //la posicion va ser fija segun bottom: 10, right: 10,
        bottom: 10,
        right: 10,
        shadowColor: "black", //colocar sombra  
        shadowOffset: { width: 2, height: 2}, //para que la sombra se quede un poco hacia la derecha 
        shadowOpacity: 0.5 //opacidad de la sombra
    },
    notFoundView: {
        flex: 1, // espacio que va ocupar de la pantalla 
        justifyContent: "center", //justificacion del contenido 
        alignItems: "center" //alineacion
    },
    notFoundText: {
        fontSize: 18, //tamaño
        fontWeight: "bold" //peso de letra
    }
})
