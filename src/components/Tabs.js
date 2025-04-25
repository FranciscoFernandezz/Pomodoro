import { Pressable, View, Text, StyleSheet } from "react-native";

export default function Tabs(props) {
  const { seleccion, setSeleccion, setTiempo } = props;
  const opciones = ["Pomodoro", "Descanso corto", "Descanso largo"];
  const duraciones = [25 * 60, 5 * 60, 15 * 60]; // tiempos en segundos

  function cambiarSeleccion(index) {
    setSeleccion(index);
    setTiempo(duraciones[index]);
  }

  return (
    <View style={styles.tabsContainer}>
      {opciones.map((opcion, index) => (
        <Pressable
          style={[
            styles.tab,
            seleccion === index && styles.tabSeleccionado,
          ]}
          key={index}
          onPress={() => cambiarSeleccion(index)}
        >
          <Text style={styles.tabText}>{opcion}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    marginRight: 10,
    marginLeft: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  tabSeleccionado: {
    borderColor: '#000', 
    borderWidth: 3,
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
});
