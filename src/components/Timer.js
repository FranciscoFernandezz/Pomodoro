

    import { View, Text, StyleSheet } from "react-native";

    export default function Timer({ tiempo }) {
      return (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{tiempo}</Text>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40,
        backgroundColor: '#ffffff', 
        padding: 20,
        margin: 10,
        borderRadius: 20,
      },
      timerText: {
        fontSize: 100, 
        fontWeight: 'bold',
        color: '#000000', 
      },
    });
    