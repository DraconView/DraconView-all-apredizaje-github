import React from 'react'
import { StyleSheet } from 'react-native'
import { Overlay } from 'react-native-elements'
//[CAP69] [CAP63] creacion COMPONENTE REUTILIZABLE REACT  </ >
export default function Modal({ isVisible, setVisible, children }) { //destructoring para, setVisible(desactiva por dentro del componente), children(elementos que van a pertenecer al modal)
    return (
        <Overlay // [CAP63] DOCS sirve para pintar el modal 
            isVisible={isVisible} //isVisible(maneja la visibilidad) va ser igual a lo que nos manden por las propiedades
            overlayStyle={styles.overlay} 
            onBackdropPress={() => setVisible(false)} //con este metodo se cierra el modal, tambien cuando presionen por fuera
        > 
            { //aqui se pinta lo que reciba por parametro
                children
            }

        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay: {
        width: "90%" //determina que no utilize el tamaño completo
    }
})
