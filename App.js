import { StatusBar } from 'expo-status-bar';
import { VictoryChart, VictoryLine, VictoryAxis } from "victory-native";
import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect } from 'react';

export default function App() {
   const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const lastY = prev.length ? prev[prev.length - 1].y : 20;

        const newPoint = {
          x: new Date(),
          y: lastY + (Math.random() - 0.5) * 2
        };

        return [...prev.slice(-50), newPoint];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
      <Image
        source={require('./assets/logo.png')}
        style={styles.logo}
      />
    </View>

      <VictoryChart scale={{ x: "tempo", y: "Fumaça" }}>
      <VictoryAxis fixLabelOverlap />
      <VictoryAxis dependentAxis />
      <VictoryLine
        data={data}
        style={{
          data: { stroke: "#2563EB" }
        }}
      />
    </VictoryChart>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  navbar: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#0F172A',
  },

  logo: {
    width: 38,
    height: 20,
  },

  chartContainer: {
    width: '100%',     // 🔑 gráfico ocupa tudo
    paddingHorizontal: 16,
    marginTop: 16,
  },
});
