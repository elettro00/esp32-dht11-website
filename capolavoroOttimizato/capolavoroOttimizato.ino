#include <Arduino.h>                    // Libreria base di Arduino
#include <WiFi.h>                       // Libreria per connessione Wi-Fi
#include <Firebase_ESP_Client.h>        // Libreria per connessione a Firebase
#include <DHT.h>                        // Libreria per interazione con sensore DHT
#include <time.h>                       // Libreria per gestione del tempo

// Fornisce informazioni sul processo di generazione del token.
#include "addons/TokenHelper.h"
// Fornisce informazioni di stampa del payload RTDB e altre funzioni di supporto.
#include "addons/RTDBHelper.h"

// Inserisci le credenziali della rete Wi-Fi
#define WIFI_SSID "" //YOUR SSID                     // Nome della rete Wi-Fi
#define WIFI_PASSWORD "" //YOUR PASSWORD             // Password della rete Wi-Fi

#define USER_EMAIL ""  //YOUR EMAIL             // Email utente Firebase
#define USER_PASSWORD ""  //YOUR PASSWORD       // Password utente Firebase

// Inserisci l'API Key del progetto Firebase
#define API_KEY "" //YOUR FIREBASE API KEY

// Inserisci l'URL del database RTDB
#define DATABASE_URL "" //YOUR DATABASE LINK

// Pin e tipo di sensore DHT
#define DHTPIN 15                            // Pin del sensore DHT11
#define DHTTYPE DHT11                        // Tipo di sensore DHT

DHT dht(DHTPIN, DHTTYPE);                    // Inizializzazione del sensore DHT

const char* ntpServer = "0.it.pool.ntp.org"; // Server NTP per sincronizzazione dell'ora
const long gmtOffset_sec = 0;                // Offset GMT in secondi
const int daylightOffset_sec = 7200;         // Offset ora legale in secondi
char buffer[60];                             // Buffer per formattare la data e l'ora
int counter = 0;                             // Contatore per le letture dei dati

struct tm timeinfo;                          // Struttura per memorizzare informazioni temporali

FirebaseData fbdo;                           // Oggetto per interazioni con Firebase
FirebaseAuth auth;                           // Oggetto per autenticazione Firebase
FirebaseConfig config;                       // Oggetto per configurazione Firebase
unsigned long sendDataPrevMillis = 0;        // Timer per invio dati
bool signupOK = false;                       // Flag per verificare il successo della registrazione

String uid;                                  // User ID dell'utente Firebase

void setup() {
  Serial.begin(115200);                        // Inizializzazione della comunicazione seriale
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);        // Connessione alla rete Wi-Fi
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {      // Attesa fino alla connessione
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());              // Stampa l'IP locale del dispositivo
  Serial.println();

  config.api_key = API_KEY;                    // Configura l'API Key di Firebase
  config.database_url = DATABASE_URL;          // Configura l'URL del database Firebase

  // Autenticazione utente
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  Firebase.reconnectWiFi(true);                // Riconnessione automatica al Wi-Fi
  fbdo.setResponseSize(4096);                  // Imposta la dimensione massima della risposta

  // Assegna la funzione di callback per il task di generazione del token
  config.token_status_callback = tokenStatusCallback; // vedi addons/TokenHelper.h

  // Assegna il numero massimo di tentativi di generazione del token
  config.max_token_generation_retry = 5;

  // Inizializza la libreria con autenticazione e configurazione Firebase
  Firebase.begin(&config, &auth);

  // Ottenimento UID dell'utente, potrebbe richiedere alcuni secondi
  Serial.println("Getting User UID");
  while ((auth.token.uid) == "") {
    Serial.print('.');
    delay(1000);
  }
  // Stampa l'UID dell'utente
  uid = auth.token.uid.c_str();
  Serial.print("User UID: ");
  Serial.print(uid);

  dht.begin();                                 // Inizializzazione del sensore DHT
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer); // Configura il server NTP
  readLocalTime();                             // Legge l'ora locale
  Serial.println(buffer);

  // Recupera il valore del contatore dal database
  if (Firebase.RTDB.getInt(&fbdo, "/dht11/counter")) {
    if (fbdo.dataType() == "int") {
      counter = fbdo.intData();
      Serial.print("Counter value from database: ");
      Serial.println(counter);
    }
  } else {
    Serial.printf("Failed to get counter value: %s\n", fbdo.errorReason().c_str());
  }
}

void loop() {
  if (Firebase.isTokenExpired()){              // Verifica se il token è scaduto
    Firebase.refreshToken(&config);             // Rinfresca il token se scaduto
    Serial.println("Refresh token");
  }

  float humidity = dht.readHumidity();          // Legge l'umidità dal sensore DHT
  float temperatureC = dht.readTemperature();   // Legge la temperatura in Celsius dal sensore
  float temperatureF = dht.readTemperature(true); // Legge la temperatura in Fahrenheit

  if (isnan(humidity) || isnan(temperatureC) || isnan(temperatureF)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  float heatIndexC = dht.computeHeatIndex(temperatureC, humidity, false); // Calcola l'indice di calore in Celsius
  float heatIndexF = dht.computeHeatIndex(temperatureF, humidity); // Calcola l'indice di calore in Fahrenheit

  readLocalTime(); // Legge l'ora locale

  if (Firebase.ready() && (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis(); // Aggiorna il timer

    String basePath = "dht11/" + String(counter); // Path base per i dati nel database

    FirebaseJson json;
    json.set("/temperature/Celsius", temperatureC);
    json.set("/temperature/Fahrenheit", temperatureF);
    json.set("/Humidity", humidity);
    json.set("/HeatIndex/Celsius", heatIndexC);
    json.set("/HeatIndex/Fahrenheit", heatIndexF);
    json.set("/date", buffer); // Aggiunge i dati al JSON

    if (Firebase.RTDB.updateNode(&fbdo, basePath, &json)) { // Invia i dati a Firebase
      Serial.println("Data sent successfully");
      counter++;
      Firebase.RTDB.setInt(&fbdo, "/dht11/counter", counter); // Aggiorna il contatore nel database
    } else {
      Serial.println("Failed to send data");
    }
  }

  delay(500); // Ritardo per evitare invii troppo frequenti
}

void readLocalTime() {
  if (!getLocalTime(&timeinfo)) {               // Verifica se l'ora locale è ottenuta con successo
    Serial.println("Failed to obtain time");
    return;
  }
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo); // Format dell'ora locale
}
