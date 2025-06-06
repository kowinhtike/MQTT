#include <WiFi.h>
#include <PubSubClient.h>

// WiFi credentials
const char* ssid = "";
const char* password = "";

// MQTT Broker settings
const char* mqtt_server = "192.168.1.5";
const int mqtt_port = 1883;
const char* mqtt_topic = "esp32/led";

// LED pin (use GPIO 3 as an example)
const int ledPin = 2;

// WiFi and MQTT clients
WiFiClient espClient;
PubSubClient client(espClient);

// Reconnect to WiFi
void setup_wifi() {
  delay(10);
  pinMode(ledPin,OUTPUT);
  digitalWrite(ledPin,LOW);
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ WiFi connected");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

// MQTT message callback
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("📩 Received: ");
  Serial.print(topic);
  Serial.print(" -> ");

  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);

  if (message == "on") {
    digitalWrite(ledPin, HIGH);
    Serial.println("💡 LED ON");
  } else if (message == "off") {
    digitalWrite(ledPin, LOW);
    Serial.println("💡 LED OFF");
  }
}

// Reconnect to MQTT Broker
void reconnect() {
  while (!client.connected()) {
    Serial.print("🔄 Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("✅ Connected");
      client.subscribe(mqtt_topic);
    } else {
      Serial.print("❌ Failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
