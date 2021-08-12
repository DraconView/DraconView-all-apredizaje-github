import React from 'react'
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import { Divider } from 'react-native-elements' 
import { useNavigation } from '@react-navigation/native'//para poder usar navegacion
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import LoginForm from '../../components/account/LoginForm'

export default function Login() {
    return (   //ScrollView adapta el contenido a la pantalla de los dispositivos //KeyboardAwareScrollView es mas poderoso que ScrollView
        <KeyboardAwareScrollView>
            <Image
                source={require("../../assets/restaurant-logo.png")}
                resizeMode="contain" //contain, ocupar todo el espacio
                style={styles.image}
            />
            <View style={styles.container}>
                <LoginForm/>
                <CreateAccount/>
                <RecoverPassoword/> //componente interno
            </View>
            <Divider style={styles.divider}/>
        </KeyboardAwareScrollView>
    )
}

function RecoverPassoword() {
    const navigation = useNavigation()  // para cuando se registre devolverlo a la pagina de login

    return (
        <Text 
            style={styles.register} 
            onPress={() => navigation.navigate("recover-password")} // navegacion
        >
            ¿Olvidaste tu contraseña?{" "} // {" "}(espacio en blanco)
            <Text style={styles.btnRegister}>
                Recupérala
            </Text>
        </Text>
    )
} 

function CreateAccount(props) {
    const navigation = useNavigation()

    return (
        <Text 
            style={styles.register}
            onPress={() => navigation.navigate("register")}
        >
            ¿Aún no tienes una cuenta?{" "}
            <Text style={styles.btnRegister}>
                Regístrate
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({ //esto es un componente para la imagen como un ccs
    image : {
        height: 150,
        width: "100%",
        marginBottom: 20 // es para que no se peguen los componentes abajo
    },
    container: {
        marginHorizontal: 40
    },
    divider: {
        backgroundColor: "#442484",
        margin: 40
    },
    register: { //separacion superior 
        marginTop: 15,
        marginHorizontal: 10,
        alignSelf: "center"
    },
    btnRegister: {
        color: "#442484",
        fontWeight: "bold"
    }
})
