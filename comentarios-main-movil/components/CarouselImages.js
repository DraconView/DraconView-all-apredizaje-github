import React from 'react'
import { Image } from 'react-native-elements'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { size } from 'lodash'
//------------------------------------------------------------------------------------------
            <MyPagination data={images} activeSlide={activeSlide}/> 
export default function CarouselImages({ images, height, width, activeSlide, setActiveSlide }) { //[CAP83] recibe images(collecion), altura, ancho, activeSlide(imagen activa), setActiveSlide(modificador de estado)
    const renderItem = ({ item }) => { >>rI1
        return ( // por cada componente que rendiza va retornar
            <Image 
                style={{ width, height  }}
                PlaceholderContent={<ActivityIndicator color="#fff"/>} //PlaceholderContent(renderizar mientras se carga la imagen), ActivityIndicator(un indicador de carga circular)
                source={{ uri: item }} //origen de la imagen
            />
        )
    }

    return ( // cuando llegue aqui retorna Carousel
        <View>
            <Carousel
                layout={"default"}
                data={images} // muestra la coleccion
                sliderWidth={width} // ancho total del eslaider 
                itemWidth={width} //cada foto que ancho va tener
                itemHeight={height} //altura 
                renderItem={renderItem} // >>rI1 render recibe como parametro el item
                onSnapToItem={(index) => setActiveSlide(index)} // funcionalidad para que la imagen se desplaze cuando se toque un punto
            />
            <MyPagination data={images} activeSlide={activeSlide}/> // >>MP1 MyPagination(componente), data(contiene la lista de iamgenes), activeSlide(nos lo pasan como parametro)
        </View>
    )
}
//-----------------------------------------------------------------------------------------------------
function MyPagination({ data, activeSlide }) { ////[CAP84] >>MP1 recibe data(coleccion de imagenes) y activeSlide
    return (
        <Pagination // propiedades
            dotsLength={size(data)} // dotsLength(por cada imagen agrega un punto), que va ser el tamaño del size de la data
            activeDotIndex={activeSlide} // activeDotIndex(indica el punto que va estar resaltado)
            containerStyle={styles.containerPagination} // estilos 
            dotStyle={styles.dotActive} // dotStyle(estilo del punto)
            inactiveDotStyle={styles.dotInactive} // estilo del punto inactivo 
            inactiveDotOpacity={0.6} // opacidad del punto inactivo
            inactiveDotScale={0.6} // tamaño del punto inactivo
        />
    )
}

const styles = StyleSheet.create({
    containerPagination: {                  
        backgroundColor: "transparent",     // para que los puntos se transpongan en la imagen
        zIndex: 1,                          // para que quede arriba
        position: "absolute",               
        bottom: 0,                          // que se pegue abajo
        alignSelf: "center"                 // alineacion al centros
    },
    dotActive: {                            // estilo de puntos activos
        width: 20,                          // ancho
        height: 20,                         // altura
        borderRadius: 10,                   // cuando es la mitad del alto queda redondo 
        marginHorizontal: 2,                // para que no se peguen entre si
        backgroundColor: "#442484"          // color de marca 
    },
    dotInactive: {                          // estilo de puntos inactivos
        width: 14,
        height: 14,
        borderRadius: 7,
        marginHorizontal: 2,
        backgroundColor: "#fff"
    }
})
