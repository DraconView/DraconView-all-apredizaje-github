import React, { useState, useCallback } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import firebase from 'firebase/app'
import { Avatar, Button, Rating } from 'react-native-elements'
import moment from 'moment/min/moment-with-locales' // manejador de fechas js
import { getRestaurantReviews } from '../../utils/actions'
import { map, size } from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
                            // MODULO DE COMENTARIOS
moment.locale("es") //[CAP91] que maneje las fechas nombres de meses y dias en español

export default function ListReviews({ navigation, idRestaurant }) { //aqui se recibe por propiedades la navegacion y el id
    const [userLogged, setUserLogged] = useState(false) //manejo de login de usuario
    const [reviews, setReviews] = useState([]) //[CAP91] estado que carga las review 

    firebase.auth().onAuthStateChanged((user) => { //[CAP87] onAuthStateChanged (revisa si hay un usuario logueado) retorna un user
        user ? setUserLogged(true) : setUserLogged(false) //si hay user ?(entonces) setUserLogged(true)
    })

    useFocusEffect( // consulta los comentarios 
        useCallback(() => { 
            (async() => { // aqui se van a obtener las reviews
                const response = await getRestaurantReviews(idRestaurant) // consulta que recibe por parametro idRestaurant
                if (response.statusResponse) { //[CAP91] si el objeto(response) en su propiedad statusResponse es true
                    setReviews(response.reviews) // si si pudo setReviews va ser igual a (respuesta propiedad .reviews)
                }
            })()
        }, [])
    )

    return (
        <View> //vista generica que envuelve todo
            {
                userLogged ? ( //[CAP87] si esta logueado 
                    <Button
                        buttonStyle={styles.btnAddReview} //buttonStyle propiedad que referencia 
                        title="Escribe una opinión"
                        titleStyle={styles.btnTitelAddReview}
                        onPress={() => navigation.navigate("add-review-restaurant", { idRestaurant })} //[CAP88] AQUI SE ENVIO ID DEL RESTAURANTE HACIA AddReviewRestaurant
                        icon={{ //se le pueden agregar iconos al boton 
                            type: "material-community",
                            name: "square-edit-outline",
                            color: "#a376c7"
                        }}
                    />
                ) : ( // si el usuario no esta logueado
                    <Text 
                        style={styles.mustLoginText}
                        onPress={() => navigation.navigate("login")}
                    >
                        Para escribir una opinión es necesario estar logueado.{" "}
                        <Text style={styles.loginText}>
                            Pusla AQUÍ para iniciar sesión.
                        </Text>
                    </Text>
                )
            }
            {
                size(reviews) > 0 && ( // si el tamaño de reviews es mayor a 0 y 
                    map(reviews, reviewDocument => ( //?mapea reviews por cada una, va tener un objeto llamado reviewDocument
                        <Review reviewDocument={reviewDocument}/>
                    ))
                )
            }
        </View>
    )
}

function Review({ reviewDocument }) { //?[CAP91] recibio los objetos key(unico) y review
    const { title, review, createAt, avatarUser, rating } = reviewDocument // destructoring a reviewDocument para usar las propiedades
    const createReview = new Date(createAt.seconds * 1000) // OBTIENE LA FECHA DE CREACION DE LA REVIEW, se * 1000 por que son milisegundos
 // objeto para pintar la coleccion de usuarios
    return (
        <View style={styles.viewReview}> // estilo de la vista 
            <View style={styles.imageAvatar}> // vista encargada del avatar del usuarios
                    renderPlaceholderContent={<ActivityIndicator color="#fff"/>} // placeholders(informar al usuario de escribir en un campo de un formulario), ActivityIndicator(componente muestra la acción de carga)
                    size="large" //tamaño
                    rounded // redondeado
                    containerStyle={styles.imageAvatarUser}
                    source={
                        avatarUser 
                            ? { uri: avatarUser} // si tiene avatar el usuario pinta esa foto
                            : require("../../assets/avatar-default.jpg") // si no coloca la foto por defecto
                    }
                />
            </View> //Las vistas reflejan el aspecto de los modelos de datos de aplicaciones. También se utilizan para escuchar eventos y reaccionar en consecuencia.
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewText}>{review}</Text>
                <Rating // estrellas en los comentarios usuarios
                    imageSize={15} // tamaño de las estrallas
                    startingValue={rating} // startingValue va ser igual rating(calificacion del restaurante)
                    readonly // // esta propiedad es para que el usurio no pueda modificar las estrellas
                />
                <Text style={styles.reviewDate}>{moment(createReview).format("LLL")}</Text> // moment(formatear la fecha) de createReview y el formato de fecha va ser format("LLL")
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent"
    },
    btnTitelAddReview: {
        color: "#a376c7"
    },
    mustLoginText: {
        textAlign: "center", //para que se centre 
        color: "#a376c7",
        padding: 20,
    },
    loginText: {
        fontWeight: "bold"
    },
    viewReview: {
        flexDirection: "row", 
        padding: 10,
        paddingBottom: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1
    },
    imageAvatar: {
        marginRight: 15
    },
    imageAvatarUser: { 
        width: 50,
        height: 50
    },
    viewInfo: {
        flex: 1,
        alignItems: "flex-start"
    },
    reviewTitle: {
        fontWeight: "bold"
    },
    reviewText: {
        paddingTop: 2,
        color: "gray",
        marginBottom: 5
    },
    reviewDate: {
        marginTop: 5,
        color: "gray",
        fontSize: 12,
        position: "absolute",
        right: 0,
        bottom: 0
    }
})
