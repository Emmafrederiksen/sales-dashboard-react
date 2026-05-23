# Insight Dashboard – React SSR/CSR

Et analytisk salgsdashboard bygget med React, Express og Node.js, der demonstrerer implementeringen af Server-Side Rendering (SSR) og Client-Side Rendering (CSR) i en ren React applikation uden et framework.

Dette projekt er udviklet som en del af specialiseringssynopsen på PBA Web Development, 6. semester, Zealand – Sjællands Erhvervsakademi (2026).

---

## Om projektet

Dashboardet visualiserer salgsdata for en fiktiv tøjwebshop og demonstrerer hvordan SSR og CSR kan implementeres manuelt i React, i modsætning til Next.js der håndterer det automatisk.

Projektet er én af to prototyper der sammenlignes i synopsen:

- **Denne prototype** – React med Express SSR og Vite CSR
- **Next.js prototype** – Next.js App Router med Server og Client Components

---

## Teknologier

| Teknologi | Version | Formål |
|---|---|---|
| React | 19.x | UI bibliotek |
| Node.js | 18+ | JavaScript runtime til server |
| Express | 5.x | SSR server og API |
| Vite | 8.x | Client bundler og dev server |
| TypeScript | 6.x | Statisk typning |
| Tailwind CSS | 3.x | Styling |
| Supabase | Latest | PostgreSQL database og API |
| Recharts | Latest | Datavisualisering |

---

## Arkitektur – SSR og CSR

### SSR – Server Side Rendering
Express serveren renderer React til HTML på serveren ved første load:

```
Browser request → Express server (Node.js)
                        ↓
                Supabase datahentning
                        ↓
           renderToString(<AppSSR />)
                        ↓
    HTML + window.__INITIAL_DATA__ sendes til browser
                        ↓
       React hydrerer siden med hydrateRoot
```

### CSR – Client Side Rendering
Efter hydration overtager React interaktiviteten i browseren:

```
Bruger klikker filter
        ↓
useEffect kører i browseren
        ↓
fetch('/api/kpis?period=week')
        ↓
KPI kort opdateres
```

### window.__INITIAL_DATA__
For at undgå hydration mismatch sender serveren SSR data med til browseren via et script tag:

```tsx
// server.tsx – data injekteres i HTML
<script>
  window.__INITIAL_DATA__ = { orders, kpiData, categories, revenueData }
</script>

// main.tsx – browseren læser data ved hydration
const initialData = window.__INITIAL_DATA__ || {}
hydrateRoot(root, <App orders={initialData.orders} ... />)
```

Dette sikrer at React bruger de samme data til hydration som serveren brugte til SSR.

---

## Projektstruktur

```
sales-dashboard-react/
├── server/
│   ├── lib/
│   │   └── supabase.ts        – Supabase klient med service nøgle
│   ├── routes/
│   │   ├── categories.ts      – GET /api/categories
│   │   ├── kpis.ts            – GET /api/kpis?period=
│   │   ├── orders.ts          – GET /api/orders
│   │   └── revenue.ts         – GET /api/revenue
│   ├── services/
│   │   ├── categoryService.ts
│   │   ├── kpiService.ts
│   │   ├── orderService.ts
│   │   └── revenueService.ts
│   ├── types/
│   │   ├── category.ts
│   │   ├── kpi.ts
│   │   ├── order.ts
│   │   ├── period.ts
│   │   └── revenue.ts
│   └── server.tsx             – Express server med SSR
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── client/        – CSR komponenter
│   │   │   │   ├── FilterBar.tsx
│   │   │   │   ├── OrdersSearch.tsx
│   │   │   │   └── RevenueChart.tsx
│   │   │   └── server/        – SSR komponenter
│   │   │       ├── CategoryList.tsx
│   │   │       ├── KPICards.tsx
│   │   │       └── OrdersTable.tsx
│   │   └── layout/
│   │       ├── client/
│   │       │   └── MobileHeader.tsx
│   │       └── server/
│   │           ├── NavItem.tsx
│   │           └── Sidebar.tsx
│   ├── lib/
│   │   └── supabase.ts        – Client Supabase klient
│   ├── App.tsx                – Hovedapp komponent
│   ├── AppSSR.tsx             – SSR wrapper der sender props til App
│   ├── main.tsx               – Browser entry med hydrateRoot
│   └── index.css
├── index.html                 – Vite entry point
├── tailwind.config.js
├── tsconfig.json              – Client TypeScript konfiguration
├── tsconfig.server.json       – Server TypeScript konfiguration
└── vite.config.ts
```

---

## Komponent opdeling

### Server komponenter (data fra Express via props)
| Komponent | Beskrivelse |
|---|---|
| `KPICards` | Viser KPI data modtaget som props fra serveren |
| `CategoryList` | Viser kategori data modtaget som props |
| `OrdersTable` | Modtager ordrer som props og renderer OrdersSearch |
| `Sidebar` | Statisk navigation uden hooks |
| `NavItem` | Statisk navigationselement uden hooks |

### Client komponenter (interaktive)
| Komponent | Beskrivelse |
|---|---|
| `FilterBar` | Periodefilter med useState |
| `OrdersSearch` | Søgefunktion med useState |
| `RevenueChart` | Recharts graf der kræver browseren |
| `MobileHeader` | Hamburger menu med useState |

---

## Sikkerhed

Supabase service nøglen bruges kun på serveren og eksponeres aldrig i browseren:

| Nøgle | Bruges af | Synlig i browser |
|---|---|---|
| `SUPABASE_SERVICE_KEY` | Express server | Nej |
| `VITE_SUPABASE_ANON_KEY` | Client (browser) | Ja |

---

## Kom i gang

### Forudsætninger

- Node.js 18+
- En Supabase konto og projekt

### Installation

1. Klon repositoriet:
```bash
git clone https://github.com/dit-brugernavn/sales-dashboard-react.git
cd sales-dashboard-react
```

2. Installer dependencies:
```bash
npm install
```

3. Opret `.env` fil i roden:
```
VITE_SUPABASE_URL=din-supabase-url
VITE_SUPABASE_ANON_KEY=din-anon-nøgle
SUPABASE_SERVICE_KEY=din-service-role-nøgle
```

4. Byg client koden:
```bash
npm run build:client
```

5. Start SSR serveren:
```bash
npm run dev:server
```

6. Åbn browseren på `http://localhost:3000`

---

## Scripts

| Script | Beskrivelse |
|---|---|
| `npm run dev:server` | Start Express SSR server |
| `npm run dev:client` | Start Vite dev server (kun CSR) |
| `npm run build:client` | Byg client kode til dist/client |

---

## Kompleksitet vs Next.js

Dette projekt demonstrerer hvad der kræves for at implementere SSR manuelt i React sammenlignet med Next.js:

**Hvad vi selv skal håndtere i React:**
- Node.js og Express server opsætning
- renderToString konfiguration
- hydrateRoot i browseren
- window.__INITIAL_DATA__ til at sende SSR data til client
- Separate TypeScript konfigurationer for server og client
- Manuel build process før server kan startes

**Hvad Next.js gør automatisk:**
- SSR via Server Components
- CSR via Client Components med "use client"
- Automatisk hydration uden mismatch
- Én samlet build og dev process

---

## Udviklet af

Emma Frederiksen  
PBA Web Development, 6. semester  
Zealand – Sjællands Erhvervsakademi  
Forår 2026