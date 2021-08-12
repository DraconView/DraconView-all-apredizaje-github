import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements' //los botones de react-native-elements son mejores que los de react-native
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'
 // ESTE ARCHIVO ES PARA LOS USUARIOS LOGUEADOS
import { closeSession, getCurrentUser } from '../../utils/actions'
import Loading from '../../components/Loading'
import InfoUser from '../../components/account/InfoUser'
import AccountOptions from '../../components/account/AccountOptions'

export default function UserLogged() {
    const toastRef = useRef()
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const [user, setUser] = useState(null)
    const [relodUser, setRelodUser] = useState(false) //[CAP55] estado que recarga cuando se produsca la funcion onSumit

    useEffect(() => {
        setUser(getCurrentUser())
        setRelodUser(false)
    }, [relodUser]) //[CAP55] si se deja useEffect con el corchete vacio solo carga cuando cargue en pantalla 

    return (
        <View style={styles.container}>
            {
                user && ( //esto es como un if si hay usario &&(y)
                    <View>
                        <InfoUser 
                            user={user}  // {user} pasa el usuario por propiedades
                            setLoading={setLoading} 
                            setLoadingText={setLoadingText}
                        /> [CAP52]
                        <AccountOptions // envia datos a
                            user={user} //aqui se le va pasar el usuario
                            toastRef={toastRef} 
                            setRelodUser={setRelodUser} //[CAP55] cambia el useEffect true  //[CAP55] aqui llama al setRelodUser AccountOptions y este llama al de UserLogged min 21 reload
                        />
                    </View>
                )
            }
            <Button
                title="Cerrar Sesión"
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionTitle}
                onPress={() => { //ENVIA LA NAVEGACION A LA PARTE DE RESTAURANTES
                    closeSession()
                    navigation.navigate("restaurants")
                }}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text={loadingText}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: "100%",
        backgroundColor: "#f9f9f9"
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 5,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#442484",
        borderBottomWidth: 1,
        borderBottomColor: "#442484",
        paddingVertical: 10
    },
    btnCloseSessionTitle: {
        color: "#442484"
    }
})
