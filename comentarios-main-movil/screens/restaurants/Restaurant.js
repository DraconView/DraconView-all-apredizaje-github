import React, { useState, useCallback, useRef, useEffect } from 'react' // [CAP90] useCallback(refrescar vista automaticamente), necesita ir dentro useFocusEffect
import { View } from 'react-native'
import { Alert, Dimensions, StyleSheet, Text, ScrollView } from 'react-native'
import { ListItem, Rating, Icon, Input, Button } from 'react-native-elements'
import { isEmpty, map } from 'lodash'
import { useFocusEffect } from '@react-navigation/native' 
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast' //[CAP93] relacionado con useRef

import CarouselImages from '../../components/CarouselImages'
import Loading from '../../components/Loading'
import MapRestaurant from '../../components/restaurants/MapRestaurant'
import ListReviews from '../../components/restaurants/ListReviews'
import { 
    addDocumentWithoutId, 
    getCurrentUser, 
    getDocumentById, 
    getIsFavorite, 
    deleteFavorite, 
    sendPushNotification, 
    setNotificationMessage, 
    getUsersFavorite
} from '../../utils/actions'
import { callNumber, formatPhone, sendEmail, sendWhatsApp } from '../../utils/helpers'
import Modal from '../../components/Modal'

const widthScreen = Dimensions.get("window").width //[CAP83] >>wS2 obtener el ancho total de la pantalla 

export default function Restaurant({ navigation, route }) { //[CAP81] route(objeto que contiene las lista de parametros que se reciben por navegacion) en su propiedad route.params
    const { id, name } = route.params // route.params(contiene los objetos que se enviaron por navegacion) luego se le hace un destructuring
    const toastRef = useRef()
    
    const [restaurant, setRestaurant] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0) 
    const [isFavorite, setIsFavorite] = useState(false) // corazon de favoritos
    const [userLogged, setUserLogged] = useState(false)
    const [currentUser, setCurrentUser] = useState(null) //[CAP108] quien es el usuario logueado 
    const [loading, setLoading] = useState(false)
    const [modalNotification, setModalNotification] = useState(false)

    firebase.auth().onAuthStateChanged(user => { //retorna un usuario
        user ? setUserLogged(true) : setUserLogged(false) // el usuario esta logueado
        setCurrentUser(user) // como arriba ya se tiene el usuario setCurrentUser va ser igual al user
    })

    navigation.setOptions({ title: name }) //[CAP81] setOptions se le puede definir el title que va ser lo que reciba 

    useFocusEffect( //[CAP82] se activa apenas llegue a esta pantalla
        useCallback(() => {  
            (async() => { // funcion asincrona auto llamada
                const response = await getDocumentById("restaurants", id) // aqui se le paso por parametro
                if (response.statusResponse) { // si lo trajo ...    
                    setRestaurant(response.document) // setRestaurant = a lo que trajo la respuesta en su propiedad document
                } else { // si falla ...
                    setRestaurant({}) // queda un objeto en blanco sin contenido
                    Alert.alert("Ocurrió un problema cargando el restaurante, intente más tarde.")
                }
            })()
        }, [])
    )

    useEffect(() => { // se activa apenas llegue a esta pantalla 
        (async() => { // funcion asincrona auto llamada
            if (userLogged && restaurant) { //[CAP94] si el usuario esta logueado y se tiene el objeto restaurant
                const response = await getIsFavorite(restaurant.id) // verifica si es favorito para restaurant.id
                response.statusResponse && setIsFavorite(response.isFavorite) //response.statusResponse si es valido, setIsFavorite lo va marcar con la respuestas response.isFavorite
            }
        })()
    }, [userLogged, restaurant]) //[CAP95] ?ACTIVA EL EFECTO CUANDO CAMBIEN userLogged, restaurant

    const addFavorite = async() => { //[CAP93] añadir a favoritos --------------------------------------
        if (!userLogged) { // si no esta logueado el usuario 
            toastRef.current.show("Para agregar el restaurante a favoritos debes estar logueado.", 3000) // mensaje
            return
        }
        setLoading(true) // activa Loading
        const response = await addDocumentWithoutId("favorites", { // guarad en la coleccion de favoritos
            idUser: getCurrentUser().uid,   // obtiene id del usuario
            idRestaurant: restaurant.id     // obtiene id del restaurante
        })
        setLoading(false)
        if (response.statusResponse) { // si se añadio correctamente a favoritos
            setIsFavorite(true)
            toastRef.current.show("Restaurante añadido a favoritos.", 3000)
        } else {
            toastRef.current.show("No se pudo adicionar el restaurante a favoritos. Por favor intenta más tarde.", 3000)
        }
    } //----------------------------//[FIN] addFavorite añadir a favoritos //---------------------------

    const removeFavorite = async() => { //[CAP93] remover de favoritos ---------------------------------
        setLoading(true)
        const response = await deleteFavorite(restaurant.id) // aqui se le pasa el id del restaurante al metodo
        setLoading(false)

        if (response.statusResponse) {
            setIsFavorite(false)
            toastRef.current.show("Restaurante eliminado de favoritos.", 3000)
        } else {
            toastRef.current.show("No se pudo eliminar el restaurante de favoritos. Por favor intenta más tarde.", 3000)
        }
    } //----------------------------//[FIN] removeFavorite remover de favoritos //------------------------

    if (!restaurant) { //[CAP81] si el objeto restaurante es nulo 
        return <Loading isVisible={true} text="Cargando..."/> // sale de esta vista
    }

    return (
        <ScrollView style={styles.viewBody}>
            <CarouselImages //[CAP81] >>CI1 CarouselImages>envia por parametros al componente hoja CarouselImages  
                images={restaurant.images}
                height={250}
                width={widthScreen} // >>wS1
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <View style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={ isFavorite ? "heart" : "heart-outline" } // si es favorito entonces colocar el icono heart sino heart-outline 
                    onPress={ isFavorite ? removeFavorite : addFavorite } // convoca metodos de añadir o eliminar de favoritos
                    color="#442484"
                    size={35}
                    underlayColor="tranparent" // color que tiene atras
                />
            </View>
            <TitleRestaurant //[CAP85] componente declarado en esta hoja, aqui recibe las propiedades
                name={restaurant.name}
                description={restaurant.description}
                rating={restaurant.rating}
            />
            <RestaurantInfo
                name={restaurant.name}          // nombre del restaurante
                location={restaurant.location}  // localizacion
                address={restaurant.address}    // direccion
                email={restaurant.email}        // email
                phone={formatPhone(restaurant.callingCode, restaurant.phone)} // telefono del restaurante desde helpers
                currentUser={currentUser} // quien es el usuario que esta enviendo el mensaje
                callingCode={restaurant.callingCode}
                phoneNoFormat={restaurant.phone} //[CAP109] telefono sin formato
                setLoading={setLoading}
                setModalNotification={setModalNotification}
            />
            <ListReviews //[CAP87] componente importado, hay que pasarle 2 propiedades 
                navigation={navigation}
                idRestaurant={restaurant.id}
            />
            <SendMessage
                modalNotification={modalNotification}
                setModalNotification={setModalNotification}
                setLoading={setLoading}
                restaurant={restaurant}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Por favor espere..."/>
        </ScrollView>
    )
} //--------------------------- FIN COMPONENTE export default function Restaurant ----------------------------------

