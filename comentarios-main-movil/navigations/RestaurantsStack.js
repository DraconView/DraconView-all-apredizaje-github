import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
//AQUI VAN LAS NAVEGACIONES
import Restaurants from '../screens/restaurants/Restaurants'
import AddRestaurant from '../screens/restaurants/AddRestaurant'
import Restaurant from '../screens/restaurants/Restaurant'
import AddReviewRestaurant from '../screens/restaurants/AddReviewRestaurant'
//no pueden ir los Stack.Screen sin la importacion m3nu
const Stack = createStackNavigator()

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="restaurants" //[CAP81] 
                component={Restaurants}
                options={{ title: "Restaurantes" }} //componente que se va renderizar 
            />
            <Stack.Screen
                name="add-restaurant"
                component={AddRestaurant}
                options={{ title: "Crear Restaurante" }}
            />
            <Stack.Screen 
                name="restaurant"
                component={Restaurant} 
            />
            <Stack.Screen
                name="add-review-restaurant"
                component={AddReviewRestaurant}
                options={{ title: "Nuevo Comentario" }}
            />
        </Stack.Navigator>
    )
}
