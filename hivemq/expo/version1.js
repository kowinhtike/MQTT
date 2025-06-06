// App.js
import mqtt from 'mqtt';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function App() {
  useEffect(() => {
    const broker = 'wss://79352ac0dd614ccd8b4338387ecada1f.s1.eu.hivemq.cloud:8884/mqtt';
    const topic = 'esp32/led';
    const username = 'winhtike';
    const password = 'Win123456';

    // Connect options
    const options = {
      username,
      password,
      reconnectPeriod: 1000, // auto reconnect after 1 sec
      connectTimeout: 30 * 1000,
      clean: true,
    };

    // Connect to broker
    const client = mqtt.connect(broker, options);

    client.on('connect', () => {
      console.log('✅ Connected to HiveMQ Cloud');
      client.subscribe(topic, (err) => {
        if (err) {
          console.log('❌ Subscribe error:', err);
        }
      });

      // Publish ON and OFF alternately
      let toggle = true;
      const interval = setInterval(() => {
        const msg = toggle ? 'ON' : 'OFF';
        client.publish(topic, msg);
        console.log(`📡 Published: ${msg}`);
        toggle = !toggle;
      }, 1000);

      // Clean up on unmount
      return () => {
        clearInterval(interval);
        client.end();
        console.log('🔌 Disconnected from MQTT broker');
      };
    });

    client.on('error', (err) => {
      console.log('❌ Connection error:', err);
      client.end();
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🚀 MQTT to HiveMQ Cloud via Expo</Text>
    </View>
  );
}
