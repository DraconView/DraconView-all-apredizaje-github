import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AirbnbRating, Button, Input } from 'react-native-elements' // AirbnbRating(sirve para las calificaciones)
import Toast from 'react-native-easy-toast' //[CAP88] el Toast esta relacionado con useRef
import { isEmpty } from 'lodash' // isEmpty de lodash (valida que el usuario si ingreso algo)
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view' // soluciona que el teclado estorbe en la vista 

import Loading from '../../components/Loading'
import { addDocumentWithoutId, getCurrentUser, getDocumentById, updateDocument } from '../../utils/actions'

export default function AddReviewRestaurant({ navigation, route }) { // recibe navegacion y codigo del restaurante, en route vienen los parametros
    const { idRestaurant } = route.params //[CAP90] destructuring route.params se le pasa como parametros id del restaurante que se le va hacer el coemntario  
    const toastRef = useRef() // para que camine el toast

    const [rating, setRating] = useState(null)  // calificacion que el usuario colocara en estrellas
    const [title, setTitle] = useState("")      // titulo del comentario
    const [errorTitle, setErrorTitle] = useState(null) // manejo de errores
    const [review, setReview] = useState("") // comentario que agregara el usuario
    const [errorReview, setErrorReview] = useState(null) // manejo de errores
    const [loading, setLoading] = useState(false)
// [CAP92] const data SIRVIO PARA CREAR UN NUEVO CAMPO EN EL DOCUMENTO
    const addReview = async() => { //[CAP89] [addReview-2] si el formulario no es valido return
        if (!validForm()) {  //[CAP89] [validForm-1]
            return
        } // si la validacion se cumple 

        setLoading(true) // se pone setLoading a dar vueltas 
        const user = getCurrentUser() // retorna usuario logueado en el sistema, aqui se define user con la funcion importada desde actions
        const data = { //[CAP90] que data se va guardar cuando se haga un nuevo comentario
            idUser: user.uid, // el usuario que hizo el comentario se va sacar de user.uid(el codigo que nos devuelve firebase del usuario)
            avatarUser: user.photoURL, //aqui almacena la foto del usuario
            idRestaurant, //[CAP90] aqui referencia al id del restaurante se recibio por propertis en el route
            title, //aqui se guarda titulo del comentario 
            review, 
            rating, //reiting del comentaio  
            createAt: new Date() //new Date(obtiene la fecha del sistema) 
        }
console.log("user.uid");
console.log(user.uid);

        const responseAddReview = await addDocumentWithoutId("reviews", data) //[CAP90] aqui guarda el comentario, responseAddReview (el respon cuando adiciono el review), addDocumentWithoutId(adicioneme un nuevo docuemnto en la coleccion reviews almacena lo que contenga data )
        if (!responseAddReview.statusResponse) { // si no hubo coleccion
            setLoading(false)
            toastRef.current.show("Error al enviar el comentario, por favor intenta más tarde.", 3000)
            return
        }

        const responseGetRestaurant = await getDocumentById("restaurants", idRestaurant) //[CAP90] de la coleccion de restaurants obtenme el id del restaurante 
        if (!responseGetRestaurant.statusResponse) { 
            setLoading(false)
            toastRef.current.show("Error al obtener el restaurante, por favor intenta más tarde.", 3000)
            return
        }

        const restaurant = responseGetRestaurant.document //[CAP90] aqui es en donde queda almacenado el restaurante 
        const ratingTotal = restaurant.ratingTotal + rating //[CAP90] obteniendo el valor desde la propiedad ratingTotal de la base de datos  
        const quantityVoting = restaurant.quantityVoting + 1 //cual es la cantidad de votos
        const ratingResult = ratingTotal / quantityVoting // resultado de los votos, dividido en la cantidad de votos
        const responseUpdateRestaurant = await updateDocument("restaurants", idRestaurant, { // actualiza la coleccion con el metodo importado
            ratingTotal,
            quantityVoting,
            rating: ratingResult
        })
        setLoading(false) // se pone setLoading en false

        if (!responseUpdateRestaurant.statusResponse) { 
            toastRef.current.show("Error al actualizar el restaurante, por favor intenta más tarde.", 3000)
            return
        }

        navigation.goBack() // devuelve a la pantalla anterior
    }

    const validForm = () => { //[CAP89] [validForm-2]
        setErrorTitle(null)   // limpian los errores del titulo
        setErrorReview(null)  // limpian los errores del comentario
        let isValid = true    // asumiendo que todo esta bien 

        if (!rating) { // [CAP89] valida que el usuario asignara por lo menos una estrella 
            toastRef.current.show("Debes darle una puntuación al restaurante.", 3000) // toastRef.current.show(mostrar mensajes en pantalla)
            isValid = false // no paso las validaciones
        }

        if (isEmpty(title)) { // [CAP89] si esta vacia la propiedad (title) entonces ...
            setErrorTitle("Debes ingresar un título a tu comentario.")
            isValid = false
        }

        if (isEmpty(review)) { // [CAP89] si esta vacia la propiedad (review) entonces ...
            setErrorReview("Debes ingresar un comentario.")
            isValid = false
        }

        return isValid
    }

    return (
        <KeyboardAwareScrollView style={styles.viewBody}> // soluciona que el teclado estorbe en la vista
            <View style={styles.viewRating}>
                <AirbnbRating // componente externo
                    count={5} // cantidad de estrellas 
                    reviews={[ "Malo", "Regular", "Normal", "Muy Bueno", "Excelente" ]} //estrellas 
                    defaultRating={0} // inicialmente arranca en 0 estrellas 
                    size={35} // tamaño de las estrellas 
                    onFinishRating={(value) => setRating(value)} //[CAP89] onFinishRating(cuando el usuario termine de hacer su evaluacion), setRating va ser igual al valor que escoja el usuario
                />
            </View>
            <View style={styles.formReview}>
                <Input
                    placeholder="Título..." //[CAP89] 
                    containerStyle={styles.input} 
                    onChange={(e) => setTitle(e.nativeEvent.text)} //[CAP89] aqui se va capturar lo que el usuario digite, (e) se recibe un event, => setTitle(e.nativeEvent.text) para almacenar el evento
                    errorMessage={errorTitle}
                />
                <Input
                    placeholder="Comentario..." //agregar el titulo en la review
                    containerStyle={styles.input}
                    style={styles.textArea}
                    multiline
                    onChange={(e) => setReview(e.nativeEvent.text)} 
                    errorMessage={errorReview}
                />
                <Button
                    title="Enviar Comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={addReview} //[CAP89] [R1] cuando presionen el boton llama el metodo addReview
                />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9}/> //[CAP89] aqui se definio en la vista las propiedades 
            <Loading isVisible={loading} text="Enviando comentario..."/> // Loading componente creado por nosotros 
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1 //utiliza toda la pantalla 
    },
    viewRating: {
        height: 110, // altura 
        backgroundColor: "#f2f2f2" // color de fondo 
    },
    formReview: {
        flex: 1, // utilizar todo el ancho
        alignItems: "center",
        margin: 10,
        marginTop: 40 // margen para que alla mas espacio entre las estrellas 
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 150,
        width: "100%", // 100% del espacio que tenga disponible
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1, 
        justifyContent: "flex-end", // justificacion del contenido hacia la derecha 
        marginTop: 20, //margen superior
        marginBottom: 10, //margen inferior
        width: "95%"
    },
    btn: {
        backgroundColor: "#442484"
    }
})
