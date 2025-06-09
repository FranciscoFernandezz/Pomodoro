import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enviarNotificacion } from './notifications';

const BACKGROUND_FETCH_TASK = "background-fetch-timer-task";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const inicioStr = await AsyncStorage.getItem('inicio');
    const duracionStr = await AsyncStorage.getItem('duracion');

    if (!inicioStr || !duracionStr) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const inicio = parseInt(inicioStr);
    const duracion = parseInt(duracionStr);
    const ahora = Date.now();
    const diff = Math.floor((ahora - inicio) / 1000);
    const notificado = await AsyncStorage.getItem('notificado');

    if (diff >= duracion && notificado !== 'true') {
      await enviarNotificacion();
      await AsyncStorage.setItem('notificado', 'true');
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error("Error en background fetch:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTimer() {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    if (
      status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
      status === BackgroundFetch.BackgroundFetchStatus.Denied
    ) {
      console.log("Permisos de Background Fetch no concedidos");
      return;
    }

    const isTaskDefined = TaskManager.isTaskDefined(BACKGROUND_FETCH_TASK);
    const isRegistered = await BackgroundFetch.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);

    if (!isRegistered && isTaskDefined) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("✅ Tarea de background registrada");
    }
  } catch (error) {
    console.error("Error al registrar tarea en background:", error);
  }
}
