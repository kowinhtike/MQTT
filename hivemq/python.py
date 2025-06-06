import paho.mqtt.client as mqtt
import time
import ssl

# HiveMQ Cloud broker info
broker = ""
port = 8883
topic = "esp32/led"
username = ""   # HiveMQ Cloud username
password = ""   # HiveMQ Cloud password

# Callback when connected
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connected to HiveMQ Cloud Broker!")
        client.subscribe(topic)
    else:
        print(f"❌ Failed to connect, return code {rc}")

# Create client
client = mqtt.Client()
client.username_pw_set(username, password)  # Set username & password
client.tls_set(tls_version=ssl.PROTOCOL_TLS)  # Enable TLS encryption
client.on_connect = on_connect

# Connect to HiveMQ Cloud
client.connect(broker, port)

# Start the loop in background
client.loop_start()

# Publish ON and OFF messages
for i in range(100):
    client.publish(topic, "ON")
    print("🔆 Published: ON")
    time.sleep(1)

    client.publish(topic, "OFF")
    print("🌙 Published: OFF")
    time.sleep(1)

client.loop_stop()
client.disconnect()
print("🔌 Disconnected from HiveMQ Cloud broker.")
