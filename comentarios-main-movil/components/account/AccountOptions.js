import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Icon } from 'react-native-elements'
import { map } from 'lodash';
//OPCIONES DE USUARIO cambiar nombre emails password
import Modal from '../Modal';
import ChangeDisplayNameForm from './ChangeDisplayNameForm';
import ChangeEmailForm from './ChangeEmailForm';
import ChangePasswordForm from './ChangePasswordForm';
 //[CAP55] aqui llama al setRelodUser AccountOptions y este llama al de UserLogged min 21 reload
export default function AccountOptions({ user, toastRef, setRelodUser }) { //[CAP52] AQUI RECIBE DATOS DE UserLoogged que son user, toastRef, setRelodUser
    const [showModal, setShowModal] = useState(false) 
    const [renderComponent, setRenderComponent] = useState(null) //[CAP54] es el que sirve para enviar al modal las cosas dinamicas

    const generateOptions = () => {
        return [
            {
                title : "Cambiar Nombres y Apellidos",
                iconNameLeft: "account-circle",
                iconColorLeft: "#a7bfd3", //propiedad para indicar el icono de la izquierda
                iconNameRight: "chevron-right",
                iconColorRight: "#a7bfd3",
                onPress: () => selectedComponent("displayName") // [CAP53] quiere decir que el componente que seleccionaron 
            },
            {
                title : "Cambiar Email",
                iconNameLeft: "at",
                iconColorLeft: "#a7bfd3",
                iconNameRight: "chevron-right",
                iconColorRight: "#a7bfd3",
                onPress: () => selectedComponent("email")
            },
            {
                title : "Cambiar Contraseña",
                iconNameLeft: "lock-reset",
                iconColorLeft: "#a7bfd3",
                iconNameRight: "chevron-right",
                iconColorRight: "#a7bfd3",
                onPress: () => selectedComponent("password")
            },
        ]
    }

    const selectedComponent = (key) => { //[CAP53] cuando precionen aqui dependiendo del cambio
        switch (key) {
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm // todo se recibe en ChangeDisplayNameForm que conecta con el archivo ChangeDisplayNameForm
                        displayName={user.displayName} //[CAP53] // es lo que devuelve de firebase
                        setShowModal={setShowModal} // cierra el modal
                        toastRef={toastRef} //cuando cambien el mensaje 
                        setRelodUser={setRelodUser} //
                    />
                )
                break;
            case "email":
                setRenderComponent(
                    <ChangeEmailForm
                        email={user.email}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setRelodUser={setRelodUser}
                    />
                )
                break;
            case "password":
                setRenderComponent(
                    <ChangePasswordForm
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                    />
                )
                break;
        }
        setShowModal(true) //manda el modal de forma dinamica
    }

    const menuOptions = generateOptions(); // [CAP52] opciones para el usuario, pareciera que aqui creo una funcion con una variable

    return (
        <View>
            { //[CAP52]
                map(menuOptions, (menu, index) => ( //map por cada opcion que hay en el menu devuelve un ListItem
                    <ListItem //aqui se pintan los iconos en una lista, aqui se mapea
                        key={index} //propiedad key la llave es el index
                        style={styles.menuItem} //aqui se asigna el estilo
                        onPress={menu.onPress} // [CAP53] metodo que se activa cuando toquen alguno de los iconos va llamar el metodo que tiene el menu en onpres
                    >
                        <Icon
                            type="material-community"
                            name={menu.iconNameLeft}
                            color={menu.iconColorLeft}
                        />
                        <ListItem.Content> //para pintar el contenido del titulo
                            <ListItem.Title>{menu.title}</ListItem.Title>
                        </ListItem.Content>
                        <Icon
                            type="material-community"
                            name={menu.iconNameRight}
                            color={menu.iconColorRight}
                        />
                    </ListItem>
                ))
            }
            <Modal isVisible={showModal} setVisible={setShowModal}> //[CAP53] componente creado por nosotros 
                {
                    renderComponent //va contener el estado de todo lo que se tiene dinamicamente 
                }
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1, //ancho del borde de abajo
        borderBottomColor: "#a7bfd3"
    }
})
