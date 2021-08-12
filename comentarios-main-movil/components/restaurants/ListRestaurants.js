import { size } from 'lodash'
import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import { formatPhone } from '../../utils/helpers'
//>>LR2
export default function ListRestaurants({ restaurants, navigation, handleLoadMore }) { //[CAP79] aqui se le pasa FlatList por props la lista de restaurantes >>3hLM4
    return (
        <View>
            <FlatList //[CAP79] componente para pintar las lista de restaurantes, renderiza la informacion
                data={restaurants}
                keyExtractor={(item, index) => index.toString()} // para que no saque error, esta es la llave para que sea unico cada elemento
                onEndReachedThreshold={0.5} //[CAP80] limite de que llegue al fondo con un scroll del 50% entonces se ejecuta onEndReached 
                onEndReached={handleLoadMore} // 4hLM4
                renderItem={(restaurant) => ( // por cada restaurante va renderizar una lista 
                    <Restaurant restaurant={restaurant} navigation={navigation}/> // >>1 aqui se le pasa un solo retaurante y la navegacion
                )}
            />
        </View>
    )
}

function Restaurant({ restaurant, navigation, handleLoadMore }) { //[CAP79] ListRestaurants=>FlatList=>Restaurant
    const { id, images, name, address, description, phone, callingCode } = restaurant.item // estas las propiedades del objeto restaurant.item, aqui se le hizo destuctoring
    const imageRestaurant = images[0] //>>iR1 aqui va tomar la primera imagen de la publicacion para subirla como principal en la vista de la lista de restaurantes 

    const goRestaurtant = () => { // >>gR2/2
        navigation.navigate("restaurant", { id, name }) //[CAP81] pasando parametros a la navegacion
    } 

    return (
        <TouchableOpacity onPress={goRestaurtant}> //[CAP79][CAP81] >>gR1/2 cuando toquen un item de la lista implementa la navegacion
            <View style={styles.viewRestaurant}> // ESTA VISTA CONVOCA EL ESTILO PARA QUE SE ORGANIZEN HORIZONTALMENTE
                <View style={styles.viewRestaurantImage}>
                    <Image //[CAP79] ESTO SE VA MOSTRAR EN UN CAJON A LA IZQUIERDA 
                        resizeMode="cover" // Determina dimensiones de la imagen en el marco, cover(Escale la imagen de manera uniforme)
                        PlaceholderContent={<ActivityIndicator color="#fff"/>} // PlaceholderContent(Contenido Reemplazo cuando se carga la imagen), ActivityIndicator(Muestra un indicador de carga circular)
                        source={{ uri: imageRestaurant }} //>>iR2
                        style={styles.imageRestaurant} // estilo
                    />
                </View>
                <View> //[CAP79] LA INFORMACION QUE CONTENGAN LAS VARIABLES SE VAN A PINTAR EN PANTALLA   
                    <Text style={styles.restaurantTitle}>{name}</Text> 
                    <Text style={styles.restaurantInformation}>{address}</Text>
                    <Text style={styles.restaurantInformation}>{formatPhone(callingCode, phone)}</Text>
                    <Text style={styles.restaurantDescription}>
                        { //con esto imprime solo los primeros 60 caracteres
                            size(description) > 0
                                ? `${description.substr(0, 60)}...`// operador ternario y concatenacion string, substr(OBTENER UN SUBSTRING)
                                : description // sintaxis (?) si tiene menos de 60 caracteres : entonces pintar la descripcion
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    viewRestaurant: {
        flexDirection: "row",
        margin: 10
    },
    viewRestaurantImage: {
        marginRight: 15
    },
    imageRestaurant: {
        width: 90,
        height: 90
    },
    restaurantTitle: {
        fontWeight: "bold"
    },
    restaurantInformation: {
        paddingTop: 2,
        color: "grey"
    },
    restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width: "75%"
    }
})
