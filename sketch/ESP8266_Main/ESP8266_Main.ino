#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Servo.h>
const char* WIFI_SSID     = "TrustHome Tang 6";
const char* WIFI_PASSWORD = "trusthome";
const char* MQTT_BROKER   = "192.168.1.31";
const uint16_t MQTT_PORT  = 1883;

const char* TOPIC_SHOW    = "smartparking/lcd/show";
const char* TOPIC_BUZZ    = "smartparking/buzzer/play";
const char* TOPIC_SERVO_OPEN = "smartparking/servo/open";
const char* TOPIC_SERVO_CLOSE = "smartparking/servo/close";
const char* TOPIC_SERVO_STATUS= "smartparking/servo/status";
WiFiClient    net;
PubSubClient  mqtt(net);
LiquidCrystal_I2C lcd(0x27, 16, 2);
const uint8_t BUZZER_PIN = 14;  // change if needed
const uint8_t SERVO_PIN = 12;
const uint8_t TRIG_PIN   = 5;   
const uint8_t ECHO_PIN   = 13; 
Servo servo;
bool opened = false;             
bool closing_in_progress = false; 

void printLCDReady() {
    lcd.clear();
    const char* l1 = "SMART PARKING";
    const char* l2 = "San sang tap";
    lcd.setCursor(0, 0); lcd.print(l1); Serial.println(l1);
    lcd.setCursor(0, 1); lcd.print(l2); Serial.println(l2);
}

float readDistance() {
  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(3);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  unsigned long us = pulseIn(ECHO_PIN, HIGH); // timeout 30ms
  if (!us) return NAN;
  Serial.println((us * 0.0343f) / 2.0f);
  return (us * 0.0343f) / 2.0f; // cm
}

void waitCarPassAndClose() {
  float sum=0; int n=0;
  for (int i=0; i<5; i++){ float d=readDistance(); if(!isnan(d)){sum+=d; n++;} delay(50);}
  if (n==0) {
    Serial.println("cannot read");
    return;
  }  
  float base = sum/n;
  float nearTh  = base - (base*0.35f);
  float clearTh = base - (base*0.15f);

  bool seenNear = false;
  unsigned long t0 = millis();
  while (millis() - t0 < 11000) { 
    float d = readDistance();
    if (isnan(d)) { delay(60); continue; }
    if (!seenNear && d < nearTh) seenNear = true;
    if (seenNear && d > clearTh) break;
    delay(60);
  }
  servo.write(0);
  delay(2000);
  servo.write(90);

  opened = false;
  digitalWrite(BUZZER_PIN, HIGH); delay(80); digitalWrite(BUZZER_PIN, LOW);
  Serial.println("Servo closed");
  StaticJsonDocument<64> j; j["state"]="closed";
  char buf[64]; serializeJson(j, buf);
  mqtt.publish(TOPIC_SERVO_STATUS, buf);
}

void mqttCallback(char* topic, byte* payload, unsigned int len) {
  int close = 0;
  if (strcmp(topic, TOPIC_SHOW) == 0) {
    StaticJsonDocument<128> doc;
    if (deserializeJson(doc, payload, len)) return;
    const char* l1 = doc["line1"] | "";
    const char* l2 = doc["line2"] | "";
    lcd.clear();
    lcd.setCursor(0, 0); lcd.print(l1); Serial.println(l1);
    lcd.setCursor(0, 1); lcd.print(l2); Serial.println(l2);
  }
  else if (strcmp(topic, TOPIC_BUZZ) == 0) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
  }
  else if (strcmp(topic, TOPIC_SERVO_OPEN) == 0) {
    opened = true;
    servo.write(0);
    delay(2000);
    Serial.println("Servo open");
    servo.write(90);
  }
  else if (strcmp(topic, TOPIC_SERVO_CLOSE) == 0) {
    if (!opened) { Serial.println("Close ignored (not open)"); return; }
    if (closing_in_progress) { Serial.println("Close ignored (busy)"); return; }
    closing_in_progress = true;
    waitCarPassAndClose();
    closing_in_progress = false;
    printLCDReady();
  }
}

void connectMQTT() {
  while (!mqtt.connected()) {
    if (mqtt.connect("esp8266_lcd")) {
      mqtt.subscribe(TOPIC_SHOW);
      mqtt.subscribe(TOPIC_BUZZ);
      mqtt.subscribe(TOPIC_SERVO_OPEN);
      mqtt.subscribe(TOPIC_SERVO_CLOSE);

    } else {
      delay(2000);
    }
  }
}

void setup() {
  Wire.begin(2, 0);
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();  
  servo.attach(SERVO_PIN);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) delay(250);

  mqtt.setServer(MQTT_BROKER, MQTT_PORT);
  mqtt.setCallback(mqttCallback);

  printLCDReady();
  connectMQTT();
}

void loop() {
  if (!mqtt.connected()) connectMQTT();
  mqtt.loop();
}
