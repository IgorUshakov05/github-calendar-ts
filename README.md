


# GitHub Contribution Calendar

Эта библиотека позволяет отображать график коммитов пользователя GitHub в виде календаря.

## 📌 Установка

### 1. Установите библиотеку через npm:

```sh
npm install github-calendar-ts
```

### 2. Создайте GitHub Access Token

Для работы с GitHub API вам потребуется **персональный токен доступа**. Создайте его [здесь](https://github.com/settings/tokens/new) и выберите `repo` и `read:user`.

## 🚀 Использование

### Вариант 1: Подключение через ES-модуль

```typescript
import { drawGitHubTabActive } from "github-calendar-ts";

const GITHUB_TOKEN = "ВАШ_GITHUB_TOKEN";
drawGitHubTabActive(GITHUB_TOKEN);
```

### Вариант 2: Подключение через `<script>` (CDN)

```html
<script type="module">
  import { drawGitHubTabActive } from "https://cdn.jsdelivr.net/gh/IgorUshakov05/github-calendar-ts@master/dist/index.js";
  const GITHUB_TOKEN = "ВАШ_GITHUB_TOKEN";
  drawGitHubTabActive(GITHUB_TOKEN);
</script>
```

### 3. Добавьте контейнер в HTML

В вашем HTML-документе должен быть контейнер, в который будет отрисован календарь:

```html
<div class="calendar-container"></div>
```

## 🎨 Кастомизация

Вы можете изменить стили календаря, используя CSS. Например:

```css
.day[data-level="4"] { background-color: #216e39; }
.day[data-level="3"] { background-color: #30a14e; }
.day[data-level="2"] { background-color: #40c463; }
.day[data-level="1"] { background-color: #9be9a8; }
.day[data-level="0"] { background-color: #ebedf0; }
```

## 🛠 Отладка

Если что-то не работает:

1.  Проверьте, что ваш `GITHUB_TOKEN` имеет правильные права.
2.  Откройте консоль браузера (F12 → Console) и посмотрите, нет ли ошибок.
3.  Убедитесь, что стили подключены корректно.

## 📌 Итог

Теперь вы можете легко отображать статистику коммитов на своей странице! 🚀
