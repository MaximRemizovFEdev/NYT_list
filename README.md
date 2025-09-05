# NYT Mobile News App

Мобильная версия веб-приложения новостного сайта с использованием REST API New York Times.

## Технологии

- **Frontend**: React 19 + TypeScript + Vite
- **State Management**: Redux Toolkit
- **UI**: CSS Modules + React Virtuoso (виртуализация)
- **Routing**: React Router DOM
- **Backend**: Custom JSON Server с JWT авторизацией

## Функциональность

- �� Загрузка и отображение новостей NYT по месяцам
- 🔐 JWT авторизация с refresh токенами
- 📱 Мобильная адаптивная верстка
- ⚡ Виртуализированный список новостей
- 🗂️ Группировка новостей по дням
- �� Автоматическая подгрузка при скролле

## Авторизация

### Архитектура
- **JWT токены**: Access (15 мин) + Refresh (7 дней)
- **HTTP-Only cookies**: Токены хранятся в безопасных cookies
- **Автоматическое обновление**: Refresh токен обновляет access токен
- **Защищенные роуты**: Проверка авторизации на клиенте

### Endpoints