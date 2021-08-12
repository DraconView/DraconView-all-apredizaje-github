import React, { useState, useEffect }  from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native' //[CAP101] FlatList(es donde se van a mostrar las publicaciones), TouchableOpacity(si tocan aqui reaciona el codigo), ActivityIndicator(para mostrar un loading nativo mientras carga las imagenes)
import { Card, Image, Icon, Rating } from 'react-native-elements' // Card(proporciona un efecto visual)

export default function ListTopRestaurants({ restaurants, navigation }) { //[CAP101] recibe los objetos restaurants, navigation 
    return (
        <FlatList // FlatList remplazo del view
            data={restaurants} // la data que alimenta el FlatList es objeto que esta recibiendo
            keyExtractor={(item, index) => index.toString()} // retorna el item e index sino arroja un error en consola
            renderItem={(restaurant) => ( // por cada publicacion va renderizar ...
                <Restaurant restaurant={restaurant} navigation={navigation}/> // renderiza un componente inetrno Restaurant
            )}
        />
    )
}

function Restaurant({ restaurant, navigation }) { //[CAP101] recibe por parametros los datos que va mostrar y la navegacion para cuando seleccione el usuario alguno 
    const { name, rating, images, description, id } = restaurant.item // se toman las propiedades necesarias del objeto restaurant.item
    const [iconColor, setIconColor] = useState("#000") // estado para el color del icono dorado plata y bronce

    useEffect(() => { // colores dorado plata y bronce 
        if (restaurant.index === 0) {
            setIconColor("#efb819")
        } else if (restaurant.index === 1) {
            setIconColor("#e3e4e5")
        } else if (restaurant.index === 2) {
            setIconColor("#cd7f32")
        }
    }, [])

    return (
        <TouchableOpacity //[CAP101] cuando el usuario presione 
            onPress={() => navigation.navigate("restaurants", { // navegacion a pantalla de restaurants con los siguientes parametros 
                screen: "restaurant",
                params: { id, name }
            })}
        >
            <Card containerStyle={styles.containerCard}> //[CAP101] pinta los objetos o publicaciones
                <Icon // corona con la puntuacion de los restaurantes
                    type="material-community"
                    name="chess-queen"
                    color={iconColor}
                    size={40}
                    containerStyle={styles.containerIcon}
                />
                <Image // iamgen principal del restaurante
                    style={styles.restaurantImage}
                    resizeMode="cover" // cover para que ocupe todo el espacio
                    PlaceholderContent={<ActivityIndicator size="large" color="#FFF"/> } // PlaceholderContent(si la imagen es muy grande) activa el ActivityIndicator
                    source={{ uri: images[0] }} // origen de la imagen va se rigual a un objeto llamado uri, que utilizara la coleccion de imagenes en la posicion 0 
                />
                <View style={styles.titleRating}> // pinta las estrellas del restaurante
                    <Text style={styles.title}>{name}</Text> // propiedad name del objeto
                    <Rating
                        imageSize={20} // tamaño
                        startingValue={rating} // puntos o calificacion 
                        readonly // esta propiedad es para que el usurio no pueda modificar las estrellas
                    />
                </View>
                <Text style={styles.description}>{description}</Text> // propiedad description del objeto
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        marginBottom: 30,       // magen inferior 
        borderWidth: 0          //
    },
    containerIcon: {            // icono de la corona       
        position: "absolute",   // 
        top: -30,               // se suba sobre la imagen 
        left: -30,
        zIndex: 1               // controla la superposicion de los objetos 
    },
    restaurantImage: {          // imagen del restaurante 
        width: "100%",
        height: 200             // altura 
    },
    title: {                    // nombre del restaurante 
        fontSize: 20,
        fontWeight: "bold"      // estilo de fuente 
    },
    description: {              // descripcion
        color: "grey",          // gris 
        marginTop: 0,
        textAlign: "justify"    // justificacion 
    },
    titleRating: {
        flexDirection: "row", // acomoda el contenido horizontalmente 
        marginVertical: 10, // margen arriba 
        justifyContent: "space-between" // separa los elementos equitativamente
    }
})
    