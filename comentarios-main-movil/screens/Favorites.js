import React, { useState, useCallback, useRef } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native' //[CAP98] FlatList(crear la lista), TouchableOpacity(sirve para cuando se seleccione una zona), Alert(mostrar mensajes al usuario), ActivityIndicator(para ponerlo a dar vueltas cuando esten cargando las fotos)
import { Button, Icon, Image } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'
import firebase from 'firebase/app'

import Loading from '../components/Loading'
import { deleteFavorite, getFavorites } from '../utils/actions'

export default function Favorites({ navigation }) {
    const toastRef = useRef()
    const [restaurants, setRestaurants] = useState(null) // guarda los restaurantes
    const [userLogged, setUserLogged] = useState(false) // estado para el login de usuario
    const [loading, setLoading] = useState(false) // estado para el loading 
    const [reloadData, setReloadData] = useState(false) // recarga la informacion de los restaurantes favoritos cuando se eliminen mas adelante

    firebase.auth().onAuthStateChanged((user) => { // onAuthStateChanged(retorna si hubo usuario)
        user ? setUserLogged(true) : setUserLogged(false)  
    })

    useFocusEffect( //[CAP96] cada vez que entre en la pantalla retorna la lista de favoritos
        useCallback(() => { // despues de la funcion tipo flecha 
            if (userLogged) { // si hay usuario logueado entonces...
                async function getData() { // va llamar el metodo getFavorites()
                    setLoading(true)
                    const response = await getFavorites() // response 
                    setRestaurants(response.favorites) // setRestaurants(coleccion de restaurantes) va ser igual a lo que alla en la respuesta en la coleccion favoritos(response.favorites) guarda en el estado de  restaurantes
                    setLoading(false)
                }
                getData() // llama la funcion gD()
            }
            setReloadData(false)
        }, [userLogged, reloadData]) // esto se ejecutara cuando cargue la pagina o cuando cambien los estados [userLogged, reloadData]
    )

    if (!userLogged) { // si no hay usuario logueado retorna la navegacion
        return <UserNoLogged navigation={navigation}/>
    }

    if (!restaurants) {  // si no hay valores en la propiedad restaurantes 
        return <Loading isVisible={true} text="Cargando restaurantes..."/> //carga el loading 
    } else if(restaurants?.length === 0){ // si hay restaurantes pero no hay favoritos
        return <NotFoundRestaurants/> // retorna al componente 
    }

    return ( //
        <View style={styles.viewBody}>
            { //[CAP98] llaves para ingresar codigo dentro de las vistas
                restaurants ? ( //[CAP98] si el objeto vista restauarantes tiene elementos
                    <FlatList // propiedades
                        data={restaurants} // la data de restaurants la va sacar de una coleccion que se llama restauarant
                        keyExtractor={(item, index) => index.toString() } // como cada publicacion debe ser unica, =>(de keyExtractor va usar el index) , esto evita un error cuando no se referencia que el restaurante es unico 
                        renderItem={(restaurant) => ( // por cada restaurante nos va renderizar <Restaurant
                            <Restaurant //[CAP98] componente interno, recibe los siguientes datos
                                restaurant={restaurant} // renderiza el restaurante que esta recibiendo
                                setLoading={setLoading} // se activara caundo se borre un restaurante 
                                toastRef={toastRef} // se activara caundo se borre un restaurante
                                navigation={navigation} // cuando toque una publicacion navegara 
                                setReloadData={setReloadData} // cuando se llame el restaurante, y se borre el restaurante de favoritos se va refrescar con esta funcion
                            />
                        )}
                    />
                ) : ( //[CAP98] si el objeto vista restauarantes no tiene elementos
                    <View style={styles.loaderRestaurant}>
                        <ActivityIndicator size="large"/>
                        <Text style={{ textAlign: "center"}}>
                            Cargando Restaurantes...
                        </Text>
                    </View>
                )
            } 
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Por favor espere..."/>
        </View>
    )
}

