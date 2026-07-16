# QazaqAdebiet — Қазақ Әдебиеті Порталы

Қазақ әдебиетінің интерактивті энциклопедиясы. Ақындар, жазушылар, жыраулар, би-шешендер туралы толық мәліметтер, шығармалар, өлеңдер, талдаулар, аудиокітаптар және интерактивті тапсырмалар бар толық офлайн платформа.

---

## Технологиялар

| Технология | Нұсқа | Мақсаты |
|-----------|-------|---------|
| React | 19 | UI фреймворк |
| TypeScript | 5 | Типтік қауіпсіздік |
| Vite | 7 | Сборщик |
| Tailwind CSS | 4 | Стильдеу |
| Framer Motion | 11 | Анимация |
| Wouter | 3 | SPA маршруттау |
| idb | — | IndexedDB (PDF кітапхана) |
| pdfjs-dist | 4 | PDF оқу |

---

## Орнату (Installation)

### Алдын ала талаптар
- Node.js **≥ 20**
- pnpm **≥ 9** (`npm i -g pnpm`)

### 1. Репозиторийді клондаңыз
```bash
git clone <repo-url>
cd qazaq-adebiet
```

### 2. Тәуелділіктерді орнатыңыз
```bash
# Барлық монорепо пакеттерін орнату
pnpm install
```

### 3. Ортаны конфигурациялаңыз
```bash
# artifacts/qazaq-adebiet/.env файлын жасаңыз
cp artifacts/qazaq-adebiet/.env.example artifacts/qazaq-adebiet/.env
```

`.env` файлы:
```env
PORT=5173
BASE_PATH=/
```

---

## Іске қосу (Development)

```bash
# Тек webapp-ты іске қосу
pnpm --filter @workspace/qazaq-adebiet run dev

# Немесе монорепо тамырынан
cd artifacts/qazaq-adebiet
PORT=5173 BASE_PATH=/ pnpm run dev
```

Браузерде ашыңыз: **http://localhost:5173**

---

## Production build

```bash
# Тамырдан
pnpm --filter @workspace/qazaq-adebiet run build

# Немесе
cd artifacts/qazaq-adebiet
pnpm run build
```

Шығыс: `artifacts/qazaq-adebiet/dist/public/`

### Build нәтижесін жергілікті тексеру
```bash
cd artifacts/qazaq-adebiet
pnpm run preview
# http://localhost:4173
```

---

## TypeScript тексерімі
```bash
cd artifacts/qazaq-adebiet
pnpm exec tsc --noEmit
```

---

## Жоба құрылымы

```
artifacts/qazaq-adebiet/
├── public/                # Статикалық файлдар (pdf.worker.min.mjs, т.б.)
├── src/
│   ├── components/        # UI компоненттер
│   │   ├── analysis/      # Талдау бөлімі компоненттері
│   │   ├── digital-reader/# Цифрлы кітап оқушы
│   │   ├── home/          # Басты бет секциялары
│   │   ├── interactive/   # Интерактивті тапсырмалар
│   │   ├── poets/         # Ақындар бөлімі
│   │   ├── reader/        # PDF оқушы
│   │   ├── writers/       # Жазушылар бөлімі
│   │   └── ui/            # Ортақ UI компоненттер (Button, Dialog, т.б.)
│   ├── data/              # JSON деректер файлдары
│   │   ├── poets.json     # Ақындар (өлеңдер, поэмалар, аудармалар)
│   │   ├── writers.json   # Жазушылар
│   │   ├── books.json     # Кітаптар (толық мәтін)
│   │   ├── tasks.json     # Интерактивті тапсырмалар
│   │   └── analysis.json  # Шығарма талдаулары
│   ├── hooks/             # Custom React хуктары
│   ├── pages/             # Бет компоненттері (маршрут бойынша)
│   ├── types/             # TypeScript типтер
│   ├── App.tsx            # Маршруттар
│   └── main.tsx           # Қосымша кіру нүктесі
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Модульдер

| URL | Бет | Сипаттама |
|-----|-----|-----------|
| `/` | Басты бет | Hero, статистика, категориялар |
| `/poets` | Ақындар | Іздеу, фильтр, карточкалар |
| `/poets/:slug` | Ақын беті | Өмірбаяны, өлеңдер, поэмалар, аудармалар, 13 tab |
| `/writers` | Жазушылар | Magazine-стиль карточкалар, фильтр |
| `/writers/:slug` | Жазушы беті | 22 tab: отбасы, білімі, карьера, галерея, т.б. |
| `/zhyrau` | Жыраулар | Жыраулар тізімі |
| `/zhyrau/:slug` | Жырау беті | Толық мәліметтер |
| `/bi-sheshender` | Би-шешендер | Тізім |
| `/bi-sheshender/:slug` | Би-шешен беті | Толық мәліметтер |
| `/reader` | Кітапхана | PDF жүктеу + IndexedDB кітапхана |
| `/reader/:slug` | Цифрлы оқушы | 8 tab (толық мәтін, PDF, аудио, т.б.) |
| `/reader/pdf/:slug` | PDF оқушы | Кәсіби PDF оқушы (зум, іздеу, бетбелгі) |
| `/analysis/:slug` | Талдау | 15+ компоненттен тұратын толық талдау |
| `/interactive` | Интерактив | 30 тапсырма типі, XP жүйесі, жетістіктер |
| `/authors/:cat/:slug` | Автор | Универсал автор беті |
| `/works/:slug` | Шығарма | Шығарма мәліметтері |

---

## Деректерді қосу / жаңарту

Барлық деректер `src/data/*.json` файлдарында. API жоқ — толық офлайн.

### Жаңа ақын қосу
`src/data/poets.json` массивіне жаңа объект қосыңыз:
```json
{
  "id": 100,
  "slug": "менін-ақын",
  "fullName": "Менің Ақынның Аты",
  "shortName": "Қысқа Аты",
  "birthDate": "1850-01-01",
  ...
  "poems": [...],
  "quotes": [...]
}
```

### Жаңа жазушы қосу
`src/data/writers.json` массивіне қосыңыз — барлық өрістер `?` (міндетті емес) деп белгіленген.

### Интерактивті тапсырма қосу
`src/data/tasks.json` массивіне қосыңыз немесе `/interactive` → «Мұғалім» режимін пайдаланыңыз (JSON импорт/экспорт).

---

## Мобильдік қолдау

- Барлық беттер responsive: mobile (≥320px) · tablet (≥768px) · desktop (≥1024px)
- PDF оқушы — мобильде толық жұмыс жасайды
- Touch swipe — галерея lightbox-та

---

## Лицензия

Білім мақсатында ашық пайдаланылуы мүмкін — Қазақстан мектептері мен университеттері үшін.
