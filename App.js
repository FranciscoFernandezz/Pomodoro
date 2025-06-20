import { Platform, SafeAreaView, StyleSheet, Text, View, AppState } from 'react-native';
import Titulo from './src/components/Titulo';
import Timer from './src/components/Timer';
import Boton from './src/components/Boton';
import Tabs from './src/components/Tabs';
import { useState, useEffect, useRef } from 'react';
import { Audio } from "expo-av";
import * as Notifications from 'expo-notifications';
import { enviarNotificacion, cancelarTodasNotificaciones } from './src/utility/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const duraciones = [25 * 60, 5 * 60, 15 * 60];
  const colores = ["#93de6b", "#66F2CD", "#D2F266"];

  const [run, setRun] = useState(false);
  const [seleccion, setSeleccion] = useState(0);
  const [tiempo, setTiempo] = useState(duraciones[seleccion]);

  const appState = useRef(AppState.currentState);

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

  useEffect(() => {
    solicitarPermisosNotificaciones();
  }, []);

  useEffect(() => {
    let intervalo = null;

    if (run) {
      guardarInicioTemporizador();
      enviarNotificacion(tiempo);

      intervalo = setInterval(() => {
        setTiempo(prev => {
          if (prev <= 1) {
            clearInterval(intervalo);
            setRun(false);
            reproducirAlarma();
            AsyncStorage.removeItem('inicio');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      cancelarTodasNotificaciones();
      AsyncStorage.removeItem('inicio');
    }

    return () => clearInterval(intervalo);
  }, [run]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        const inicioStr = await AsyncStorage.getItem('inicio');
        const notificado = await AsyncStorage.getItem('notificado');

        if (run && inicioStr) {
          const inicio = parseInt(inicioStr);
          const ahora = Date.now();
          const diff = Math.floor((ahora - inicio) / 1000);
          const nuevoTiempo = duraciones[seleccion] - diff;

          if (nuevoTiempo <= 0 && notificado !== 'true') {
            setRun(false);
            setTiempo(0);
            await AsyncStorage.setItem('notificado', 'true');
            enviarNotificacion();
            reproducirAlarma();
          } else {
            setTiempo(nuevoTiempo);
          }
        }
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [run, seleccion]);

  async function guardarInicioTemporizador() {
    const now = Date.now();
    await AsyncStorage.setItem('inicio', now.toString());
    await AsyncStorage.setItem('duracion', duraciones[seleccion].toString());
    await AsyncStorage.removeItem('notificado');
  }

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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { marginTop: Platform.OS === 'android' ? 25 : 0 }, { backgroundColor: colores[seleccion] }]}>
        <Titulo title={"Pomodoro App"} />
        <Timer tiempo={formatearTiempo(tiempo)} />
        <Boton run={run} setRun={setRun} />
        <Tabs seleccion={seleccion} setSeleccion={index => {
          setSeleccion(index);
          setTiempo(duraciones[index]);
        }} setTiempo={setTiempo} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
