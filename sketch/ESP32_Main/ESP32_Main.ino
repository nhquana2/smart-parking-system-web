#include <WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <esp_camera.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#define CAMERA_MODEL_AI_THINKER
#include "camera_pins.h"

// —— WIFI & MQTT setup ——
const char* WIFI_SSID     = "Hoang Phuc";
const char* WIFI_PASSWORD = "211211211";
const char* MQTT_BROKER   = "192.168.3.120";
const uint16_t MQTT_PORT  = 1883;


// —— MQTT topics ——
const char* TOPIC_RFID_TAP           = "smartparking/rfid/tap";
const char* TOPIC_RFID_TAP_STATUS    = "smartparking/rfid/tap-status";
const char* TOPIC_LCD_SHOW           = "smartparking/lcd/show";
const char* TOPIC_BUZZER_PLAY        = "smartparking/buzzer/play";
const char* TOPIC_VEHICLE_IN         = "smartparking/vehicle/in";
const char* TOPIC_VEHICLE_IN_STATUS  = "smartparking/vehicle/in-status";
const char* TOPIC_VEHICLE_OUT        = "smartparking/vehicle/out";
const char* TOPIC_VEHICLE_OUT_STATUS = "smartparking/vehicle/out-status";
const char* TOPIC_SERVO_OPEN = "smartparking/servo/open";
const char* TOPIC_SERVO_CLOSE = "smartparking/servo/close";
const char* TOPIC_RFID_LOG = "smartparking/rfid/log";
#define SS_PIN   15
#define RST_PIN   2
#define TRIG_PIN   5;    // D1 (GPIO5)
#define ECHO_PIN    13;

MFRC522 mfrc522(SS_PIN, RST_PIN);

WiFiClient    net;
PubSubClient  mqtt(net);


enum State { IDLE, WAIT_TAP, WAIT_ANPR, WAIT_VEHICLE } state = IDLE;
String lastUID, inOutType, licensePlate;
const char* ANPR_URL = "http://192.168.3.120:8080/plate/recognize";

// forward declarations
void connectMQTT();
void mqttCallback(char* topic, byte* payload, unsigned int len);
bool captureAndRecognize();
void publishLCD(const char* l1, const char* l2);
void publishBuzzer();
void resetState();

void setup() {
  Serial.begin(115200);


  // RFID init
  SPI.begin(
    /* SCK  = */ 14,
    /* MISO = */ 12,
    /* MOSI = */ 13,
    /* SS   = */ SS_PIN
  );   // Init SPI bus
  mfrc522.PCD_Init();
  Serial.println("RFID ready");

  // Camera init (Ai-Thinker)
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  
  // --- STEP 1: Initialize with high resolution to allocate large buffer ---
  // If you have PSRAM, use high resolution.
  if (psramFound()) {
    config.frame_size = FRAMESIZE_UXGA; // 1600x1200
    config.jpeg_quality = 10;
    config.fb_count = 2; // Use 2 frame buffers for smoother capture
    config.grab_mode = CAMERA_GRAB_LATEST;
  } else {
    // If no PSRAM, you are limited to smaller resolutions
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x\n", err);
    return;
  }
  Serial.println("Camera Initialized Successfully!");

  sensor_t *s = esp_camera_sensor_get();
  if (s == NULL) {
    Serial.println("Failed to get sensor handle");
    return;
  }

  s->set_framesize(s, FRAMESIZE_VGA); 

  // WiFi init
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(200);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  // MQTT init
  mqtt.setServer(MQTT_BROKER, MQTT_PORT);
  mqtt.setCallback(mqttCallback);
  connectMQTT();
  mqtt.subscribe(TOPIC_RFID_TAP_STATUS);
  mqtt.subscribe(TOPIC_VEHICLE_IN_STATUS);
  mqtt.subscribe(TOPIC_VEHICLE_OUT_STATUS);
}

void loop() {
  if (!mqtt.connected()) connectMQTT();
  mqtt.loop();

  if (state == IDLE) {
    if (!mfrc522.PICC_IsNewCardPresent() ||
        !mfrc522.PICC_ReadCardSerial()) {
      return;
    }
    // build UID string
    lastUID = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      if (mfrc522.uid.uidByte[i] < 0x10) lastUID += '0';
      lastUID += String(mfrc522.uid.uidByte[i], HEX);
    }
    lastUID.toUpperCase();
    mfrc522.PICC_HaltA();

    Serial.println(String("Card UID: ") + lastUID);

    // publish tap JSON
    StaticJsonDocument<64> doc;
    doc["uid"] = lastUID;
    char buf[64];
    serializeJson(doc, buf);
    mqtt.publish(TOPIC_RFID_TAP, buf);
    Serial.println(String("-> ") + TOPIC_RFID_TAP + ": " + lastUID);

    state = WAIT_TAP;
  }
}

