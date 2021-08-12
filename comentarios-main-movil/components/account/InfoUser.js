import React, { useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements'

import { updateProfile, uploadImage } from '../../utils/actions'
import { loadImageFromGallery, loadImageFromCamera } from '../../utils/helpers'

export default function InfoUser({ user, setLoading, setLoadingText }) { //[CAP51]
    const [photoUrl, setPhotoUrl] = useState(user.photoURL) // este estado inicia con lo que tenga user.photoURL

    const changePhotoFromGallery = async() => {
        const result = await loadImageFromGallery([1, 1])
        if (!result.status) {
            return
        }
        setLoadingText("Actualizando imagen...")
        setLoading(true)
        const resultUploadImage = await uploadImage(result.image, "avatars", user.uid)
        if (!resultUploadImage.statusResponse) {
            setLoading(false)
            Alert.alert("Ha ocurrido un error al almacenar la foto de perfil.")
            return
        }
        const resultUpdateProfie = await updateProfile({ photoURL: resultUploadImage.url })
        setLoading(false)
        if (resultUpdateProfie.statusResponse) {
            setPhotoUrl(resultUploadImage.url)
        } else {
            Alert.alert("Ha ocurrido un error al actualizar la foto de perfil.")
        }
    }

    const changePhotoFromCamera = async() => {
        const result = await loadImageFromCamera([1, 1])
        if (!result.status) {
            return
        }
        setLoadingText("Actualizando imagen...")
        setLoading(true)
        const resultUploadImage = await uploadImage(result.image, "avatars", user.uid)
        if (!resultUploadImage.statusResponse) {
            setLoading(false)
            Alert.alert("Ha ocurrido un error al almacenar la foto de perfil.")
            return
        }
        const resultUpdateProfie = await updateProfile({ photoURL: resultUploadImage.url })
        setLoading(false)
        if (resultUpdateProfie.statusResponse) {
            setPhotoUrl(resultUploadImage.url)
        } else {
            Alert.alert("Ha ocurrido un error al actualizar la foto de perfil.")
        }
    }

    function PhotoSource() {
        Alert.alert(  
        'Elija una opción',  
        'De dónde quiere obtener la imagen?',  
        [  
            {text: 'Cancelar', onPress: () => null},  
            {  
                text: 'Cámara',  
                onPress: changePhotoFromCamera  
            },  
            {
                text: 'Galería',
                onPress: changePhotoFromGallery
            },  
        ],  
        {cancelable: false}  
        )  
    }

    /*
    const changePhoto = async() => { //cuando diga cambiar foto
        const result = await loadImageFromGallery([1, 1]) //([1, 1]) esta es la relacion de la imagen osea cuadrada
        if (!result.status) { //si no cargo el resultado ...
            return //pa fuera 
        }
        setLoadingText("Actualizando imagen...") //cuando el usuario valla actualizando
        setLoading(true) //aqui se dispara el indicador de actividad 
        const resultUploadImage = await uploadImage(result.image, "avatars", user.uid) // esperar(await) a que suba el objeto uploadImage, sube lo que tenga result.image, se va almacenar en la carpeta "avatars",user.uid con nombre se va subir la imagen que va ser el id del usuario 
        if (!resultUploadImage.statusResponse) { //si no sube la imagen ...
            setLoading(false) // desactiva setLoading
            Alert.alert("Ha ocurrido un error al almacenar la foto de perfil.")
            return
        }
        const resultUpdateProfie = await updateProfile({ photoURL: resultUploadImage.url }) //updateProfile aqui se llama al metodo que actualiza el perfil se le pasa la data, el campo photoURL se va actualizar con lo que devuelva resultUploadImage en su campo .url
        setLoading(false) //aqui setLoading es igual false por que ya termino el procesamiento
        if (resultUpdateProfie.statusResponse) { //aqui se pregunta si o no actualizar la imagen, si el resultado de resultUpdateProfie statusResponse si lo pudo hacer ...
            setPhotoUrl(resultUploadImage.url) //... cambiar la foto de perfil utilizando un estado ,si hubo respuesta de que la pudo cambiar setPhotoUrl va ser igual al resultado de resultUploadImage.url
        } else { // en caso de que no pueda altualizar la foto 
            Alert.alert("Ha ocurrido un error al actualizar la foto de perfil.")
        }
    }
*/
    return ( //Avatar importa la foto del usuario
        <View style={styles.container}>
            <Avatar
                rounded //redondeado
                size="large"
                onPress={PhotoSource} //cuando el usuario toque la foto es por que va cambiar
                source={
                    photoUrl // si hay foto 
                        ? { uri: photoUrl } // uri va ser igual a photoUrl
                        : require("../../assets/avatar-default.jpg")
                }
            />
            <View style={styles.infoUser}>
                <Text style={styles.displayName}>
                    {
                        user.displayName ? user.displayName : "Anónimo"
                    }
                </Text>
                <Text>{user.email}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center", //alinear elementos al centro
        justifyContent: "center", // centrar horizontal y vertical
        flexDirection: "row", //LOS ELEMENTOS LOS APILA HORIZONTALMENTE 
        backgroundColor: "#f9f9f9",
        paddingVertical: 30
    },
    infoUser: {
        marginLeft: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5
    }
})
