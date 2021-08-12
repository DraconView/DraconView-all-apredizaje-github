import React, { useState, useEffect } from 'react' //[CAP104] useState(donde se guardan los datos) //useEffect(ejecutar cuando cargue la pagina)
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native' // FlatList(para colocar una lista de elementos)
import { SearchBar, ListItem, Icon, Image } from 'react-native-elements' // SearchBar(barra de busqueda), ListItem(para poder hacer una lista de articulos)
import { isEmpty, size } from 'lodash' // isEmpty de lodash (valida que el usuario si ingreso algo)

import { searchRestaurants } from '../utils/actions'

export default function Search({ navigation }) {
    const [search, setSearch] = useState("") // setSearch(modificador) //useState("T") busca todos los que empiezan por T
    const [restaurants, setRestaurants] = useState([]) // estados para los restaurantes un array o coleccion

    useEffect(() => { //[CAP104]
        if (isEmpty(search)) { // valida que alla algo en search, si esta vacio el criterio de busqueda return se sale de aqui 
            return
        }

        async function getData() { // async(se debe crear cuando se va llamar un metodo asincorono) getData(va traer la informacion,se puede colocar el nombre que uno elija en este caso getData )
            const response = await searchRestaurants(search) // search(el criterio que se le va dar)
            if (response.statusResponse) {
                setRestaurants(response.restaurants) // setRestaurants va ser igual a la respuesta en su coleccion de restaurants 
            }
        }
        getData(); // carga la funcion getData cuando cargue la pantalla y cuando cambie el contenido de la palabra search
    }, [search]) // el ciclo se ejecutara cada vez que cambie la variable search y cuando cargue la pantalla 

    return ( //[CAP105]
        <View>
            <SearchBar
                placeholder="Ingresa nombre del restaurante..." // placeholder texto que va ver el usuario en la barra de busqueda
                onChangeText={(e) => setSearch(e)} // onChangeText(cuando cambie el contenido), (e)(se recibe un evento), setSearch(modifica el estado primario)
                containerStyle={styles.searchBar} // estilo del componente 
                value={search} // el valor que va tener es el contenido de la palabra search(remplaza a la busqueda quemada)
            />
            {
                size(restaurants) > 0 ? ( // si el size de restaurants es mayor a 0 entonces...
                    <FlatList // renderiza el FlatList
                        data={restaurants} // data es igual al origen de datos de restaurants 
                        keyExtractor={(item, index) => index.toString()} // keyExtractor(determina que este  componente es unico)
                        renderItem={(restaurant) => // cada vez que vez que tenga un elemento en el renderItem ejecuta la funcion tipo flecha, pasa cada restaurant que hay en data 
                            <Restaurant // por cada publicacion rederiza el componete y pasa por parametro 
                                restaurant={restaurant} // data de restaurante
                                navigation={navigation} // para dezplazarse a la publicacion
                            />
                        }
                    />
                ) : (
                    isEmpty(search) ? ( // si es isEmpty el search quiere decir que el usuario no a ingresado nada 
                        <Text style={styles.noFound}>
                            Ingrese las primeras letras del nombre del restaurante.
                        </Text>
                    ) : ( // si no hay restaurantes
                        <Text style={styles.noFound}>
                            No hay restaurantes que coincidan con el critertio de búsqueda.
                        </Text>
                    )
                )
            }
        </View>
    )
}

function Restaurant ({ restaurant, navigation }) { // recive el objeto y la navegacion
    const { id, name, images } = restaurant.item // restaurant.item va tomar solo las propiedades id, name, images

    return ( // retonar cuando llegue ({ restaurant, navigation })
        <ListItem // aqui carga los elementos en una lista
            style={styles.menuItem} // estilo 
            onPress={() => navigation.navigate("restaurants", { // navega al stack de restaurants 
                screen: "restaurant", // navega a la pantalla restaurant
                params: { id, name } //
            })}
        > // hasta aqui propiedades de ListItem
            <Image 
                resizeMode="cover" // para que se acomode al tamaño que se esta definiendo
                PlaceholderContent={<ActivityIndicator color="#fff"/>} // PlaceholderContent(por si la imagen es muy grande aparece ActivityIndicator)
                source={{ uri: images[0] }} // el origen va ser en la propiedad uri: el arreglo de imagenes en la posicion 0
                style={styles.imageRestaurant} // estilos 
            /> // hasta aqui propiedades de Image
            <ListItem.Content> // .Content propiedad del ListItem esto es una coleccion
                <ListItem.Title>{name}</ListItem.Title> // ListItem.Title propiedad de ListItem.Content
            </ListItem.Content>
            <Icon // icono de flecha hacia la derecha
                type="material-community"
                name="chevron-right"
            />
        </ListItem>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20,
        backgroundColor: "#fff"
    },
    imageRestaurant: {
        width: 90, 
        height: 90
    },
    noFound: {
        alignSelf: "center",
        width: "90%"
    },
    menuItem: {
        margin: 10
    }
})
