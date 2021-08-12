import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { size } from 'lodash'
import { useNavigation } from '@react-navigation/native' //aqui se importa la navegacion
//! setLoading(false) posiblemente este metodo queda activo cuando se registra el usuario
import { validateEmail } from '../../utils/helpers' //funcion valida los caracteres del campo email
import { addDocumentWithId, getCurrentUser, getToken, registerUser } from '../../utils/actions'
import Loading from '../Loading'
// REGISTRO DE USUARIOS //AQUI SE VA CREAR UN ESTADO DONDE SE VA ALMACENAR TODA LA DATA DEL FORMULARIO 
export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues()) //estado arranque con esta funcion
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorConfirm, setErrorConfirm] = useState("")
    const [loading, setLoading] = useState(false) //el loading no deberia mostrarse por eso se puso en false 

    const navigation = useNavigation() //manera como se puede usar la navegacion

    const onChange = (e, type) => { //se crea un metodo para que cuando cambie cualquier campo nos almacene email passwor o comfirm //(e, type) recibe por parametro el event y tipo de campo
        setFormData({ ...formData, [type]: e.nativeEvent.text }) //setFormData es el modificador,{ ...formData va llevar lo que tiene pero le vas a colocar al campo tipo el valor de lo que nos devuelva el texto de lo que lleva el e.nativeEvent.text
    } //se mete el [type] entre corchetes para que el json sea dinamico

    const doRegisterUser = async() => { // metodo para el registro de usuario
        if (!validateData()) {
            return;
        }

        setLoading(true)
        const result = await registerUser(formData.email, formData.password)
        if (!result.statusResponse) {
            setLoading(false)
            setErrorEmail(result.error)
            return
        }

        const token = await getToken() //[CAP112]  crea colecciones con registro de usuario asignadole token en una coleccion paralela  
        const resultUser = await addDocumentWithId("users", { token }, getCurrentUser().uid) // addDocumentWithId("users")(guarda en una coleccion nueva que se llama users), la data guarda una coleccion que contiene el { token }, para el Id usara getCurrentUser(), .uid(para que no genere un id diferente)
        if (!resultUser.statusResponse) { // si no pudo guardar el token del usuario
            setLoading(false)
            setErrorEmail(result.error)
            return
        }       

        setLoading(false)
        navigation.navigate("account") //navega al stack
    }

    const validateData = () => {
        setErrorConfirm("")
        setErrorEmail("")
        setErrorPassword("")
        let isValid = true

        if(!validateEmail(formData.email)) { //valida email = !validateEmail si hay un error en el email, hay un error
            setErrorEmail("Debes de ingresar un email válido.")
            isValid = false
        }

        if(size(formData.password) < 6) {
            setErrorPassword("Debes ingresar una contraseña de al menos seis carácteres.")
            isValid = false
        }

        if(size(formData.confirm) < 6) {
            setErrorConfirm("Debes ingresar una confirmación de contraseña de al menos seis carácteres.")
            isValid = false
        }

        if(formData.password !== formData.confirm) {
            setErrorPassword("La contraseña y la confirmación no son iguales.")
            setErrorConfirm("La contraseña y la confirmación no son iguales.")
            isValid = false
        }

        return isValid //retorna valido     
    }

    return (
        <View style={styles.form}>
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu email..."
                onChange={(e) => onChange(e, "email")} // onChange cuando cambie devuelve un evento que es el contenido
                keyboardType="email-address" //habilita el campo para un teclado especial para los emails
                errorMessage={errorEmail} //le pinta al usuario
                defaultValue={formData.email} //Proporciona un valor inicial que cambiará cuando el usuario comience a escribir
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu contraseña..."
                password={true}
                secureTextEntry={!showPassword} //va ser lo contrario de mostrar el password
                onChange={(e) => onChange(e, "password")} //onChange cuando cambie devuelve un evento que es el contenido
                errorMessage={errorPassword} //liga el input al estado
                defaultValue={formData.password} //errorMessage es igual a nuestra variable donde tenemos el error
                rightIcon={
                    <Icon
                        type="material-community"
                        name={ showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.icon}
                        onPress={() => setShowPassword(!showPassword)} //nos alterna el estado del showPassword cargando lo contrario con el setShowPassword
                    />
                }
            />
            <Input
                containerStyle={styles.input}
                placeholder="Confirma tu contraseña..." //La cadena que se renderizará antes de que se ingrese la entrada de texto.
                password={true}
                secureTextEntry={!showPassword} //Si es verdadero, el ingreso de texto oculta el texto ingresado para que el texto sensible como las contraseñas permanezca seguro. El valor predeterminado es falso.
                onChange={(e) => onChange(e, "confirm")}
                errorMessage={errorConfirm}
                defaultValue={formData.confirm} //onChange cuando cambie devuelve un evento que es el contenido
                rightIcon={
                    <Icon
                        type="material-community"
                        name={ showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.icon}
                        onPress={() => setShowPassword(!showPassword)} //nos alterna el estado del showPassword cargando lo contrario con el setShowPassword
                    />
                }
                />
            <Button
                title="Registrar Nuevo Usuario"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={() => doRegisterUser()}
            />
            <Loading isVisible={loading} text="Creando cuenta..."/>
        </View>
    )
}

const defaultFormValues = () => { //va devolver los valores del formulario
    return { email: "", password: "", confirm: "" }
}

const styles = StyleSheet.create({
    form: {
        marginTop: 30
    },
    input: {
        width: "100%"
    },  
    btnContainer: {
        marginTop: 20,
        width: "95%",
        alignSelf: "center"
    },
    btn: {
        backgroundColor: "#442484"
    },
    icon: {
        color: "#c1c1c1"
    }
})
