import React, { useState, useEffect } from 'react' //[CAP70] esta relacionado con el [CAP69]
import { Alert, Dimensions, StyleSheet, Text, View, ScrollView } from 'react-native'
import { Avatar, Button, Icon, Input, Image } from 'react-native-elements'
import { map, size, filter, isEmpty } from 'lodash' 
import CountryPicker from 'react-native-country-picker-modal'
import MapView from 'react-native-maps' //[CAP70]  
import uuid from 'random-uuid-v4'

import { formatPhone, getCurrentLocation, loadImageFromGallery, validateEmail } from '../../utils/helpers' //[CAP70] esta relacionado con el [CAP69]
import { addDocumentWithoutId, getCurrentUser, uploadImage } from '../../utils/actions'
import Modal from '../../components/Modal' //[CAP69]

const widthScreen = Dimensions.get("window").width //[CAP68] OBTENER DIMENSIONES DE LA PANTALLA 
//-----------------------------------------------------------------------------------------//
export default function AddRestaurantForm({ toastRef, setLoading, navigation }) {
    const [formData, setFormData] = useState(defaultFormValues()) //[CAP63] todos los datos se van a guardar en el objeto formData, aqui se le dice al estado que use una funcion useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)                //[CAP63] manejo de errores
    const [errorDescription, setErrorDescription] = useState(null)  //[CAP63] manejo de errores
    const [errorEmail, setErrorEmail] = useState(null)              //[CAP63] manejo de errores
    const [errorAddress, setErrorAddress] = useState(null)          //[CAP63] manejo de errores
    const [errorPhone, setErrorPhone] = useState(null)              //[CAP63] manejo de errores
    const [imagesSelected, setImagesSelected] = useState([]) //[CAP65] en este ARRAY se van a colocar las imagens que se van a manejar
    const [isVisibleMap, setIsVisibleMap] = useState(false) //[cap69] visibiladad del mapa  
    const [locationRestaurant, setLocationRestaurant] = useState(null) //[cap69] guarda la localizacion, estado null porque todavia no se a creado el restaurante

    const addRestaurant = async() => {
        if (!validForm()) { //si no valida el formulario...
            return //salir de aqui
        }

        setLoading(true)
        const responseUploadImages = await uploadImages() //[cap74] respuesta de subir imagenes
        const restaurant = { //[cap74] creacion del objeto que se va mandar los datos salen de formData
            name: formData.name, 
            address: formData.address,
            description: formData.description,
            callingCode: formData.callingCode,
            phone: formData.phone,
            location: locationRestaurant,
            email: formData.email,
            images: responseUploadImages,
            rating: 0, //calificacion
            ratingTotal: 0, //cantidad de votos que le han dado
            quantityVoting: 0, //cantidad de personas que han votado
            createAt: new Date(), //en que momento se creo la fecha la toma del sistema
            createBy: getCurrentUser().uid //quien en el u ID lo creo
        }
        const responseAddDocument = await addDocumentWithoutId("restaurants", restaurant) //[cap74] addDocumentWithoutId(recibe como parametro el nombre de la coleccion y la data)
        setLoading(false)

        if (!responseAddDocument.statusResponse) { //manejo de errores
            toastRef.current.show("Error al grabar el restaurante, por favor intenta más tarde.", 3000)
            return
        }

        navigation.navigate("restaurants") //[cap74] en caso de que pueda crear el restaurante se produce la navegacion 
    }

    const uploadImages = async() => { //[CAP73] EN ESTE CICLO SE LLAMAN VARIOS METODOS ASINCRONOS
        const imagesUrl = [] //[CAP73] guarda un array de urls que devuelve la subida de imagenes
        await Promise.all( // significa que va esperar todas las llamadas asincornas que haga en ese momento
            map(imagesSelected, async(image) => { // se hace map de las imagenes del arreglo imagesSelected y por cada imagesSelected ejecutar un metodo asincrono(async) y va colocar la imagen seleccionada
                const response = await uploadImage(image, "restaurants", uuid()) //response respuesta de cada imagen, ejecutar el metodo uploadImage(image(ruta de la iamgen,"restaurants"(esta es la carpeta en la qu se va subir), uuid(convoca el constructor de la clase para genera el id unico))
                if (response.statusResponse) { //si lo pudo subir 
                   imagesUrl.push(response.url) // se va guardar la url en el componente array de imagenes
                }
            })
        )
        return imagesUrl
    }

    const validForm = () => {
        clearErrors()
        let isValid = true

        if (isEmpty(formData.name)) { //[CAP72] si el usuario no escribio nombre del retaurante
            setErrorName("Debes ingresar el nombre del restaurante.")
            isValid = false
        }

        if (isEmpty(formData.address)) {
            setErrorAddress("Debes ingresar la dirección del restaurante.")
            isValid = false
        }

        if (!validateEmail(formData.email)) {
            setErrorEmail("Debes ingresar un email de restaurante válido.")
            isValid = false
        }

        if (size(formData.phone) < 10) { //< 10) otro estilo de validacion
            setErrorPhone("Debes ingresar un teléfono de restaurante válido.")
            isValid = false
        }

        if (isEmpty(formData.description)) {
            setErrorDescription("Debes ingresar una descripción del restaurante.")
            isValid = false
        }

        if (!locationRestaurant) {
            toastRef.current.show("Debes de localizar el restaurante en el mapa.", 3000)
            isValid = false
        } else if(size(imagesSelected) === 0) { //[CAP65] si el size de la coleccion imagesSelected es igual a 0 ...entonces
            toastRef.current.show("Debes de agregar al menos una imagen al restaurante.", 3000)
            isValid = false
        }

        return isValid
    }

    const clearErrors = () => {
        setErrorAddress(null)
        setErrorDescription(null)
        setErrorEmail(null)
        setErrorName(null)
        setErrorPhone(null)
    }

    return (//este es el formulario
        <ScrollView style={styles.viewContainer}> //[CAP68] cambio view x ScrollView por que posiblemente no caber en telefonos pequeños
            <ImageRestaurant
                imageRestaurant={imagesSelected[0]} //[CAP68] componete que se definio abajo y recibe un parametro en dafault va ser igual imagesSelected en la posicion 0 
            />
            <FormAdd //[CAP71] LO QUE SE ENVIE POR AQUI LO RECIBEN LAS PROPIEDADES DE FormAdd
                formData={formData}
                setFormData={setFormData}   //[CAP63] modificador de formData
                errorName={errorName}
                errorDescription={errorDescription}
                errorEmail={errorEmail}
                errorAddress={errorAddress}
                errorPhone={errorPhone}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage //[CAP63] >>1 aqui se llama al componente de UploadImage
                toastRef={toastRef} //[CAP65] toastRef que envian desde el formulario de adicionar restaurante addrestaurantForm
                imagesSelected={imagesSelected} //[CAP65] aqui se manda la coleccion de imagenes para que las pueda pintar
                setImagesSelected={setImagesSelected} //[CAP65] metodo para cambiar la propiedad imagesSelected
            />
            <Button
                title="Crear Restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <MapRestaurant //[CAP69] aqui se comunica con la funcion MapRestaurant
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap} //setIsVisibleMap= es igaul a lo que se le mande en el estado {setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef} 
            />
        </ScrollView>
    )
} 
//------------------------------------------//[CAP69] function MapRestaurant //---------------------------
function MapRestaurant({ isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef }) { //[CAP69] setIsVisibleMap para poder modificar desde aqui, setLocationRestaurant establece la localizacion del restaurante, toastRef abre la ventana donde cargara el mapa 
    const [newRegion, setNewRegion] = useState(null)                                         //[CAP71] estado para que no cambie la ubicacion hasta que el usuario confirme

    useEffect(() => {                                          //para hacer un asincrono auto llamado se abre doble parentesis //va cargar cuando se cargue el componente interno
        (async() => {                                          //aqui se llama una funcion tipo flecha
            const response = await getCurrentLocation()        //await espera lo que devuelva el metodo getCurrentLocation
            if (response.status) {                             //si hubo respuesta...
                setNewRegion(response.location)                //temporal que se trabaja internamente , aqui esta en modo de objeto la ubicacion
                console.log(response.location)
            }
        })()
    }, [])

    const confirmLocation = () => { //[CAP71] funcion confirmar nueva ubicacion que establecida por el usuario 
        setLocationRestaurant(newRegion) // pasa los parametros de newRegion a setLocationRestaurant
        toastRef.current.show("Localización guardada correctamente.", 3000)
        setIsVisibleMap(false) //estado de visibilad del el mapa, lo cierra
    }
            
    return ( //[CAP69] //aqui se pinta el mapa en un modal creado por nosotros, //aqui se comunican con el modal importado
        <Modal isVisible={isVisibleMap} setVisible={setIsVisibleMap}> //isVisible= va depender de lo que se le alla mandado en el {isVisibleMap}
            <View> 
                { 
                    newRegion && ( //si hay localizacion...
                        <MapView
                            style={styles.mapStyle} //coloca el estilo al mapa 
                            initialRegion={newRegion} //initialRegion va arrancar = newRegion nuestra ubicacion
                            showsUserLocation={true} //muestra la ubicacion del usuario
                            onRegionChange={(region) => setNewRegion(region)} //si la region cambia tambien cambia el setNewRegion variable para la ubicacion temporal , => retorna la region. funcion tipo flecha que nos devuelve como parametro la region 
                            //mapType={"satellite"}
                        >
                            <MapView.Marker 
                                coordinate={{ //aqui se definen las coodenadas del marcador o alfiler
                                    latitude: newRegion.latitude,
                                    longitude: newRegion.longitude
                                }}
                                draggable //el usuario puede mover la ubicacion del marcador de 
                            />
                        </MapView>
                    ) 
                }
                <View style={styles.viewMapBtn}> //[CAP69] botones para firjar la localizacion del mapa 
                    <Button
                        title="Guardar Ubicación"
                        containerStyle={styles.viewMapBtnContainerSave}     //estilo contenedor de boton guardar ubicacion en el mapa
                        buttonStyle={styles.viewMapBtnSave}                 //estilo boton guardar ubicacion en el mapa
                        onPress={confirmLocation}                           //aqui llama al metodo confirmLocation
                    />
                    <Button
                        title="Cancelar Ubicación"
                        containerStyle={styles.viewMapBtnContainerCancel}   //estilo contenedor de boton cancelar ubicacion en el mapa
                        buttonStyle={styles.viewMapBtnCancel}               //estilo boton cancelar ubicacion en el mapa
                        onPress={() => setIsVisibleMap(false)}              //estado de visibilad del el mapa, lo cierra
                    />
                </View>
            </View>
        </Modal>
    )
}
//-----------------------------------------//[CAP68] PORTADA DEL RESTAURANTE//-------------------------------------
function ImageRestaurant({ imageRestaurant }) { //[CAP68] PORTADA aqui se le va pasar por destructorins la imagen del restaurante
    return ( // aqui se retorna un elemento 
        <View style={styles.viewPhoto}> //[CAP68] dentro de este view se va pintar la imagen del restaurante
            <Image
                style={{ width: widthScreen, height: 200}}
                source={ //[CAP68] Image tiene una propiedad source(origen de la imagen)
                    imageRestaurant // aqui pregunta si el restaurante tiene foto 
                        ? { uri: imageRestaurant} // si tiene foto el uri de la foto va ser imageRestaurant
                        : require("../../assets/no-image.png") // si no tiene foto asigna la imagen por defecto de la ruta especificada
                }
            />
        </View>
    )
}
//--------------------------------------------//[CAP64] componente para subir imagenes
function UploadImage({ toastRef, imagesSelected, setImagesSelected }) { //[CAP64]>>2 SE RECIBE POR PROPS DESDE ScrollView  
    const imageSelect = async() => { //[CAP66] funcion que sirve para subir la iamgen...
        const response = await loadImageFromGallery([4, 3]) //[CAP66] cons respuesta igual al metodo de helpers, que pide la relacion de la iamgen
        if (!response.status) { //[CAP66] dentro de la propiedad status de response no hay un estatus ok
            toastRef.current.show("No has seleccionado ninguna imagen.", 3000)
            return
        } 
        setImagesSelected([...imagesSelected, response.image]) //[CAP66] llevar lo que tiene imagesSelected y le vas adicionar 
    }

    const removeImage = (image) => { //[CAP67] REMOVER IMAGENES 
        Alert.alert( //[CAP67] el metodo .alert tiene los parametros ...
            "Eliminar Imagen",                                  // parametro 1 titulo del alert
            "¿Estas seguro que quieres eliminar la imagen?",    // parametro 2 descripcion del alert
            [ // parametro 3 coleccion de botones
                {
                    text: "No", // propiedad texto que va tener el boton
                    style: "cancel"  // style tipo cancel                
                },
                {
                    text: "Sí",
                    onPress: () => {
                        setImagesSelected(
                            filter(imagesSelected, (imageUrl) => imageUrl !== image) //[CAP67] filter que pinte todas las imagenes seleccionadas menos la url que le estan mandando
                        )
                    }
                }
            ],
            { cancelable: false }
        )
    }

    return (
        <ScrollView //aqui se colocan las diferentes imagenes que se van a tener
            horizontal //[CAP64] propiedad para hacer scroll horizontala con las imagenes que se van agregar
            style={styles.viewImages}
        >
            {
                size(imagesSelected) < 10 && ( //[CAP65] pintar icono si el tamaño del arreglo es menos a 10 
                    <Icon
                        type="material-community"
                        name="camera"
                        color="#7a7a7a"
                        containerStyle={styles.containerIcon}
                        onPress={imageSelect} //[CAP66] selecciona una sola imagen 
                    />
                )
            }
            {
                map(imagesSelected, (imageRestaurant, index) => ( //[CAP65] mapea el objeto imagesSelected(por cada objeto de este va generar un arreglo llamado imageRestaurant y tambien generara un index para que sea unico)
                    <Avatar //[CAP65] cada imagen del restaurante se va pintar en el componete Avatar 
                        key={index}                     //llave unica
                        style={styles.miniatureStyle}   // estilo
                        source={{ uri: imageRestaurant }} // doble llave por que es un objeto, cada imagen va salir de imageRestaurant
                        onPress={() => removeImage(imageRestaurant)}
                    />
                )) //[CAP65] sintaxis con parentesis en vez de llaves por que es un return implicito
            }

        </ScrollView>
    )
}
//-----------------------------------------------------------------------------------------//
function FormAdd({ 
    formData, 
    setFormData, 
    errorName, 
    errorDescription, 
    errorEmail, 
    errorAddress, 
    errorPhone, 
    setIsVisibleMap,
    locationRestaurant
}) {
    const [country, setCountry] = useState("CO") //[CAP62] estado para el pais
    const [callingCode, setCallingCode] = useState("57") //estado codigo de llamada
    const [phone, setPhone] = useState("") //numero de telefono 

    const onChange = (e, type) => { //[CAP63] cuando cambie cualquier campo del formulario lo va almacenar
        setFormData({ ...formData, [type] : e.nativeEvent.text }) //[CAP63] como es un objeto se abren llaves, destrotoring se le dice que almacene lo que tiene en el formData y le sume el [type] y va ser lo que tenga : e.nativeEvent.text para que capture el texto de lo que capture el impu
    }

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante..." //esta propiedad va ser lo que usuario va ver 
                defaultValue={formData.name}     //[CAP63] defaultValue va ser igual formData en la propiedad name
                onChange={(e) => onChange(e, "name")} //[CAP63] cuando cambie se le pasa el evento y se le dice que va almacenar la propiedad name
                errorMessage={errorName} //aqui se captura el error
            />
            <Input
                placeholder="Dirección del restaurante..."
                defaultValue={formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
                rightIcon={{ //[CAP69]cuando pincha en ese icono va mostrar la direccion del restaurante //rightIcon propidad que ubica el icono en la parte derecha
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#442484" : "#c2c2c2", // : locationRestaurant tiene valor pintar el icono de "#442484" :(sino) pintar de "#c2c2c2"
                    onPress: () => setIsVisibleMap(true) //evento acciona el estado setIsVisibleMap a true y muestre el Modal 
                }}
            />
            <Input
                keyboardType="email-address"
                placeholder="Email del restaurante..."
                defaultValue={formData.email}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errorEmail}
            />
            <View style={styles.phoneView}>
                <CountryPicker
                    withFlag //coloca bandera del pais
                    withCallingCode //coloca ek codigo del pais
                    withFilter //permite buscar los paises
                    withCallingCodeButton // peromite colocar el boton de codigo de llamada
                    containerStyle={styles.countryPicker} //agregar estilos
                    countryCode={country} //countryCode almacena en un objeto que se llama country
                    onSelect={(country) => { //cuando seleccione retorna un objeto llamado country que contiene  
                        setFormData({   //[CAP63] cuando cambie el pais actualize el estado 
                            ...formData, //[CAP63] en el ...(sprei operator) se le dice que almacene el formData
                            "country": country.cca2, //country.cca2, codigo internacional del pais de 2 caracteres  
                            "callingCode": country.callingCode[0]
                        })
                    }}
                />
                <Input // aqui se pide wasap del restaurante
                    placeholder="WhatsApp del restaurante..."
                    keyboardType="phone-pad" //se recomienda para capturar telefonos 
                    containerStyle={styles.inputPhone}
                    defaultValue={formData.phone}
                    onChange={(e) => onChange(e, "phone")}
                    errorMessage={errorPhone}
                />
            </View>
            <Input
                placeholder="Descripción del restaurante..."
                multiline //propiedad para que pueda ocupar multiples renglones
                containerStyle={styles.textArea} //para hacer los renglones mas gruesos 
                defaultValue={formData.description}
                onChange={(e) => onChange(e, "description")}
                errorMessage={errorDescription}
            />
        </View>
    )
}
//-----------------------------------------------------------------------------------------//
const defaultFormValues = () => { //[CAP63] funcion que devuelve los valores por defecto
    return {
        name: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        country: "CO",
        callingCode: "57"
    }
}
//-----------------------------------------------------------------------------------------//
const styles = StyleSheet.create({
    viewContainer: {
        height: "100%"
    },
    viewForm: {
        marginHorizontal: 10,
    },
    textArea: {
        height: 100,
        width: "100%"
    },
    phoneView: {
        width: "80%",
        flexDirection: "row"
    },
    inputPhone: {
        width: "80%"
    },
    btnAddRestaurant: {
        margin: 20,
        backgroundColor: "#442484"
    },
    viewImages: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70, //[CAP64] tamaño de las miniaturas de las imagenes 
        width: 79,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",              //[CAP68] alinear iconos al centro
        height: 200,                       //[CAP68] altura
        marginBottom: 20                   //[CAP68] para que la imagen no se pegue al formulario
    },
    mapStyle: {                            //[CAP70] estilo para el mapa 
        width: "100%",                     // ocupa el ancho
        height: 550                        // altura 550 pixeles
    },
    viewMapBtn: {                          // estilo contenedor botones del mapa
        flexDirection: "row",              // alinear los componentes horizontalmente
        justifyContent: "center",          // alinear al centro
        marginTop: 10
    },
    viewMapBtnContainerCancel: {           //estilo contenedor boton cancelar ubicacion en el mapa
        paddingLeft: 5                     // margen a la izquierda
    },
    viewMapBtnContainerSave: {             // estilo contenedor boton guardar ubicacion en el mapa
        paddingRight: 5,                   // margen a la derecha
    },
    viewMapBtnCancel: {                    //estilo boton cancelar ubicacion en el mapa
        backgroundColor: "#a65273"
    },
    viewMapBtnSave: {                     //estilo boton guardar ubicacion en el mapa
        backgroundColor: "#442484"
    }
})