function SendMessage ({ modalNotification, setModalNotification, setLoading, restaurant }) {
    const [title, setTitle] = useState(null)
    const [errorTitle, setErrorTitle] = useState(null)
    const [message, setMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const sendNotification = async() => {
        if (!validForm()) { 
            return
        }

        setLoading(true)
        const userName = getCurrentUser().displayName ? getCurrentUser().displayName : "Anónimo"
        const theMessage = `${message}, del restaurante: ${restaurant.name}`

        const usersFavorite = await getUsersFavorite(restaurant.id)
        if (!usersFavorite.statusResponse) {
            setLoading(false)
            Alert.alert("Error al obtener los usuarios que aman el restaurante.")
            return
        }

        await Promise.all (
            map(usersFavorite.users, async(user) => {
                const messageNotification = setNotificationMessage(
                    user.token,
                    `${userName}, dijo: ${title}`,
                    theMessage,
                    { data: theMessage}
                )
        
                await sendPushNotification(messageNotification)
            })
        )

        setLoading(false)
        setTitle(null)
        setMessage(null)
        setModalNotification(false)
    }

    const validForm = () => {
        let isValid = true;

        if (isEmpty(title)) {
            setErrorTitle("Debes ingresar un título a tu mensaje.")
            isValid = false
        }

        if (isEmpty(message)) {
            setErrorMessage("Debes ingresar un mensaje.")
            isValid = false
        }

        return isValid
    }

    return (
        <Modal
            isVisible={modalNotification}
            setVisible={setModalNotification}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.textModal}>
                    Envíaale un mensaje a los amantes de {restaurant.name}
                </Text>
                <Input
                    placeholder="Título del mensaje..."
                    onChangeText={(text) => setTitle(text)}
                    value={title}
                    errorMessage={errorTitle}
                />
                <Input
                    placeholder="Mensaje..."
                    multiline
                    inputStyle={styles.textArea}
                    onChangeText={(text) => setMessage(text)}
                    value={message}
                    errorMessage={errorMessage}
                />
                <Button
                    title="Enviar Mensaje"
                    buttonStyle={styles.btnSend}
                    containerStyle={styles.btnSendContainer}
                    onPress={sendNotification}
                />
            </View>
        </Modal>
    )
} //------------------------------------ FIN componente SendMessage ------------------------------------------------

