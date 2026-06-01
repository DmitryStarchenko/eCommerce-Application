<div align="center">

# 🚗 eCommerce Application

### _Интерактивная платформа для продажи автомобилей_

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![NestJS](https://img.shields.io/badge/NestJS-11-EA2845?logo=nestjs&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=for-the-badge)
![Material UI](https://img.shields.io/badge/MUI-7-007FFF?logo=mui&logoColor=white&style=for-the-badge)

**[Репозиторий](https://github.com/DmitryStarchenko/eCommerce-Application)**

</div>

---

## 📋 О проекте

Финальный проект курса **JavaScript/Front-end 2024Q4** от [RS School](https://rs.school/).
Полноценная платформа электронной коммерции с каталогом автомобилей, корзиной, поиском, фильтрацией и личным кабинетом.

В 2026 году переработана для полноценной работы без eCommerceTools, на **React + NestJS** с собственным in-memory API-сервером с помощью ИИ.

### 🎯 Цели проекта

| Цель                    | Описание                                                              |
| :---------------------- | :-------------------------------------------------------------------- |
| **🛠 Реальный опыт**    | Работа в условиях, максимально приближённых к промышленной разработке |
| **🤝 Командная работа** | Научиться решать спорные вопросы внутри команды                       |
| **🚀 Готовый продукт**  | Создать полнофункциональное приложение, готовое к использованию       |

---

## ✨ Возможности

| Функция                   | Описание                                                        |
| :------------------------ | :-------------------------------------------------------------- |
| 🔐 **Авторизация**        | Регистрация, вход, анонимный доступ, смена пароля               |
| 🚗 **Каталог**            | 18 автомобилей с пагинацией, фильтрацией, сортировкой и поиском |
| 🔍 **Поиск**              | Fuzzy-поиск по названию и описанию                              |
| 🏷️ **Категории**          | Sedan, Pickup, Bus                                              |
| 📄 **Детальная страница** | Полная информация о товаре с изображениями                      |
| 🛒 **Корзина**            | Добавление/удаление товаров, изменение количества, промокоды    |
| 🎫 **Промокоды**          | Промокод со скидкой 7%                                          |
| 👤 **Профиль**            | Личный кабинет с редактированием данных и сменой пароля         |
| 🎨 **Material UI**        | Современный адаптивный интерфейс                                |

---

## 🏗️ Архитектура

```
┌──────────────────────────────────────────────────┐
│                   Frontend                       │
│          React 19 + Vite + TypeScript            │
│                                                  │
│   ┌─────────┐ ┌──────────┐ ┌────────────────┐    │
│   │  Pages  │ │ Widgets  │ │ Shared (API/UI)│    │
│   └────┬────┘ └────┬─────┘ └───────┬────────┘    │
│        └───────────┴───────────────┘             │
│                      │ HTTP (REST)               │
├──────────────────────┴───────────────────────────┤
│                   Backend                        │
│               NestJS 11 + TypeScript             │
│                                                  │
│   ┌──────────┐ ┌──────────┐ ┌────────────────┐   │
│   │   Auth   │ │ Products │ │    Carts       │   │
│   └──────────┘ └──────────┘ └────────────────┘   │
│   ┌──────────┐ ┌──────────┐ ┌────────────────┐   │
│   │  Users   │ │Category  │ │ In-Memory DB   │   │
│   └──────────┘ └──────────┘ └────────────────┘   │
└──────────────────────────────────────────────────┘
```

---

## 🚀 Быстрый старт

### Требования

- **Node.js** v22.15.0+
- **npm** v10+

### Установка и запуск

```bash
# 1. Клонировать репозиторий
git clone https://github.com/DmitryStarchenko/eCommerce-Application.git
cd eCommerce-Application

# 2. Установить зависимости фронтенда
npm run init

# 3. Установить зависимости сервера
cd server && npm install && cd ..

# 4. Запустить сервер (в отдельном терминале)
cd server && npm run start:dev
# Сервер доступен на http://localhost:3000/api

# 5. Запустить фронтенд (в другом терминале)
npm run dev
# Фронтенд доступен на http://localhost:5173
```

---

## 🛠️ Стек технологий

### Frontend

| Технология                                      | Версия | Назначение    |
| :---------------------------------------------- | :----: | :------------ |
| [React](https://react.dev/)                     | 19.0.0 | UI библиотека |
| [TypeScript](https://www.typescriptlang.org/)   |  5.7   | Типизация     |
| [Vite](https://vite.dev/)                       |  6.3   | Сборщик       |
| [Material UI](https://mui.com/)                 |  7.1   | Компоненты    |
| [React Router](https://reactrouter.com/)        |  7.6   | Роутинг       |
| [React Hook Form](https://react-hook-form.com/) |  7.56  | Формы         |
| [Yup](https://github.com/jquense/yup)           |  1.6   | Валидация     |
| [Swiper](https://swiperjs.com/)                 |  11.2  | Слайдеры      |

### Backend

| Технология                                           | Версия | Назначение          |
| :--------------------------------------------------- | :----: | :------------------ |
| [NestJS](https://nestjs.com/)                        |   11   | Node.js фреймворк   |
| [TypeScript](https://www.typescriptlang.org/)        |  5.7   | Типизация           |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) |   6    | Хеширование паролей |
| [Jest](https://jestjs.io/)                           |   30   | Тестирование        |

### Качество кода

| Инструмент                                                | Версия | Назначение            |
| :-------------------------------------------------------- | :----: | :-------------------- |
| [ESLint](https://eslint.org/)                             |  9.26  | Линтер                |
| [Prettier](https://prettier.io/)                          |  3.5   | Форматирование        |
| [Stylelint](https://stylelint.io/)                        | 16.19  | Линтер стилей         |
| [Husky](https://typicode.github.io/husky/)                |  9.1   | Git hooks             |
| [Commitlint](https://commitlint.js.org/)                  |  19.8  | Линтер коммитов       |
| [Lint-staged](https://github.com/lint-staged/lint-staged) |  15.5  | Линтинг staged файлов |

---

## 📜 Доступные скрипты

### Frontend (`./package.json`)

| Скрипт         | Команда                | Описание                                   |
| :------------- | :--------------------- | :----------------------------------------- |
| `init`         | `npm run init`         | Установка зависимостей                     |
| `dev`          | `npm run dev`          | Сервер разработки (HMR, порт 5173)         |
| `build`        | `npm run build`        | Production сборка (`tsc -b && vite build`) |
| `preview`      | `npm run preview`      | Превью production сборки                   |
| `lint`         | `npm run lint`         | Проверка ESLint                            |
| `format`       | `npm run format`       | Форматирование Prettier                    |
| `format:check` | `npm run format:check` | Проверка форматирования                    |
| `stylelint`    | `npm run stylelint`    | Линтинг стилей                             |

### Server (`./server/package.json`)

| Скрипт       | Команда              | Описание                       |
| :----------- | :------------------- | :----------------------------- |
| `start:dev`  | `npm run start:dev`  | Сервер разработки (watch mode) |
| `build`      | `npm run build`      | Компиляция TypeScript          |
| `start:prod` | `npm run start:prod` | Production запуск              |
| `test:e2e`   | `npm run test:e2e`   | E2E тесты (20 сценариев)       |
| `lint`       | `npm run lint`       | Проверка ESLint                |

---

## 📂 Структура проекта

```
eCommerce-Application/
├── src/                          # Frontend (React + Vite)
│   ├── app/                      # Корневые настройки
│   │   └── routing/              # Роутинг, AuthContext
│   ├── pages/                    # Страницы
│   │   ├── main/                 #   Главная
│   │   ├── login/                #   Вход
│   │   ├── registration/         #   Регистрация
│   │   ├── catalog-product/      #   Каталог (фильтры, поиск, пагинация)
│   │   ├── detailed-product/     #   Детальная страница товара
│   │   ├── basket/               #   Корзина
│   │   └── user-profile/         #   Личный кабинет
│   ├── widgets/                  # Композиционные блоки
│   │   └── header/               #   Шапка сайта
│   └── shared/                   # Переиспользуемые модули
│       ├── api/                  #   API-слой
│       │   └── cart-api/         #     Эндпоинты корзины
│       ├── lib/                  #   Утилиты
│       │   ├── token/            #     Работа с токенами
│       │   ├── context/          #     React-контексты
│       │   └── data-parsing/     #     Парсинг данных
│       └── ui/                   #   UI-компоненты
│
├── server/                       # Backend (NestJS)
│   └── src/
│       ├── auth/                 # Модуль авторизации
│       ├── products/             # Модуль товаров + фильтры
│       ├── carts/                # Модуль корзины
│       ├── users/                # Модуль пользователей
│       ├── categories/           # Модуль категорий
│       ├── common/               # Общие типы, storage, утилиты
│       └── data/                 # Статические данные (18 авто, 4 категории, 20 промокодов)
│
└── package.json
```

---

## 📡 API Endpoints

### 🔐 Auth

| Метод  | Путь                        | Описание        |
| :----- | :-------------------------- | :-------------- |
| `POST` | `/api/auth/register`        | Регистрация     |
| `POST` | `/api/auth/login`           | Вход            |
| `POST` | `/api/auth/anonymous/token` | Анонимный токен |
| `POST` | `/api/auth/change-password` | Смена пароля    |

### 🚗 Products

| Метод | Путь                   | Описание                     |
| :---- | :--------------------- | :--------------------------- |
| `GET` | `/api/products`        | Все товары (с пагинацией)    |
| `GET` | `/api/products/search` | Поиск + фильтры + сортировка |
| `GET` | `/api/products/:key`   | Товар по ключу               |
| `GET` | `/api/categories`      | Все категории                |

### 🛒 Carts

| Метод    | Путь             | Описание                                              |
| :------- | :--------------- | :---------------------------------------------------- |
| `POST`   | `/api/carts`     | Создать корзину                                       |
| `GET`    | `/api/carts/:id` | Получить корзину                                      |
| `POST`   | `/api/carts/:id` | Обновить корзину (add/remove/change items, промокоды) |
| `DELETE` | `/api/carts/:id` | Удалить корзину                                       |

### 👤 Users

| Метод  | Путь             | Описание           |
| :----- | :--------------- | :----------------- |
| `GET`  | `/api/users/:id` | Данные профиля     |
| `POST` | `/api/users/:id` | Обновление профиля |

---

## 🧪 Тестирование

Проект покрыт **20 E2E тестами**, проверяющими все основные пользовательские сценарии:

```bash
cd server && npm run test:e2e
```

| №     | Сценарий                                             | Статус |
| :---- | :--------------------------------------------------- | :----: |
| 1–13  | ✅ Основные сценарии (регистрация, корзина, профиль) |   ✅   |
| 14–20 | ✅ Фильтрация, сортировка, поиск                     |   ✅   |

**Результат: 20/20** ✅

---

## 👥 Команда

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/dmitrystarchenko">
        <img src="https://github.com/dmitrystarchenko.png" width="80" alt="dmitrystarchenko"/>
        <br />
        <b>dmitrystarchenko</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/bubnov-roma">
        <img src="https://github.com/bubnov-roma.png" width="80" alt="bubnov-roma"/>
        <br />
        <b>bubnov-roma</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/sergeyskakun">
        <img src="https://github.com/sergeyskakun.png" width="80" alt="sergeyskakun"/>
        <br />
        <b>sergeyskakun</b>
      </a>
    </td>
  </tr>
</table>

---

<div align="center">

**eCommerce Application** — финальный проект курса [RS School](https://rs.school/) JavaScript/Front-end 2024Q4

⭐ Если проект был полезен, поставьте звезду на [GitHub](https://github.com/DmitryStarchenko/eCommerce-Application)!

</div>
