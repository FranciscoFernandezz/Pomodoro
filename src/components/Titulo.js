//Componente

import { StyleSheet, Text, View } from "react-native";

export default function Titulo({title}) {
    //Logica del componente
    return (
        <View>
            <Text style={styles.texto}>{title}</Text>
        </View>
    );
}

//Creando el elemento estilos
const styles = StyleSheet.create({
    texto:{
        marginTop:40,
        marginLeft:10,
        fontSize:30,
        fontWeight: "bold",
        color:"#fff"
    }
})