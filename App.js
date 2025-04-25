import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Titulo from './src/components/Titulo';
import Timer from './src/components/Timer';
import Boton from './src/components/Boton';
import Tabs from './src/components/Tabs';
import { useState } from 'react';
import { useEffect } from 'react';
import { Audio } from "expo-av"; 
import { enviarNotificacion } from './src/utility/notifications';

export default function App() {
  /* const [tiempo, setTiempo] = useState(0); */
  const [run, setRun] =useState(false);
  const duraciones = [0.1 * 60, 5 * 60, 15 * 60]; // mismo orden que en Tabs
  const [seleccion, setSeleccion] = useState(0);
  const [tiempo, setTiempo] = useState(duraciones[seleccion]);
  

  const colores = ["#93de6b", "#66F2CD", "#D2F266"];

    //solicitar permisos
  const solicitarPermisosNotificaciones = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        console.log("Permiso de notificación denegado");
        return;
      }
    }
    console.log("Permiso de notificación concedido");
  };


  useEffect(()=>{
    solicitarPermisosNotificaciones();
  }, []);

  useEffect(() => {
    let intervalo = null;
  
    if (run) {
      intervalo = setInterval(() => {
        setTiempo((prev) => {
          if (prev <= 1) {
            clearInterval(intervalo);
            setRun(false);
            reproducirAlarma();
            enviarNotificacion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  
    return () => clearInterval(intervalo);
  }, [run]); 
  
 /*  const sonido = require("../../assets/Sonido/click.mp3") */

  async function reproducirAlarma() {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/Sonido/alarma.mp3')
    );
    await sound.playAsync();
  }




  function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const restoSegundos = segundos % 60;
    return `${minutos < 10 ? '0' : ''}${minutos}:${restoSegundos < 10 ? '0' : ''}${restoSegundos}`;
  }
  

  return (
    <SafeAreaView style={{flex:1/* , backgroundColor: "#93de6b" */}}> {/*esto es para ios*/}
      <View style={[styles.container, {marginTop: Platform.OS === 'android' ? 25:0},{backgroundColor: colores[seleccion]}]}>
        <Titulo title={"Pomodoro App"}/>
        <Timer tiempo={formatearTiempo(tiempo)} />
        <Boton run={run} setRun={setRun}/>
        <Tabs seleccion={seleccion} setSeleccion={setSeleccion} setTiempo ={setTiempo}/>
      </View>;
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
});
