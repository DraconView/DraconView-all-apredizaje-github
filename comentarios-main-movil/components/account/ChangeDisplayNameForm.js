import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button,Input } from 'react-native-elements'
import { isEmpty } from 'lodash'
//[CAP54] 
import { updateProfile } from '../../utils/actions'
//ESTO SE PINTA EN EL MODAL DE FORMA DINAMICA CON LO QUE RECIBE DEL AccountOptions
export default function ChangeDisplayNameForm({ displayName, setShowModal, toastRef, setRelodUser }) {
    const [newDisplayName, setNewDisplayName] = useState(null) //[CAP55] aqui recibira el nuevo nombre que se va cambiar 
    const [error, setError] = useState(null) //[CAP55] aqui es donde se va pintar el error  
    const [loading, setLoading] = useState(false) //[CAP55]

    const onSubmit = async() => { //[CAP55] aqui se valida que se digite un nombre diferente al que han ingresado 
        if (!validateForm()) { //si no pasa las validaciones 
            return
        }

        setLoading(true)
        const result = await updateProfile({ displayName: newDisplayName })
        setLoading(false)

        if (!result.statusResponse) {
            setError("Eror al actualizar nombres y apellidos, intenta más tarde.")
            return
        }

        setRelodUser(true) //[CAP55] aqui llama al setRelodUser AccountOptions y este llama al de UserLogged min 21 reload
        toastRef.current.show("Se han actualizado nombres y apellidos.", 3000)
        setShowModal(false)
    }

    const validateForm = () => { 
        setError(null) //aqui se inializa en null para evitar que quede cargando un error
         //isEmpty de lodash (valida que el usuario si ingreso algo) 
        if(isEmpty(newDisplayName)) { //isEmpty valida si newDisplayName esta vacio ... entoces pinta el setError
            setError("Debes ingresar nombres y apellidos.")
            return false //osea no paso las validaciones  
        }

        if(newDisplayName === displayName) { //si newDisplayName es igual a displayName entonces ...
            setError("Debes ingresar nombres y apellidos diferentes a los actuales.")
            return false //osea no paso las validaciones 
        }

        return true
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Ingresa nombres y apellidos"
                containerStyle={styles.input}
                defaultValue={displayName}
                onChange={(e) => setNewDisplayName(e.nativeEvent.text)} //[CAP55] onChange (cuando cambie ese boton) , va almacenar ese nuevo valor, esta funcion tipo flecha va recibir un event(e) y cuando cambie eso setNewDisplayName(e.nativeEvent.text de esta manera se obtiene lo que usuario digite  
                errorMessage={error} //si hay un error esta propiedad va estar ligada a nuestro estado
                rightIcon={{ //aqui lleva doble llave por es un objeto 
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#c2c2c2"
                }}
            />
            <Button //este boton sirve para que el usuario confirme que desea cambiar nombres y apellidos
                title="Cambiar Nombres y Apellidos"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={loading} //este no el loading de nosotros sino el nativo de react que cumple la misma funcion
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingVertical: 10 // [CAP54] para que no quede pegado en los bordes de arriba y abajo 
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        width: "95%"
    },
    btn: {
        backgroundColor: "#442484"
    }
})
