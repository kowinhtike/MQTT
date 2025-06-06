import paho.mqtt.client as mqtt
import time

#winhtike
#Win123456
# MQTT broker info
broker = "192.168.1.5"
port = 1883
topic = "esp32/led"


# Callback when connected
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connected to MQTT Broker!")
        client.subscribe(topic)
    else:
        print(f"❌ Failed to connect, return code {rc}")

# Create client
client = mqtt.Client()
client.on_connect = on_connect
# Connect to broker
client.connect(broker, port, 60)


# Publish ON and OFF messages to control ESP32 LED
# for i in range(1000):
#     client.publish(topic, "ON")
#     time.sleep(1)

#     client.publish(topic, "OFF")
#     time.sleep(1)

while True:
    command = input("ques :")
    client.publish(topic, command)

client.loop_stop()
client.disconnect()
print("🔌 Disconnected from broker.")
