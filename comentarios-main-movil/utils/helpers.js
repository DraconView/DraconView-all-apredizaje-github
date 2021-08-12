import * as Permissions from 'expo-permissions' //[CAP69] //importa los permisos
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location' //[CAP69]
import { Alert, Linking } from 'react-native' //colocar mensajes tipo popad
import { size } from 'lodash'

export function validateEmail(email) { // validacion de emails
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
} // ------------------------------------// FIN constante validateEmail //----------------------------------------------

export const loadImageFromGallery = async(array) => { //funcion que importa imagenes desde la galeria, resive como parametro un array y ese parametro indica la dimension de la imagen
    const response = { status: false, image: null } //aqui quiere decir que no pudo cargar la imagen
    const resultPermissions = await Permissions.askAsync(Permissions.CAMERA) //aqui se le pide permiso al sistema operativo para acceder a la camara 
    if (resultPermissions.status === "denied") { //si el usuario niega los permisos entonces..
        Alert.alert("Debes de darle permiso para accerder a las imágenes del teléfono.")
        return response
    }   
    const result = await ImagePicker.launchImageLibraryAsync({  //launchImageLibraryAsync propiedad que permite tomar la imagen de la libreria     
        allowsEditing: true, //true para que el usuario pueda seleccionar la imagen
        aspect: array //el aspecto de la imagen va ser el array que se esta pasando de la imagen
    })
    if (result.cancelled) { //si el usuario cancela cargar la imagen
        return response
    }
    response.status = true //si cargo la imagen
    response.image = result.uri //aqui es la url donde queda la imagen
    return response
}// ------------------------------------// FIN constante loadImageFromGallery //----------------------------------------------

export const loadImageFromCamera = async(array) => { // prueba carga de iamgen directa desde el celular 
    const response = { status: false, image: null }
    const resultPermissions = await Permissions.askAsync(Permissions.CAMERA)
    if (resultPermissions.status === "denied") {
        Alert.alert("Debes de darle permiso para accerder a las imágenes del teléfono.")
        return response
    }   
    const result = await ImagePicker.launchCameraAsync({ // solo cambia esta linea a diferencia de loadImageFromGallery     
        allowsEditing: true,
        aspect: array
    })
    if (result.cancelled) {
        return response
    }
    response.status = true
    response.image = result.uri
    return response
}// --------------------------------// FIN constante loadImageFromCamera //----------------------------------------// 

export const fileToBlob = async(path) => { //convertir imagen en blob, path es la ruta
    const file = await fetch(path)
    const blob = await file.blob()
    return blob
}
//-------------------------- [CAP69] optener la localizacion del telefono -----------------------------------------
export const getCurrentLocation = async() => { //async() metodo asincrono por que se demora un rato en encontrar la ubicacion
    const response = { status: false, location: null } //valores por defecto de responese   
    const resultPermissions = await Permissions.askAsync(Permissions.LOCATION) //pide permiso al usuario para obtener la ubicacion
    if (resultPermissions.status === "denied") { //si el usuario niega los permisos...
        Alert.alert("Debes dar permisos para la localización.") //mensaje para el usuario
        return response
    }
    const position = await Location.getCurrentPositionAsync({})//ubicación actual del usuario   
    const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.001, //diferencia que se a obtenido
        longitudeDelta: 0.001
    }//si llega hasta aqui fue por que todo funciono bien 
    response.status = true
    response.location = location  
    return response //retorna la respuesta a response = { status: false, location: null }
}
//------------------------ //[CAP69] vista del celular en recuadro lista de publicaciones //-----------------
export const formatPhone = (callingCode, phone) => {
    if (size(phone) < 10) //[CAP107] si el tamañp de phone es menor a 10 
    {
        return `+(${callingCode}) ${phone}` // retorna el callingCode concatenado con el telefono 
    }
    return `+(${callingCode}) ${phone.substr(0, 3)} ${phone.substr(3, 3)} ${phone.substr(6, 4)}`
}//----------------------------------- // formatPhone //------------------------------------------------------

export const callNumber = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`)
} //---------------------------------- // callNumber //------------------------------------------------------

export const sendWhatsApp = (phoneNumber, text) => { //[CAP107] por parametro se pasa el telefono y el mensaje que se quiere enviar
    const link = `https://wa.me/${phoneNumber}?text=${text}` // se interpola la constante con el numero y el mensaje
    Linking.canOpenURL(link).then((supported) => { // canOpenURL(que si nos puede abrir este link), si lo puede hacer devuelve una promesa, llama a la variable supported
        if (!supported) { // si no esta soportada la operacion de wasap entonces
            Alert.alert("Por favor instale WhatsApp para enviar un mensaje directo")
            return
        }
        return Linking.openURL(link) // abre el link
    })
} //---------------------------------- // sendWhatsApp //----------------------------------------------------

export const sendEmail = (to, subject, body) => { // to(direccion a quien se va enviar el email), subject(asunto o titulo del mensaje), body(contenido del mensaje)
    Linking.openURL(`mailto:${to}?subject=${subject}&body=${body}`)
} //----------------------------------- // sendEmail //--------------------------------------------------------