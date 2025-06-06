#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

// WiFi credentials
const char* ssid = "";
const char* password = "";

// HiveMQ Cloud broker
const char* mqtt_server = "";
const int mqtt_port = 8883;
const char* mqtt_topic = "esp32/led";

// HiveMQ Cloud credentials
const char* mqtt_user = "";
const char* mqtt_pass = "";

// LED pin
const int ledPin = 2;

// Secure WiFi client
WiFiClientSecure espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
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

  if (message == "ON") {
    digitalWrite(ledPin, HIGH);
    Serial.println("💡 LED ON");
  } else if (message == "OFF") {
    digitalWrite(ledPin, LOW);
    Serial.println("💡 LED OFF");
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("🔄 Attempting MQTT connection...");

    // Set MQTT credentials
    if (client.connect("ESP32Client", mqtt_user, mqtt_pass)) {
      Serial.println("✅ Connected to HiveMQ Cloud");
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
  Serial.begin(115200);
  setup_wifi();

  // Set secure connection (TLS)
  espClient.setInsecure();  // ⚠️ Only for testing! Use proper certificate in production.

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
