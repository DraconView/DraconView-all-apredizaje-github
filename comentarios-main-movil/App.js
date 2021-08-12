import React, { useEffect, useRef } from 'react'
import Navigation from './navigations/Navigation'
import { LogBox } from 'react-native' //notificaciones de advertencia de console.warn y console.log se muestren como notificaciones en lugar de cubrir la aplicación  

import { startNotifications } from './utils/actions'

LogBox.ignoreAllLogs() //desactivar las notificaciones de error o advertencia. Nota: esto solo deshabilita las notificaciones
 
export default function App() {
  const notificationListener = useRef() //[CAP114] se crean las referencias
  const responseListener = useRef()

  useEffect(() => {
    startNotifications(notificationListener, responseListener) // se llama el aplicativo escuche las notificaciones, startNotifications(recibe los parametros)
  }, [])

  return (
    <Navigation/>
  )
}