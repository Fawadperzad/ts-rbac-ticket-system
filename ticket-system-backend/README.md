# 🎫 RBAC Ticket-System (TypeScript)

Ein leichtgewichtiges, objektorientiertes Ticket-System in TypeScript, das eine strikte rollenbasierte Zugriffskontrolle (**Role-Based Access Control - RBAC**) sowie ein lückenloses Audit-Logging implementiert.

## 👥 Rollen- und Rechtematrix

Das System unterscheidet strikt zwischen drei Rollen:

| Funktion / Berechtigung              | 👤 USER | 🛠️ AGENT | 👑 ADMIN |
| :----------------------------------- | :-----: | :------: | :------: |
| Ticket erstellen / Eigene sehen      |   ✅    |    ✅    |    ✅    |
| Alle Tickets sehen / Status ändern   |   ❌    |    ✅    |    ✅    |
| Kommentare schreiben                 |   ❌    |    ✅    |    ✅    |
| Benutzer & Rollen verwalten          |   ❌    |    ❌    |    ✅    |
| Audit Logs & Einstellungen verwalten |   ❌    |    ❌    |    ✅    |

## 🛠️ Tech Stack & Features

- **Sprache:** TypeScript (ESNext, NodeNext Module)
- **Runtime:** Node.js
- **Architektur:** Datenkapselung mit strikter Typsicherheit (`verbatimModuleSyntax`)
- **Sicherheit:** Zentrale Validierungskomponente zur Absicherung unbefugter Statusänderungen oder administrativen Zugriffen.

## 🚀 Installation & Start

### 1. Abhängigkeiten installieren

```bash
npm install
```
