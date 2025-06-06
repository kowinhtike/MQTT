// App.js
import mqtt from 'mqtt';
import React, { useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [toggle, setToggle] = useState(true); // true = ON, false = OFF
  const clientRef = useRef(null);

  const broker = 'wss://79352ac0dd614ccd8b4338387ecada1f.s1.eu.hivemq.cloud:8884/mqtt';
  const topic = 'esp32/led';
  const username = 'winhtike';
  const password = 'Win123456';

  const handleConnect = () => {
    const options = {
      username,
      password,
      reconnectPeriod: 0, // Disable auto reconnect
      connectTimeout: 30 * 1000,
      clean: true,
    };

    const client = mqtt.connect(broker, options);
    clientRef.current = client;

    client.on('connect', () => {
      console.log('✅ Connected to HiveMQ Cloud');
      setIsConnected(true);
      client.subscribe(topic, (err) => {
        if (err) {
          console.log('❌ Subscribe error:', err);
        }
      });
    });

    client.on('error', (err) => {
      console.log('❌ MQTT Error:', err);
      Alert.alert('Connection Error', err.message);
      client.end();
      setIsConnected(false);
    });

    client.on('close', () => {
      console.log('🔌 Connection closed');
      setIsConnected(false);
    });
  };

  const handleSend = () => {
    if (clientRef.current && isConnected) {
      const message = toggle ? 'ON' : 'OFF';
      clientRef.current.publish(topic, message);
      console.log(`📡 Sent: ${message}`);
      setToggle(!toggle);
    } else {
      Alert.alert('Not Connected', 'MQTT client not connected');
    }
  };

  const handleClose = () => {
    if (clientRef.current) {
      clientRef.current.end();
      clientRef.current = null;
      setIsConnected(false);
      console.log('🔌 Disconnected manually');
      Alert.alert('Disconnected', 'MQTT connection closed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 MQTT Expo Controller</Text>
      <Text style={styles.status}>
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </Text>

      {!isConnected && (
        <View style={styles.button}>
          <Button title="Connect to MQTT Broker" onPress={handleConnect} />
        </View>
      )}

      {isConnected && (
        <>
          <View style={styles.button}>
            <Button title={`Send ${toggle ? 'ON' : 'OFF'}`} onPress={handleSend} />
          </View>
          <View style={styles.button}>
            <Button title="Close Connection" color="red" onPress={handleClose} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    marginVertical: 10,
  },
});
