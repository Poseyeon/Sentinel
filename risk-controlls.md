# Risks & Controls - API Integration Guide for Frontend

Dieses Dokument beschreibt detailliert, wie die neuen Risks- und Controls-Endpunkte aufgerufen werden sollten. Das System nutzt ein hybrides Modell (MySQL + MongoDB).

---

## 1. Risiken (Risks)

### REST API (`/api/risks`)

#### A. Risiko erstellen
- **URL:** `POST /api/risks`
- **Payload:**
```json
{
  "username": "A.MIN",        // Das Kürzel des Erstellers
  "companyId": 1,             // ID der Firma
  "title": "Datenverlust",
  "category": "cybersecurity",
  "impact": "high",
  "likelihood": "medium",
  "status": "identified",
  "description": "Potenzieller Datenverlust durch..."
}
```

#### B. Alle Risiken einer Firma abrufen
- **URL:** `GET /api/risks?compId=1`

#### C. Einzelnes Risiko abrufen
- **URL:** `GET /api/risks/:risk_id`

#### D. Analytics: Risiken nach Kategorie
- **URL:** `GET /api/risks/analytics/by-category?companyId=1`

---

### GraphQL API (Port 4000)

#### Query: Alle Risiken abrufen
```graphql
query GetRisks($compId: Int!) {
  risks(comp_id: $compId) {
    risk_id
    mysql {
      last_upd
      user_cr_id
    }
    mongo {
      title
      impact
      likelihood
      status
      category
    }
  }
}
```

#### Mutation: Risiko aktualisieren
```graphql
mutation UpdateRisk($id: ID!, $input: UpdateRiskInput!) {
  updateRisk(risk_id: $id, input: $input) {
    success
    message
  }
}

// Variables:
{
  "id": "1",
  "input": {
    "status": "mitigated",
    "treatment": "mitigate"
  }
}
```

---

## 2. Kontrollen (Controls)

### REST API (`/api/controls`)

#### A. Kontrolle erstellen
- **URL:** `POST /api/controls`
- **Payload:**
```json
{
  "username": "A.MIN",
  "companyId": 1,
  "name": "Firewall Konfiguration",
  "category": "technical",
  "status": "implemented",
  "description": "Überwachung des Traffics..."
}
```

#### B. Alle Kontrollen abrufen
- **URL:** `GET /api/controls?compId=1`

#### C. Analytics: Kontrollen nach Kategorie
- **URL:** `GET /api/controls/analytics/by-category?companyId=1`

---

### GraphQL API (Port 4000)

#### Query: Controls Analytics (Status)
```graphql
query {
  controlsByStatus(companyId: 1) {
    key
    count
  }
}
```

#### Mutation: Kontrolle löschen
```graphql
mutation {
  deleteControl(control_id: "5") {
    success
    message
  }
}
```

---

## 3. Wichtige Hinweise für die UI

1.  **Enums:** Die Datenbank erzwingt strikte Werte (Enums). Achtet darauf, im Frontend Dropdowns mit genau diesen Werten zu verwenden:
    *   **Risk Impact:** `low`, `medium`, `high`, `critical`
    *   **Risk Likelihood:** `low`, `medium`, `high`, `very high`
    *   **Risk Status:** `identified`, `assessed`, `mitigated`, `accepted`, `closed`
    *   **Control Status:** `planned`, `implemented`, `testing`, `effective`, `ineffective`, `retired`
2.  **Caching:** Denkt daran, dass die Analytics-Daten für ca. 5 Minuten in Redis zwischengespeichert werden. Wenn ihr ein neues Risiko anlegt, wird der Cache für diese Firma automatisch gelöscht (Invalidierung), sodass die neuen Zahlen sofort sichtbar sind.
3.  **Fehlerbehandlung:** Wenn ein Risiko/Kontrolle nicht gefunden wird, liefert die API einen `404 Not Found`. Bei Validierungsfehlern (z.B. fehlende Pflichtfelder) kommt ein `400 Bad Request`.