void connectMQTT() {
  while (!mqtt.connected()) {
    Serial.print("MQTT connect...");
    if (mqtt.connect("esp32cam_client")) {
      Serial.println("ok");
    } else {
      Serial.print("fail, rc=");
      Serial.print(mqtt.state());
      Serial.println(" retry");
      delay(2000);
    }
  }
}

void mqttCallback(char* topic, byte* payload, unsigned int len) {
  StaticJsonDocument<256> doc;
  if (deserializeJson(doc, payload, len) != DeserializationError::Ok) {
    Serial.println("JSON err");
    return;
  }

  // RFID tap-status
  if (strcmp(topic, TOPIC_RFID_TAP_STATUS) == 0 && state == WAIT_TAP) {
    const char* msg = doc["message"] | "";
    if (strcmp(msg, "SUCCESS") != 0) {
      if (strcmp(msg, "ERROR-INVALID-RFID") == 0) {
        publishLCD("Ma RFID sai", "Vui long thu lai");
      } else {
        publishLCD("Loi he thong", "Vui long thu lai");
      }
      publishBuzzer();
      resetState();
      return;
    }
    inOutType = doc["type"].as<String>();
    Serial.println(String("Tap ok, type=") + inOutType);
    publishLCD("Dang xu ly", "");
    state = WAIT_ANPR;

    if (!captureAndRecognize()) {
      resetState();
      return;
    }

    // publish vehicle in/out
    StaticJsonDocument<128> j2;
    j2["rfidUID"]      = lastUID;
    j2["licensePlate"] = licensePlate;
    char buf2[128];
    serializeJson(j2, buf2);
    const char* vt = (inOutType == "IN") ? TOPIC_VEHICLE_IN : TOPIC_VEHICLE_OUT;
    mqtt.publish(vt, buf2);
    Serial.println(String("-> ") + vt + ": " + licensePlate);
    StaticJsonDocument<64> logDoc;
    logDoc["uid"] = lastUID;
    char logBuf[64];
    serializeJson(logDoc, logBuf);
    mqtt.publish(TOPIC_RFID_LOG, logBuf);
    Serial.println(String("Log UID -> ") + TOPIC_RFID_LOG + ": " + lastUID);
    
    state = WAIT_VEHICLE;

  }
  // Vehicle in/out-status
  else if (state == WAIT_VEHICLE &&
           (strcmp(topic, TOPIC_VEHICLE_IN_STATUS) == 0 ||
            strcmp(topic, TOPIC_VEHICLE_OUT_STATUS) == 0)) {
    const char* msg = doc["message"] | "";
    if (strcmp(msg, "SUCCESS") != 0) {
      publishLCD("Loi he thong", "Vui long thu lai");
      publishBuzzer();
    } else {
      publishBuzzer();
      if (inOutType == "IN") {
        publishLCD("Moi xe vao", licensePlate.c_str());
        publishServoOpen();
      } else {
        publishLCD("Moi xe ra", licensePlate.c_str());
        publishServoClose();
      }
      
    }
    resetState();
  }
}

bool captureAndRecognize() {
  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) {
    publishLCD("Loi camera", "Vui long thu lai");
    return false;
  }
  HTTPClient http;
  http.begin(ANPR_URL);
  http.addHeader("Content-Type", "image/jpeg");
  int code = http.POST(fb->buf, fb->len);
  esp_camera_fb_return(fb);
  if (code != 200) {
    publishLCD("Loi nhan dang", "Vui long thu lai");
    http.end();
    return false;
  }
  String resp = http.getString();
  http.end();

  StaticJsonDocument<256> j;
  if (deserializeJson(j, resp) != DeserializationError::Ok) {
    publishLCD("Loi nhan dang", "Vui long thu lai");
    return false;
  }
  auto arr = j["results"].as<JsonArray>();
  if (!arr || arr.size() == 0) {
    publishLCD("Khong thay bien", "Vui long thu lai");
    return false;
  }
  licensePlate = arr[0].as<String>();
  Serial.println(String("Plate: ") + licensePlate);
  return true;
}

void publishLCD(const char* l1, const char* l2) {
  StaticJsonDocument<128> d;
  d["line1"] = l1;
  d["line2"] = l2;
  char b[128];
  serializeJson(d, b);
  mqtt.publish(TOPIC_LCD_SHOW, b);
  Serial.println(String("LCD: ") + l1 + " / " + l2);
}

void publishBuzzer() {
  mqtt.publish(TOPIC_BUZZER_PLAY, "{}");
  Serial.println("Buzzer");
}

void publishServoOpen() {
  mqtt.publish(TOPIC_SERVO_OPEN, "{}");
  Serial.println("Servo open");
}
void publishServoClose() {
  mqtt.publish(TOPIC_SERVO_CLOSE, "{}");
  Serial.println("Servo close");
} 
void resetState() {
  state = IDLE;
  lastUID = "";
  inOutType = "";
  licensePlate = "";
  Serial.println("State: IDLE");
}