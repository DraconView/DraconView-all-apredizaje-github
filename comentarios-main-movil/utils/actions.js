import { firebaseApp } from './firebase' //[CAP33] comandos para conectar con el firebase
import { FireSQL } from 'firesql'
import * as firebase from 'firebase' //[CAP33] para conectar tambien con la base datos 
import 'firebase/firestore' //[CAP33] tener acceso a la base de datos 
import * as Notifications from 'expo-notifications'
import Constans from 'expo-constants' // sirve para saber si se esta ejecutando desde un desde dispositivo fisico

import { fileToBlob } from './helpers'
import { map } from 'lodash'
import { Alert } from 'react-native'
import { Platform } from 'react-native'

const db = firebase.firestore(firebaseApp) // [CAP33] db (constante de nosotros para tener acceso a la bd)
const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" }) // const obligatoria, firebase.firestore(paquete de la base de datos), { includeId: "id" } es el parametro, incluir el id en las consultas 

export const isUserLogged = () => { //[CAP33] [CAP60] m3nu funcion para saber si el usuario esta logueado o no
    let isLogged = false //variable que indica que no esta logueado 
    firebase.auth().onAuthStateChanged((user) => { //firebase.auth()(es una clase) que tiene un metodo .onAuthStateChanged() nos informa cuando el usuario cambio de estado login y nos devuelve como parametro el usuario (user)
        user !== null && (isLogged = true) // si user es !==(direferente) de null significa que si esta logueado , &&(entonces) la variable (isLogged = true) osea esta logueado
    })
    return isLogged
}// ------------------------------------// FIN constante isUserLogged //----------------------------------------------

export const getCurrentUser = () => { // retorna usuario logueado en el sistema 
    return firebase.auth().currentUser
}// ------------------------------------// FIN constante getCurrentUser //--------------------------------------------

export const closeSession = () => {
    return firebase.auth().signOut()
}// ------------------------------------// FIN constante closeSession //---------------------------------------------

export const registerUser = async(email, password) => {
    const result = { statusResponse: true, error: null}
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse = false
        result.error = "Este correo ya ha sido registrado."
    }
    return result
}// ------------------------------------// FIN constante registerUser //---------------------------------------------

export const loginWithEmailAndPassword = async(email, password) => {
    const result = { statusResponse: true, error: null}
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse = false
        result.error = "Usuario o contraseña no válidos."
    }
    return result
} // ------------------------------------// FIN loginWithEmailAndPassword //---------------------------------------------

export const uploadImage = async(image, path, name) => { //subir la imagen a firebase async (image, path, name) este es un metodo asincrono que recibe por parametro la imagen ruta y nombre
    const result = { statusResponse: false, error: null, url: null } //si no se dan los resultados como es
    const ref = firebase.storage().ref(path).child(name) //aqui se referencia a firebase para poder subir la imagen con el metodo firebase que ya esta declarado
    const blob = await fileToBlob(image) //para poder crear el blob

    try { //en caso de que no alla error
        await ref.put(blob) //SUBE LA IMAGEN
        const url = await firebase.storage().ref(`${path}/${name}`).getDownloadURL() //CON ESTO SE CAPTURA LA RUTA DE LA IMAGEN DESDE EL DISPOSITIVO
        result.statusResponse = true
        result.statusResponse = true
        result.url = url
    } catch (error) {
        result.error = error
    }
    return result
} // ------------------------------------// FIN uploadImage //----------------------------------------------------

export const updateProfile = async(data) => { //actualiza la imagen del perfil, tambien puede cambiar nombres y apellidos 
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updateProfile(data)
    } catch (error) { //si no pudo actulizar la imagen
        result.statusResponse = false
        result.error = error
    }
    return result     
} // ------------------------------------// FIN updateProfile //----------------------------------------------------

export const reauthenticate = async(password) => {
    const result = { statusResponse: true, error: null }
    const user = getCurrentUser()
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, password)

    try {
        await user.reauthenticateWithCredential(credentials)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
} // ------------------------------------// FIN reauthenticate //----------------------------------------------------

export const updateEmail = async(email) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updateEmail(email)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
} // ------------------------------------// FIN updateEmail //----------------------------------------------------

export const updatePassword = async(password) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updatePassword(password)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
} // ------------------------------------// FIN updatePassword //----------------------------------------------------

