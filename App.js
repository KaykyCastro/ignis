import { StyleSheet, View, Image, Text } from "react-native";
import { useEffect, useState } from "react";
import { LineChart } from "react-native-gifted-charts";


export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const lastValue =
          prev.length > 0 ? prev[prev.length - 1].value : 10;

        // variação suave
        let nextValue = lastValue + (Math.random() * 4 - 2);

        // limita entre 0 e 25
        nextValue = Math.max(0, Math.min(25, nextValue));

        const newPoint = {
          value: Number(nextValue.toFixed(1)),
          label: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: new Date(), // tempo REAL capturado
        };

        return [...prev.slice(-30), newPoint]; // mantém últimos 30 pontos
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

const chartData = data.map(p => ({
  value: p.value,   
  label: p.label,   
}));

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Image
          source={require("./assets/logo.png")}
          style={styles.logo}
        />
      </View>

<View style={{gap: 20}}>
<View style={{alignItems: 'center', justifyContent: 'center', marginRight: 60}}>
  <Text style={{marginBottom: 20, fontWeight: 'bold'}}>Detecção de Fumaça</Text>
  <View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  <View
    style={{
      width: 30,            
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text
      style={{
        transform: [{ rotate: '-90deg' }],
        fontSize: 12,
        width: 60
      }}
    >
      Fumaça
    </Text>
  </View>


  <View>
    <LineChart
      data={chartData}
      height={120}
      width={200}
      maxValue={25}
      showYAxis
      showXAxis
      thickness={2}
      yAxisTextStyle={{ fontSize: 9 }}
       xAxisLabelTextStyle={{ fontSize: 8 }}
    />
  </View>
</View>
  <Text style={{
        fontSize: 12,
      }}>Horário</Text>
</View>

<View style={{alignItems: 'center', justifyContent: 'center', marginRight: 60}}>
  <Text style={{marginBottom: 20, fontWeight: 'bold'}}>Detecção de Temperatura</Text>
  <View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  <View
    style={{
      width: 30,            
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text
      style={{
        transform: [{ rotate: '-90deg' }],
        fontSize: 12,
        width: 100
      }}
    >
      Temperatura
    </Text>
  </View>


  <View>
    <LineChart
      data={chartData}
      height={120}
      width={200}
      maxValue={50}
      showYAxis
      showXAxis
      thickness={2}
      yAxisTextStyle={{ fontSize: 9 }}
       xAxisLabelTextStyle={{ fontSize: 8 }}
    />
  </View>
</View>
  <Text style={{
        fontSize: 12,
      }}>Horário</Text>
</View>

<View style={{alignItems: 'center', justifyContent: 'center', marginRight: 60}}>
  <Text style={{marginBottom: 20, fontWeight: 'bold'}}>Detecção de Umidade</Text>
  <View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  <View
    style={{
      width: 30,            
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text
      style={{
        transform: [{ rotate: '-90deg' }],
        fontSize: 12,
        width: 100
      }}
    >
      Umidade
    </Text>
  </View>


  <View>
    <LineChart
      data={chartData}
      height={120}
      width={200}
      maxValue={50}
      showYAxis
      showXAxis
      thickness={2}
      yAxisTextStyle={{ fontSize: 9 }}
       xAxisLabelTextStyle={{ fontSize: 8 }}
    />
  </View>
</View>
  <Text style={{
        fontSize: 12,
      }}>Horário</Text>
</View>

</View>
      
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  graphics: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navbar: {
    width: '100%',
    height: '16%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#ffffffff',
  },

  logo: {
    width: '20%',
    height: '28%',
  },
});
