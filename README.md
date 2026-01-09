# 📟 GHCIF Terminal // Web-Based Linux Emulator

Ein voll interaktives, web-basiertes Terminal, das als Portfolio-Website oder Landingpage dient. Es simuliert eine Linux-Shell (ZSH/Bash) mit authentischem Look & Feel, User-Management, Easter Eggs und simulierten Hacking-Tools.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## ✨ Features

* **Authentisches Feeling:** Boot-Sequenz, blinkender Cursor, History-Navigation (Pfeiltasten) und Tab-Completion.
* **User System:** Wechsel zwischen `guest` (Grün) und `root/t4c` (Rot) inkl. Passwort-Prompt.
* **Simulierte Tools:**
    * `nmap`: Führt "echte" Scans mit Wartezeiten durch.
    * `gcc`: Simuliert Kompilierung von C-Code.
    * `python`: Simuliert das Ausführen von Skripten (z.B. CV-Generierung).
    * `rm -rf /`: Trollt den User mit Panik-Effekt.
    * `lynx`: Simuliert einen Text-Browser und leitet weiter.
* **Logging:** Speichert unbekannte Befehle anonym in einem Logfile (PHP-Backend), um das System zu verbessern.
* **Responsive:** Passt sich (bedingt) an Browsergrößen an.

## 📂 Installation

Das Projekt benötigt lediglich einen Webserver mit **PHP-Support** (für das Logging).

1.  **Dateien hochladen:**
    Lade die Struktur auf deinen Webspace:
    ```text
    / (root)
    ├── index.html
    ├── terminal.js
    ├── logger.php
    ├── web_history.log (wird automatisch erstellt)
    ├── .htaccess
    └── css/
        └── terminal.css
    ```

2.  **Berechtigungen setzen (Wichtig!):**
    Damit das Logging funktioniert, muss der Webserver in die Logdatei schreiben dürfen.
    ```bash
    touch web_history.log
    chmod 666 web_history.log
    ```

3.  **Sicherheit prüfen:**
    Stelle sicher, dass die `.htaccess` Datei vorhanden ist, damit niemand dein Logfile (`web_history.log`) öffentlich auslesen kann.

## 🚀 Nutzung & Befehle

### Standard-Befehle (Guest)
* `help`: Zeigt verfügbare Befehle.
* `ls`: Listet Dateien (Dateien sind anklickbar oder per `cat` lesbar).
* `cat [file]`: Zeigt Dateiinhalte an.
* `whoami`: Zeigt aktuellen User.
* `nmap [ip]`: Simuliert einen Portscan.
* `lynx [url]`: Simuliert Verbindung und leitet weiter.

### Root-Zugriff (Spoiler)
Um Zugriff auf versteckte Dateien (`exploit.c`, `cv_modern.py`) zu erhalten:
1.  Befehl: `su t4c`
2.  Passwort: `fnord`
3.  Der Prompt wird **ROT**.

### Root-Only Befehle
* `gcc -o exploit exploit.c`: Kompiliert den Exploit.
* `./exploit`: Führt den Payload aus.
* `python cv_modern.py`: Generiert den Lebenslauf.

## ⚙️ Anpassung

Die gesamte Logik befindet sich in `terminal.js`.

* **Dateisystem ändern:** Bearbeite das `fs` Objekt in `terminal.js`.
* **Fake-History ändern:** Bearbeite die Arrays `guestFakeHist` und `t4cFakeHist`.
* **Easter Eggs:** Suche nach der `rm` Funktion in `cmds`, um die Troll-Nachricht anzupassen.

## 🛡️ Datenschutz (Logging)

Das System loggt Befehle, die **nicht gefunden** wurden, um zu sehen, was Besucher ausprobieren.
* **IP-Adressen:** Werden **nicht** gespeichert.
* **Rechtliches:** In der `legal.txt` wird auf das anonyme Logging hingewiesen.

## 📝 Lizenz

Open Source. Mach damit, was Du willst.
