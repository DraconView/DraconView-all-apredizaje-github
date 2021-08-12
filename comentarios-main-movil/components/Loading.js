import React from 'react'
import { ActivityIndicator } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Overlay } from 'react-native-elements'

export default function Loading({ isVisible, text }) { // text muestra el texto que va mostrar el loading
    return (
        <Overlay
            isVisible={isVisible} //propiedad si es visible 
            windowBackgoundColor="rgba(0,0,0,0.5)" //colocar el color de fondo
            overlayBackgroundColor="transparent" //tranparente 
            overlayStyle={styles.overlay} //aqui define los estilos, aqui es como si estuviera aplicando ccs a la pantalla
        >
            <View style={styles.view}>
                <ActivityIndicator
                    size="large" //tamaño grande
                    color="#442484"
                />
                {
                    text && <Text style={styles.text}>{text}</Text>
                }
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({ //ventana de modal cargando
    overlay : {
        height: 100, //altura 
        width: 200, //ancho
        backgroundColor: "#fff", //color de fondo 
        borderColor: "#442484",
        borderWidth: 2, //ancho 
        borderRadius: 10 //redondear los bordes
    },
    view: { //estilos para la vista
       flex: 1, //todo el ancho disponible 
       alignItems: "center", //centra horizontalmente 
       justifyContent: "center" //centra verticalmente 
    },
    text: {
        color: "#442484",
        marginTop: 10
    }
})