export const addDocumentWithoutId = async(collection, data) => { //[CAP90] añadir documentos a una coleccion, sin ID por que lo genera automaticamnete firbase, se le va pasar por parametro un metodo asincrono una coleccion y se le pasa la data(contiene todos los datos del restaurante) 
    const result = { statusResponse: true, error: null } // true(si no hay problemas) y null(si no hay errores)
    try {
        await db.collection(collection).add(data) // db(base de datos) collection(coleccion) add(añadir) la (data)
    } catch (error) { // manejador de errores 
        result.statusResponse = false
        result.error = error
    }
    return result     
} // ---------------------------------// FIN addDocumentWithoutId //----------------------------------------------------

export const getRestaurants = async(limitRestaurants) => {      //[CAP78] retorna la lista de restaurantes, pide como parametro el limite
    const result = { statusResponse: true, error: null, restaurants: [], startRestaurant: null }    // restaurants: [](retorna la lista de restaurantes), startRestaurant: null(cuando obtenga una catidad de restaurantes indica de hay en adelante para siguiente consulta) 
    try {                                       //startRestaurant TAMBIEN HUBIERA SIDO MEJOR DECLARADO COMO lastRestaurant o ultimo
        const response = await db               //[CAP78] ir a la base de datos 
            .collection("restaurants")          //[CAP78] a la coleccion de restaurantes
            .orderBy("createAt", "desc")        //[CAP78] ordenar por fecha de creacion de manera descendente
            .limit(limitRestaurants)            //[CAP78] limita la consulta al parametro limitRestaurants
            .get()                              //[CAP78] solicitar
        if (response.docs.length > 0) {         // docs(RETORNA LA COLECCION), aqui se pregunta si hay datos: si la repuesta en la coleccion docs en la propiedad(length) si es mayor a 0. significa que hubo restaurantes ...
            result.startRestaurant = response.docs[response.docs.length - 1]    //result en la variabel startRestaurant(que es el restaurante de inicio para siguiente consulta) se le va llevar lo que hay en response en la coleccion docs(documentos) en el ultimo [response.docs.length - 1] para que almacene en el startrestaurant en ultimo restaurante que se consumio
        }
        response.forEach((doc) => {             // aqui se itera el dentro de response la coleccion .doc y por cada documento de esa respuesta...
            const restaurant = doc.data()       // se creara una cosnt restaurant, doc.data(nos da la data, para poder hacer los datos del restaurantes visibles) 
            restaurant.id = doc.id              // el id se maneja por aparte 
            result.restaurants.push(restaurant) // como queremos almacenar eso en el resultado, result. en la coleccion(restaurants) se le hace un push, se va agregar el objeto restaurant que se acabo de obtener 
        })
    } catch (error) {                           //manejo de errores
        result.statusResponse = false
        result.error = error
    }
    return result     
} // --------------------------------// FIN getRestaurants //----------------------------------------------------

