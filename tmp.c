#include <ThingSpeak.h>

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

int visits = 0;


const char* ssid = "Rastaswifi";
const char* password = "Rastasdarnatije";
int val = 0;
float mv = 0.0;
float cel = 0.0;
ESP8266WebServer server(80);

const int led = 13;

WiFiClient client;

unsigned long channel_number = 658057;
unsigned channel_field = 1;
const char channel_write_APIKey[] = "4HNZOEGMPY4GOITU";
int counter = 0;

void handleRoot() {
  digitalWrite(led, 1);
  server.send(200, "text/plain", "hello from esp8266!");
  digitalWrite(led, 0);
}

void handleNotFound() {
  digitalWrite(led, 1);
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
  digitalWrite(led, 0);
}

void setup(void) {
  pinMode(led, OUTPUT);
  pinMode(D6,OUTPUT);
  pinMode(D5,INPUT);
  digitalWrite(led, 0);
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  ThingSpeak.begin(client);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }

  server.on("/", handleRoot);

  server.on("/inline", []() {
    server.send(200, "text/plain", "this works as well");
  });
  server.on("/visit", []() {
    ThingSpeak.writeField(659312, 4, ++visits, "PXNWJ7WHL04YMOB7");
    server.send(200, "text/plain", "this works as well");
  });

  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");
}

int akbar = 0;

void loop(void) {
  server.handleClient();
  int val = analogRead(A0);
  mv = ((val/1024.0))*330;
  cel = mv / 10;
  //analogWrite (A0 , HIGH);
  //delay(50);
  //akbar = analogRead(A0);
  //digitalWrite(D6,LOW);
  //delayMicroseconds(2);
  //digitalWrite(D6,HIGH);
  //delayMicroseconds(10);
  //digitalWrite(D6,LOW);
  //const unsigned long duration = pulseIn(D5,HIGH);
  //int distance = duration/29/2;
  //ThingSpeak.writeField(659312 , 3 , distance , "PXNWJ7WHL04YMOB7");
  //ThingSpeak.writeField(659312 , 2 , akbar , "PXNWJ7WHL04YMOB7");
  ThingSpeak.writeField(659312 , 1 , cel , "PXNWJ7WHL04YMOB7");
  Serial.print(cel);
  delay(100);
}
