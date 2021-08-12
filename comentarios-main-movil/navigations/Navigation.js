import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import RestaurantsStack from './RestaurantsStack'
import FavoritesStack from './FavoritesStack'
import TopRestaurantsStack from './TopRestaurantsStack'
import SearchStack from './SearchStack'
import AccountStack from './AccountStack'

const Tab = createBottomTabNavigator()

export default function Navigation() {
    const screenOptions = (route, color) => { //recibe 2 parametros route es la ruta 
        let iconName // aqui devuelve un nombre de icono 
        switch (route.name) { // segun se elija la opcion va cambiar el icono
            case "restaurants":
                iconName = "compass-outline"
                break;
            case "favorites":
                iconName = "heart-outline"
                break;
            case "top-restaurants":
                iconName = "star-outline"
                break;
            case "search":
                iconName = "magnify"
                break;
            case "account":
                iconName = "home-outline"
                break;
        }

        return ( // cada vez que usa el metodo Icon y hay que pasarle las siguientes propiedades
            <Icon
                type="material-community" // especifica la familia de donde se a tomado documentacion, icon, familia
                name={iconName} // nombre del icono que es la variable que se esta evaluando arriba en la funcion flecha screenOptions
                size={22}  //tamaño para los iconos de la barra de bajo 
                color={color} // color
            />
        )
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="restaurants" //indica por cual de todos los tab va empezar
                tabBarOptions={{ //indica los colores para el que este selecionado y desseleccionado 
                    inactiveTintColor: "#a17dc3", //se usan imagenes solo color tranparente y usar la pagina imagecolorpiker
                    activeTintColor: "#442484" //formato de color HEX no RGB 
                }}
                screenOptions={({ route }) => ({ // a esta propiedad se le pasa la funcion que tenemos 
                    tabBarIcon: ({ color }) => screenOptions(route, color) // tabBarIcon aqui se define el icono en la que se tiene una funcion tipo flecha 
                })}
            >
                <Tab.Screen
                    name="restaurants"
                    component={RestaurantsStack}
                    options={{ title: "Restaurantes" }}
                />
                <Tab.Screen
                    name="favorites"
                    component={FavoritesStack}
                    options={{ title: "Favoritos" }}
                />
                <Tab.Screen
                    name="top-restaurants"
                    component={TopRestaurantsStack}
                    options={{ title: "Top 10" }}
                />
                <Tab.Screen
                    name="search"
                    component={SearchStack}
                    options={{ title: "Buscar" }}
                />
                <Tab.Screen
                    name="account"
                    component={AccountStack}
                    options={{ title: "Cuenta" }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}
