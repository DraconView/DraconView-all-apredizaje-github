import React, { useState, useEffect, useCallback } from 'react' //useState para saber si el usuario esta logueado
import { StyleSheet } from 'react-native'
import Loading from '../../components/Loading'
import { getCurrentUser, isUserLogged } from '../../utils/actions'
import { useFocusEffect } from '@react-navigation/native'
//hook de estado 
import UserGuest from './UserGuest'
import UserLogged from './UserLogged'

export default function Account() { //cuando pase por esta pantalla revisa si el usuario esta logueado  
    const [login, setLogin] = useState(null) //setLogin modifica al loguin, useState(null) asume que el usuario no esta logueado 

    useFocusEffect (
        useCallback(() => {
            const user = getCurrentUser() //getCurrentUser() nos devuelve si hay usuario o no 
            user ? setLogin(true) : setLogin(false) //user ? setLogin(true)=> si hay usuario entonces el setLogin sea verdadero (:) en caso contrario el setLogin va ser igual a falso // si el usuario es null le dice a setLogin(true) de los contrario setLogin(false)
        }, [])
    )

    if (login == null) { //login === null presenta un mensaje mientras que carga Cargando... ,
        return <Loading isVisible={true} text="Cargando..."/> //login === null presenta un mensaje mientras que carga Cargando... ,
    }
//AQUI SE CONVOCA OTRAS PANTALLAS
    return login ? <UserLogged/> : <UserGuest/> //login ? si el usuario esta logueado, trae la pantalla screen UserLogged de la carpeta account y sino trae la pantalla screen UserGuest
}

const styles = StyleSheet.create({}) 

//YA NO SE ESTA USANDO ESTE HOOK useEffect para cuando la pantalla cargue verificar si el usuario esta logueado o no
