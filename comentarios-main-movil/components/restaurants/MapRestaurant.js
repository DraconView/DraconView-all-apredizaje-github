import React from 'react'
import MapView from 'react-native-maps'
import openMap from 'react-native-open-maps' 

export default function MapRestaurant({ location, name, height }) { //[CAP86] se le pasan las propiedades
    const openAppMap = () => { //>>oAM2 
        openMap({ // recibe un objeto con las siguientes propiedades
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 19,
            query: name // nombre a una consulta
        })
    }

    return (
        <MapView
            style={{ height: height, width: "100%" }} // height la altura del mapa es igual a la altura que se recibe
            initialRegion={location}    // arranca en la location que le pasen por parametros
            onPress={openAppMap}        // >>oAM1
        >
            <MapView.Marker             // alfiler de la localizacion
                coordinate={{           // propiedades de MapView.Marker
                    latitude: location.latitude,
                    longitude: location.longitude
                }}
            />
        </MapView>
    )
}
