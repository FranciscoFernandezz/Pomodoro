/* import { Text } from "react-native";

export default function Boton(){

} */
import { Pressable, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av";

export default function Boton( props) {
  const {run, setRun} = props

  const cambiarEstado = () =>{
    setRun(!run);
    //agregar funcion para reproducir sonido
    playSonido();
  }

  async function playSonido(){
    const {sound}= await Audio.Sound.createAsync(require("../../assets/Sonido/click.mp3"));
    await sound.playAsync(); //Reproduce el sonido
  };

  return (
    <Pressable style={styles.boton} onPress={cambiarEstado} >
      <Text style={styles.texto}>
        {run ? "Parar" :"Comenzar"} {/* renderizado condicional para cambiar el texto del boton */}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20, 
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, 
    marginLeft: 10
  },
  texto: {
    color: '#000', 
    fontSize: 30,
    fontWeight: 'bold', 
  },
});
