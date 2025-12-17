import { StyleSheet, View, Image, Text } from "react-native";
import { useEffect, useRef, useState } from "react";
import { LineChart } from "react-native-gifted-charts";
import * as Notifications from "expo-notifications";


const WS_URL = "ws://otimiris.com.br:8080";
const MAX_POINTS = 100;
const ALERT_COOLDOWN = 60_000;


async function showNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeValue(data) {
  if (typeof data === "number") return data;
  if (typeof data === "string") return Number(data);
  if (typeof data === "object" && data !== null && "value" in data) {
    return Number(data.value);
  }
  return null;
}

export default function App() {
  const wsRef = useRef(null);

  const [fumaca, setFumaca] = useState([]);
  const [temperatura, setTemperatura] = useState([]);
  const [umidade, setUmidade] = useState([]);

  const lastAlert = useRef({
    temp: 0,
    fuma: 0,
  });

  useEffect(() => {
    Notifications.requestPermissionsAsync();

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("🟢 WS conectado");

      [
        "fumaca",
        "temperatura",
        "umidade",
        "alertaTemp",
        "alertaFuma",
      ].forEach((q) =>
        ws.send(JSON.stringify({ action: "subscribe", queue: q }))
      );
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.queue === "alertaTemp" && Number(msg.data) === 1) {
          if (Date.now() - lastAlert.current.temp > ALERT_COOLDOWN) {
            showNotification(
              "🔥 ALERTA DE TEMPERATURA",
              "Temperatura acima do limite seguro"
            );
            lastAlert.current.temp = Date.now();
          }
          return;
        }

        if (msg.queue === "alertaFuma" && Number(msg.data) === 1) {
          if (Date.now() - lastAlert.current.fuma > ALERT_COOLDOWN) {
            showNotification(
              "🚨 ALERTA DE FUMAÇA",
              "Presença de fumaça detectada"
            );
            lastAlert.current.fuma = Date.now();
          }
          return;
        }

        const value = normalizeValue(msg.data);
        if (value === null || Number.isNaN(value)) return;

        const point = {
          value,
          label: formatTime(msg.ts),
        };

        if (msg.queue === "fumaca")
          setFumaca((p) => [...p.slice(-MAX_POINTS), point]);

        if (msg.queue === "temperatura")
          setTemperatura((p) => [...p.slice(-MAX_POINTS), point]);

        if (msg.queue === "umidade")
          setUmidade((p) => [...p.slice(-MAX_POINTS), point]);
      } catch (e) {
        console.log("❌ Erro WS:", e.message);
      }
    };

    ws.onerror = (e) => console.log("🔴 WS erro:", e.message);
    ws.onclose = () => console.log("⚪ WS fechado");

    return () => ws.close();
  }, []);

  const Chart = ({ title, yLabel, data, max }) => (
    <View style={styles.chartBlock}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.chartRow}>
        <Text style={styles.yLabel}>{yLabel}</Text>

        <LineChart
          data={data}
          height={120}
          width={220}
          maxValue={max}
          thickness={2}
          showYAxis
          showXAxis
          yAxisTextStyle={{ fontSize: 9 }}
          xAxisLabelTextStyle={{ fontSize: 8 }}
          noOfSections={5}
        />
      </View>

      <Text style={styles.xLabel}>Horário</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Image source={require("./assets/logo.png")} style={styles.logo} />
      </View>

      <Chart title="Detecção de Fumaça" yLabel="Fumaça" data={fumaca} max={25} />
      <Chart title="Temperatura" yLabel="°C" data={temperatura} max={50} />
      <Chart title="Umidade" yLabel="%" data={umidade} max={100} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  navbar: {
    width: "100%",
    height: "16%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "20%",
    height: "28%",
  },
  chartBlock: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  yLabel: {
    transform: [{ rotate: "-90deg" }],
    marginRight: 10,
    fontSize: 12,
  },
  xLabel: {
    fontSize: 12,
    marginTop: 5,
  },
});