function RestaurantInfo({ //[CAP86] parametros que recibe es el listItem
    name, 
    location, 
    address, 
    email, 
    phone, 
    currentUser, 
    callingCode, 
    phoneNoFormat, 
    setLoading,
    setModalNotification 
}) {
    const listInfo = [ // arreglo de objetos que van a contener la informacion del restaurante
        { type: "addres", text: address, iconLeft: "map-marker", iconRight: "message-text-outline" },  
        { type: "phone", text: phone, iconLeft: "phone", iconRight: "whatsapp" }, // icono de la derecha acciona el metodo
        { type: "email", text: email, iconLeft: "at" }, // at(los nombres deben ser diferente a los que se colocaron en helpers)
    ]

    const actionLeft = (type) => {
        if (type == "phone") { // si es tipo phone el usuario quiere llamar
            callNumber(phone)
        } else if (type == "email") {
            if (currentUser) { // si hay usuario, convoca el metodo sendEmail y envia el email a la cosntante email
                sendEmail(email, "Interesado", `Soy ${currentUser.displayName}, estoy interesado en sus servicios`)
            } else {
                sendEmail(email, "Interesado", `Estoy interesado en sus servicios`)
            }
        }
    }

    const actionRight = (type) => {
        if (type == "phone") { //[CAP109] si el tipo es igual a phone 
            if (currentUser) { // si el usuario, enviar wasap al telefono   
                sendWhatsApp(`${callingCode} ${phoneNoFormat}`, `Soy ${currentUser.displayName}, estoy interesado en sus servicios`)
            } else {
                sendWhatsApp(`${callingCode} ${phoneNoFormat}`, `Estoy interesado en sus servicios`)
            }
        } else if (type == "addres") { // si el tipo es addres
            setModalNotification(true)
        }
    }

    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>
                Información sobre el restaurante
            </Text>
            <MapRestaurant // componente mapa 
                location={location} // hay que pasarle la ubicacion que recibio el componente location
                name={name} 
                height={150}
            />
            {
                map(listInfo, (item, index) => ( // map itere el listInfo y por cada componente lo va llamar item y un index va iterar un ListItem
                    <ListItem //componente de lista interna muestra la informacion del restaurante
                        key={index} // siempre estas listas deben ser unicas por eso se le pone la propiedad key(es lo que mapea lodash) que el index
                        style={styles.containerListItem}
                    >
                        <Icon
                            type="material-community" // libreria de donde viene el icon
                            name={item.iconLeft}
                            color="#442484"
                            onPress={() => actionLeft(item.type)} // convoca el metodo  
                        />
                        <ListItem.Content> // 
                            <ListItem.Title>{item.text}</ListItem.Title>
                        </ListItem.Content>
                        {
                            item.iconRight && ( //[CAP108] si esa propiedad tiene valor va pintar el icono
                                <Icon
                                    type="material-community"
                                    name={item.iconRight}
                                    color="#442484"
                                    onPress={() => actionRight(item.type)} // convoca el metodo
                                />
                            )
                        }
                    </ListItem>
                ))
            }
        </View>
    )
} //----------------------------------- FIN componente RestaurantInfo -------------------------------------

function TitleRestaurant({ name, description, rating }) { //[CAP87] componente nombre, descripcion y rating
    return (
        <View style={styles.viewRestaurantTitle}> // titulo
            <View style={styles.viewRestaurantContainer}> //
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating // estrellas en titulo
                    style={styles.rating}
                    imageSize={20} // tamaño de las estrellas 
                    readonly // esta propiedad es para que el usurio no pueda modificar las estrellas
                    startingValue={parseFloat(rating)} // va empezar en la calificacion que tenga, parseando el valor de rating
                />
            </View>
            <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
    )
} //----------------------------------- FIN componente TitleRestaurant -------------------------------------

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewRestaurantTitle: {
        padding: 15,
    },
    viewRestaurantContainer: {
        flexDirection: "row" // para que el view quede horizontal
    },
    descriptionRestaurant: {
        marginTop: 8,
        color: "gray",
        textAlign: "justify"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    nameRestaurant: {
        fontWeight: "bold"
    },
    viewRestaurantInfo: {
        margin: 15, // margen a todos los lados
        marginTop: 25
    },
    restaurantInfoTitle: {
        fontSize: 20, // tamaño de fuente
        fontWeight: "bold", //negrita 
        marginBottom: 15
    },
    containerListItem: {
        borderBottomColor: "#a376c7", //color a la parte de abajo
        borderBottomWidth: 1 // ancho del borde de abajo
    },
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100, // redondea solo la esquina superior izquierda
        padding: 5,
        paddingLeft: 15
    },
    textArea: {
        height: 50,
        paddingHorizontal: 10
    },
    btnSend: {
        backgroundColor: "#442848"
    },
    btnSendContainer: {
        width: "95%"
    },
    textModal: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold"
    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center"
    }
}) //----------------------------------------- styles -----------------------------------------------