export const getMoreRestaurants = async(limitRestaurants, startRestaurant) => { //[CAP80] recibe como parametro el limite, y el restaurante inicial desde donde va arrancar
    const result = { statusResponse: true, error: null, restaurants: [], startRestaurant: null }
    try {
        const response = await db
            .collection("restaurants")
            .orderBy("createAt", "desc")
            .startAfter(startRestaurant.data().createAt) // startAfter(inicia despues del startRestaurant) 
            .limit(limitRestaurants)
            .get()
        if (response.docs.length > 0) {
            result.startRestaurant = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const restaurant = doc.data()
            restaurant.id = doc.id
            result.restaurants.push(restaurant)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
} // ------------------------------// FIN getMoreRestaurants //----------------------------------------------------

export const getDocumentById = async(collection, id) => { // se le pasa el Id y retorna un documento
    const result = { statusResponse: true, error: null, document: null }
    try {
        const response = await db.collection(collection).doc(id).get() //doc(id) referenciar un objeto en una coleccion
        result.document = response.data() //data queda toda la informacion menos el Id
        result.document.id = response.id //va ser igual response.id lo que devolvio firebase 
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}// -------------------------------//[CAP90] getDocumentById ------------------------------------------------

export const updateDocument = async(collection, id, data) => { //[CAP90] actualiza documentos de una coleccion, aqui se le pasa la coleccion , id del documento que se desea actualizar y la data que se quiera actualizar
    const result = { statusResponse: true, error: null } // retorna statusResponse y un error 
    try {
        await db.collection(collection).doc(id).update(data) //  db.collection(ir a la coleccion), .doc(id)ir a ese documento, update(data) actualiza la data
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
} // --------------------------------// FIN updateDocument //----------------------------------------------------

export const getRestaurantReviews = async(id) => { //[CAP90] obtener comentarios de un restaurante, por parametro id
    const result = { statusResponse: true, error: null, reviews: [] } // reviews: [](objeto con las reviews)
    try {
        const response = await db // respuesta va ir a la base de datos 
            .collection("reviews") // a la colleccion
            .where("idRestaurant", "==", id) // deme los comentarios pero no todos where(donde) idRestaurant, ==(sea igual) la id(que nos pasaron)
            .get()
            //.orderBy("createAt", "desc") [CAP90] esto arroja error
        response.forEach((doc) => { // forEach(por cada) doc(documento)
            const review = doc.data() // crear una variable review y cada una va ser doc.data(), PARA LEER LA INFORMACION DEBE SER UN doc.data()
            review.id = doc.id // va ser igual 
            result.reviews.push(review) //empujar
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
} // ------------------------------// FIN getRestaurantReviews //----------------------------------------------------

export const getIsFavorite = async(idRestaurant) => { //[CAP94] verifica si la publicacion es favorita para un usuario
    const result = { statusResponse: true, error: null, isFavorite: false } // declara en isFavorite: false
    try {
        const response = await db
            .collection("favorites") 
            .where("idRestaurant", "==", idRestaurant) // deme los favoritos donde el id de la publicacion sea igual al parametro idRestaurant que me han pasado 
            .where("idUser", "==", getCurrentUser().uid) // y donde el id del usuario sea igual metodo getCurrentUser().uid
            .get()
        result.isFavorite = response.docs.length > 0 // response(respuesta de la consulta) si da mayor a 0 significa que si es favorito
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
} // ----------------------------------// FIN getIsFavorite //----------------------------------------------------

export const deleteFavorite = async(idRestaurant) => { //[CAP95] ELIMINAR DE FAVORITOS  
    const result = { statusResponse: true, error: null }
    try {
        const response = await db
            .collection("favorites") // ir a la coleccion de favoritos 
            .where("idRestaurant", "==", idRestaurant)
            .where("idUser", "==", getCurrentUser().uid)
            .get()
        response.forEach(async(doc) => { // iterar consulta ejecutando un forEach de cada documento
            const favoriteId = doc.id // para que de el codigo de la collecion, que va ser igual a doc.id
            await db.collection("favorites").doc(favoriteId).delete() // tenemos un await en la coleccion de favorites, en el documento que tiene el doc(favoriteId se le hace un delte a este documento 
        })    
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
} // ---------------------------------// FIN deleteFavorite //----------------------------------------------------

export const getFavorites = async() => { //[CAP94] RETORNA LOS FAVORITOS DEL RESTAURANTE LOGUEADO
    const result = { statusResponse: true, error: null, favorites: [] } // se pasa una coleccion de favoritos con un array vacio
    try { // se crea una respuesta
        const response = await db // vallase a los favoritos
            .collection("favorites") // mientras el id del usuario sea igual 
            .where("idUser", "==", getCurrentUser().uid) //retorna una coleccion mientras el id del user sea igual getCurrentUser().uid(retorna los restaurantes del usuario en una coleccion)
            .get()
        await Promise.all( // sirve para hacer una busqueda dentro del ciclo
            map(response.docs, async(doc) => { // esn esta coleccion mapea cada documento 
                const favorite = doc.data() // aqui se obtiene el favorito sin tener que iterar 
                const restaurant = await getDocumentById("restaurants", favorite.idRestaurant) // de la coleccion de restaurants vas a buscar idRestaurant
                if (restaurant.statusResponse) { // si pudo obtener el restaurante 
                    result.favorites.push(restaurant.document) // al result en la coleccion de favoritos vas a push(agregar) restaurant.document
                }
            })
        )
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
} // ----------------------------------// FIN getFavorites //----------------------------------------------------

export const getTopRestaurants = async(limit) => { //[CAP101] recibe como paramatro el limite de los que se quiere que se muestren 
    const result = { statusResponse: true, error: null, restaurants: [] } // retorna una coleccion de restaurants, un arreglo
    try {
        const response = await db   
            .collection("restaurants") // ir a la coleccion de restaurantes
            .orderBy("rating", "desc") // probar ASC en minuscula retorna los restaurantes ordenados por rating desc
            .limit(limit) // para que no de los devuelva todo se le coloca limit que va ser igual al parametro que esta recibiendo este metodo
            .get()
        response.forEach((doc) => { // aqui se itera la respuesta y por cada documento ... 
            const restaurant = doc.data() // restaurant va ser igual al metodo data(que permite leer un documento)
            restaurant.id = doc.id // y el restaurant.id va ser igual a doc.id
            result.restaurants.push(restaurant) // al resultado en la coleccion de restaurant va adicionar un arreglo con el restaurante
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
} // --------------------------------// FIN getTopRestaurants //----------------------------------------------------

export const searchRestaurants = async(criteria) => { //[CAP104]
    const result = { statusResponse: true, error: null, restaurants: [] }
    try {
        result.restaurants = await fireSQL.query(`SELECT * FROM restaurants WHERE name LIKE '${criteria}%'`) // result.restaurants(al resultado en la coleccion de restaurant), fireSQL(dentro de nuestra constante)
    } catch (error) { // buscame todos los restaurant donde el nombre empize por el criterio de busqueda, LIKE(empize) ${criteria}(cualquier palabra)// consulta quemada 'Burger%'` 
        result.statusResponse = false
        result.error = error
    }
    return result     
} // ---------------------------------// FIN searchRestaurants //----------------------------------------------------

export const getToken = async() => { //[CAP101] cada usuario recibira las notoficaciones por token
    if (!Constans.isDevice) { //[CAP101] revisa si la aplicacion se ejecutando desde un disposotivo fisico
        Alert.alert("Debes utilizar un dispositivo físico para poder utilizar las notificaciones.")
        return // retorne true Device si es un dispositivo fisico
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync() // permisos para enviar notificaciones, status:(va ser igual a lo que devuelve) existingStatus que se le esta hiciendo destructoring
    let finalStatus = existingStatus // finalStatus va ser igual existingStatus
    if (existingStatus !== "granted") { // si el existingStatus(permiso) es diferente de granted(es que dieron permiso)
        const { status } = await Notifications.requestPermissionsAsync() // destructoring a status para que la primera vez requestPermissionsAsync pida permiso
        finalStatus = status // lo que quede se va almacenar en finalStatus
    }

    if (finalStatus !== "granted") { // si finalStatus es diferente a granted(permiso autorizado)
        Alert.alert("Debes dar permiso para acceder a las notificaciones.")
        return
    }
    // token(es el indicativo de lo que se puede enviar al usuario)
    const token = (await Notifications.getExpoPushTokenAsync()).data // getExpoPushTokenAsync(retorna las notificaciones) y se le obtiene la variable data

    if (Platform.OS == "android") { // Platform.OS(sistema operativo) es igual a andoid 
        Notifications.setNotificationChannelAsync("default", { // setNotificationChannelAsync(default primer parametro)
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C" // color fondo de la notificacion
        })
    }

    return token
} // ------------------------------------// FIN getToken //----------------------------------------------------

export const addDocumentWithId = async(collection, data, doc) => { //[CAP112] añadir documentos a una coleccion, con ID asignado
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).doc(doc).set(data) //collection(collection) en esa coleccion , .doc(doc)(en este documento), set(data)(le pasa la data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
} // ----------------------------------// FIN addDocumentWithId //----------------------------------------------------

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    })
 })

 export const startNotifications = (notificationListener, responseListener) => { //[CAP114] inicia las notificaciones 
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log(notification)       
    })   
    responseListener.current = Notifications.addNotificationResponseReceivedListener(notification => {
        console.log(notification)
    })  
    return () => {
        Notifications.removeNotificationSubscription(notificationListener)
        Notifications.removeNotificationSubscription(responseListener)
    }
 } // --------------------------------// FIN startNotifications //----------------------------------------------------

export const sendPushNotification = async(message) => { 
    let response = false
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message), // el body(mensaje) se va convertir en json
    }).then(() => response = true) 
    return response
} // --------------------------------// FIN sendPushNotification //----------------------------------------------------

export const setNotificationMessage = (token, title, body, data) => {
    const message = { // creacion de objeto message
        to: token,
        sound: "default",
        title: title,
        body: body,
        data: data
    }
  
    return message
} // --------------------------------// FIN setNotificationMessage //----------------------------------------------------

export const getUsersFavorite = async(restaurantId) => {
    const result = { statusResponse: true, error: null, users: [] }
    try {
        const response = await db.collection("favorites").where("idRestaurant", "==", restaurantId).get()
        await Promise.all(
            map(response.docs, async(doc) => {
                const favorite = doc.data()
                const user = await getDocumentById("users", favorite.idUser)
                if (user.statusResponse) {
                    result.users.push(user.document)
                }
            })
        )
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
} // ----------------------------------// FIN getUsersFavorite //----------------------------------------------------

export const sendEmailResetPassword = async(email) => { //[CAP123] recuperar contraseña, recibe un email registrado
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().sendPasswordResetEmail(email) // firebase.auth(metodos de autenticacion)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
} // --------------------------------// FIN sendEmailResetPassword //----------------------------------------------------