function Restaurant({ restaurant, setLoading, toastRef, navigation, setReloadData }) { //[CAP98] aqui se utilizo un doble destructoring para usar la propiedad restaurant
    const { id, name, images } = restaurant.item 

    const confirmRemoveFavorite = () => { //[CAP100] proceso de confirmacion del usuario si desea eliminar de favoritos
        Alert.alert( // mostrar mensaje del metodo Alert
            "Eliminar restaurante de favoritos", // primer parametro 
            "¿Está seguro de querer borrar el restaurante de favoritos?", // segundo parametro 
            [ // tercer parametro un arreglo de botones
                { // boton 1 
                    text: "No",
                    style: "cancel"
                },
                { // boton 1 
                    text: "Sí",
                    onPress: removeFavorite // llama al metodo removeFavorite
                }
            ],
            { cancelable: false }
        )
    }

    const removeFavorite = async() => { //[CAP100] llama el metodo asincrono de utils
        setLoading(true)
        const response = await deleteFavorite(id) // importa el metodo de actions y recibe por parametro 
        setLoading(false)
        if (response.statusResponse) { // si lo pudo borrar 
            setReloadData(true)
            toastRef.current.show("Restaurante eliminado de favoritos.", 3000) // mensaje 
        } else {
            toastRef.current.show("Error al eliminar restaurante de favoritos.", 3000)
        }
    }

    return (
        <View style={styles.restaurant}>
            <TouchableOpacity //[CAP98] cuando toque el usuario en cualquier punto...
                onPress={() => navigation.navigate("restaurants", { // navegar 
                    screen: "restaurant", // navegar al restaurante con los siguientes parametros...
                    params: { id, name } // nombre en la parte superior de la vista despues de producirse la navegacion desde la vista de favoritos  
                })}
            >
                <Image // imagen del restaurante 
                    resizeMode="cover" // ocupar todo el espacio 
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator color="#fff"/>} // componente de cargando 
                    source={{ uri: images[0] }} // origen de la imagen, uri utilizar coleccion de imagenes en la posicion 0
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text> // agrega el nombre del restaurante 
                    <Icon // agregar o eliminar de favoritos
                        type="material-community" // fuente del icono
                        name="heart" // nombre del icono
                        color="#f00" // color 
                        containerStyle={styles.favorite}
                        underlayColor="transparent" // color de fondo 
                        onPress={confirmRemoveFavorite} // al seleccionar llama la funcion
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

function NotFoundRestaurants() { //
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type="material-community" name="alert-outline" size={50}/>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Aún no tienes restaurantes favoritos.
            </Text>
        </View>
    )
}

function UserNoLogged({ navigation }) { //[CAP97]
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type="material-community" name="alert-outline" size={50}/>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Necesitas estar logueado para ver los favoritos.
            </Text>
            <Button
                title="Ir al Login"
                containerStyle={{ marginTop: 20, width: "80%" }}
                buttonStyle={{ backgroundColor: "#442484" }}
                onPress={() => navigation.navigate("account", { screen: "login" })} // NAVEGA A UN screen ESPECIFICO DE ACCOUNT
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    loaderRestaurant: {
        marginVertical: 10
    },
    restaurant: { 
        margin: 10 // magen para que se pegue a todas las pantallas 
    },
    image: {
        width: "100%", // 100% del espacio que tenga 
        height: 180 // altura 180 pixeles
    },
    info: {
        flex: 1, 
        alignItems: "center", // alinear al centro 
        justifyContent: "space-between", // para que se reparta el espacio el corazon y el titulo 
        flexDirection: "row",
        paddingHorizontal: 20, // 
        paddingVertical: 10, // 10 arriba y 10 abajo 
        marginTop: -30, // para que se monte encima de la imagen 
        backgroundColor: "#fff"
    },
    name: { // estilo para el nombre de la publicacion
        fontWeight: "bold", // fuente en negrita 
        fontSize: 20 // tamaño de la fuente 
    },
    favorite: {
        marginTop: -35, // subir el corazon encima de la imagen
        backgroundColor: "#fff",
        padding: 15, // padding a todos los lados 
        borderRadius: 100 // para redondear
    } 
})
