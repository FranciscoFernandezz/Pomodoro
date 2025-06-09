import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const enviarNotificacion = async (delayInSeconds = 0) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏳ Pomodoro Finalizado",
      body: "Tu tiempo ha terminado. ¡Tómate un descanso!",
      sound: true,
    },
    trigger: {
      seconds: delayInSeconds,
    },
  });
};

export const cancelarTodasNotificaciones = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
