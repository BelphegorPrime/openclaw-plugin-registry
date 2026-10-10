# OpenClaw Plugin Template 🦊

Dies ist eine Vorlage zum Erstellen von Plugins für [OpenClaw](https://openclaw.ai).

## 📦 Repository-Inhalt

- `src/plugin.js` - Beispiel-Plugin-Code
- `LICENSE` - Apache 2.0 Lizenz
- `README.md` - Diese Datei

## 🚀 Wie man ein Plugin aus diesem Repository erstellt

### 1. Repository klonen

```bash
git clone https://github.com/BelphegorPrime/openclaw-plugin-template.git
cd openclaw-plugin-template
```

### 2. Plugin anpassen

Bearbeite `src/plugin.js` mit deinem eigenen Code:

```javascript
const PLUGIN_NAME = "mein-plugin";
const PLUGIN_VERSION = "1.0.0";

function setup() {
  console.log(`🚀 ${PLUGIN_NAME} v${PLUGIN_VERSION} initialized`);
}

function meineFunktion() {
  // Deine Logik hier
}

module.exports = {
  setup,
  meineFunktion
};
```

### 3. Plugin-Dateimetadaten aktualisieren

- `package.json` (optional) - Für npm-Installation
- Plugin-Kommentare mit deinen Details aktualisieren

## 🔧 Wie man Plugins in OpenClaw installiert

### Methode 1: Direkt aus lokalem Ordner

```bash
# In der OpenClaw Konfiguration Plugin-Verzeichnis hinzufügen
openclaw configure plugins add /pfad/zum/plugin/

# Oder Plugin als Modul installieren
openclaw plugins install .
```

### Methode 2: Über ClawHub

1. **Plugin vorbereiten:**
   - Plugin-Code in `src/`
   - `package.json` erstellen (optional)
   - `README.md` mit Usage-Beispielen
   - Tests schreiben

2. **Plugin veröffentlichen:**
   ```bash
   # Zu ClawHub hinzufügen
   openclaw plugins publish
   ```

3. **Installation:**
   ```bash
   openclaw plugins install mein-plugin
   ```

### Methode 3: Aus GitHub Repository

```bash
# Plugin aus GitHub Repository installieren
openclaw plugins install git+https://github.com/BelphegorPrime/openclaw-plugin-template.git
```

### Methode 4: Direkte Datei-Installation

```bash
# Plugin-Datei in OpenClaw Plugin-Verzeichnis kopieren
cp src/plugin.js ~/.openclaw/plugins/

# Plugin aktivieren
openclaw plugins enable plugin.js
```

## 📋 Plugin-Struktur (empfohlen)

```
mein-plugin/
├── src/
│   ├── plugin.js          # Hauptplugin-Code
│   └── tests/             # Tests
│       └── plugin.test.js
├── README.md              # Plugin-Dokumentation
├── LICENSE                # Lizenz (Apache-2.0 empfohlen)
├── .gitignore             # Git-Ausschlüsse
└── package.json           # (Optional) npm Metadaten
```

## ✅ Plugin-Entwicklungs-Checkliste

- [ ] Plugin-Code geschrieben
- [ ] Tests implementiert
- [ ] README.md mit Usage-Beispielen
- [ ] Lizenzdatei vorhanden
- [ ] .gitignore konfiguriert
- [ ] Plugin in OpenClaw getestet
- [ ] Versionsnummer aktualisiert
- [ ] CHANGELOG erstellt (optional)

## 🐛 Fehlerbehebung

### "Plugin nicht gefunden"
- Stelle sicher, dass der Plugin-Pfad korrekt ist
- Überprüfe, ob die Plugin-Datei existiert
- Prüfe die Dateiberechtigungen

### "Plugin kann nicht geladen werden"
- Überprüfe den Syntax in der Plugin-Datei
- Stelle sicher, dass `module.exports` korrekt ist
- Prüfe die OpenClaw Logs für Fehlerdetails

## 📚 Weitere Ressourcen

- [OpenClaw Dokumentation](https://docs.openclaw.ai)
- [ClawHub](https://clawhub.ai) - Plugin Marketplace
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)

## 🤝 Beiträge willkommen!

Pull Requests sind willkommen! Bitte:
1. Fork das Repository
2. Feature-Branch erstellen
3. Changes committen
4. Branch pushen
5. Pull Request öffnen

---

**Lizenz:** Apache 2.0 - Siehe [LICENSE](LICENSE) Datei

**Erstellt mit ❤️ für die OpenClaw Community**
