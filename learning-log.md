# Node Learning Log

## Шаг 1. Создание проекта

Создала папку:

```bash
node-learning
```

Открыла папку в VS Code.

---

## Шаг 2. Инициализация проекта

Команда:

```bash
npm init
```

Что произошло:

- Создался файл package.json
- package.json хранит настройки проекта

---

## Шаг 3. Установка TypeScript

Команда:

```bash
npm install -D typescript tsx @types/node
```

Что произошло:

- typescript → добавляет TypeScript
- tsx → запускает .ts файлы
- @types/node → типы для Node.js

Появились:

- node_modules
- package-lock.json

---

## Новые слова

### package.json

Паспорт проекта.

### node_modules

Папка со всеми установленными пакетами.

### npm

Менеджер пакетов.

### Node.js

Среда для запуска JavaScript вне браузера.

# Команды которые я уже знаю

## Создать package.json

```bash
npm init
```

## Установить пакет

```bash
npm install название_пакета
```

## Установить пакет только для разработки

```bash
npm install -D название_пакета
```

Отлично! 👍 Уже видно, что ты начинаешь понимать смысл, а не просто копировать команды.

Я бы чуть поправил формулировки:

### Node.js

```text
Node.js = среда выполнения JavaScript вне браузера.
```

Он позволяет создавать:

* серверы
* API
* backend
* работать с файлами
* работать с базой данных

---

### npm

```text
npm = менеджер пакетов.
```

Он умеет:

* устанавливать пакеты
* удалять пакеты
* обновлять пакеты
* запускать scripts из package.json

Примеры:

```bash
npm install express
npm uninstall express
npm run dev
```

---

### npx

Твоё определение уже близко 👍

Я бы записал так:

```text
npx = запускает пакет без необходимости устанавливать его глобально.
```

Примеры:

```bash
npx tsc --init
npx tsx src/index.ts
npx create-vite
```

---

### Самая простая схема

Представь ресторан 🍕

```text
Node.js = кухня

npm = склад продуктов

npx = курьер, который приносит нужный инструмент и сразу его использует
```

### npx tsx
это запуск TypeScript-файлов напрямую, без ручной компиляции.

## Debug 1

// npx tsx src/index.ts

Ошибка:

ENOEXEC

Причина:

Проблема возникла при запуске tsx/esbuild.

Код index.ts ещё не выполнялся.

План:

1. Проверить node -v
2. Проверить npm -v
    rm -rf node_modules
    rm package-lock.json
3. Переустановить node_modules
    npm install
    npm install -D typescript tsx @types/node
4. Проверить tsx
    npx tsx --version

--------------------------------------------------------1
express
=
двигатель сервера
cors
=
охранник, который разрешает frontend говорить с backend
nodemon
=
автоматически перезапускает сервер при изменении файлов
@types/*
=
переводчик для TypeScript

## Scripts

tsc (TypeScript Compiler) — это официальный компилятор, который преобразует код из файлов .ts (TypeScript) в обычный JavaScript

Scripts находятся в package.json.

Позволяют создавать свои команды.

Пример:

npm run dev

вместо:

tsx watch src/index.ts

Основные команды:

Script	          Formål
npm run dev	    Starter udviklingsserver
npm run build	Bygger projektet
npm run start	Starter produktionsversion
npm run seed	Seeder database
npm run test	Kører tests

## Express

Express er et framework til Node.js.

Fordele:

- nem routing
- mindre kode
- nemmere API udvikling

Request:
req

Response:
res

Route:

app.get("/about")

<!-- ///////////////////////////////////// -->

Simple Browser: Show

node-learning/

src/
├── index.ts          ⭐ главный файл
└── routes/
    └── carRoutes.ts  ⭐ маршруты

.env                  ⭐ настройки

package.json          ⭐ команды

prisma/
└── schema.prisma     ⭐ база данных


# Backend Learning Map

node-learning/

src/
├── index.ts
│   ⭐ Главный файл сервера
│   ⭐ Запускает Express
│   ⭐ Подключает routes
│   ⭐ Запускает сервер на порту
│
└── routes/
    └── carRoutes.ts
        ⭐ Маршруты сайта
        ⭐ /cars
        ⭐ /cars/:id
        ⭐ req.params

.env
⭐ Настройки проекта
⭐ PORT=4000
⭐ DATABASE_URL=...

package.json
⭐ Список пакетов
⭐ npm scripts
⭐ npm run dev
⭐ npm run build
⭐ npm run start

tsconfig.json
⭐ Настройки TypeScript
⭐ Говорит TypeScript как собирать проект

prisma/
└── schema.prisma
    ⭐ Чертёж базы данных
    ⭐ Таблицы
    ⭐ Поля
    ⭐ Модели Prisma

prisma.config.ts
⭐ Настройки Prisma
⭐ Prisma читает этот файл сама
⭐ Пока не трогаем

dev.db
⭐ Наша SQLite база данных
⭐ Здесь лежат данные

prisma/
└── migrations/
    ⭐ История изменений базы данных
    ⭐ Создаётся автоматически
    ⭐ Обычно руками не редактируем

node_modules/
⭐ Все установленные пакеты
⭐ Руками не трогаем

package-lock.json
⭐ Версии пакетов
⭐ Создаётся автоматически
⭐ Руками не трогаем


1. удалить старые cars
2. migrate
3. generate
4. seed