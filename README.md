# GitHub Contribution Calendar  

Визуализация активности коммитов пользователя GitHub в виде календаря.  

## 🔍 Описание работы  

### 1. **Загрузка стилей**  
Сначала создается тег `<link>`, который подключает CSS-файл со стилями календаря:  

```typescript
const style = document.createElement("link");
style.setAttribute(
  "href",
  "https://cdn.jsdelivr.net/gh/IgorUshakov05/github-calendar-ts@master/src/github-calendar.css"
);
style.rel = "stylesheet";
document.head.appendChild(style);
```

### 2. **Определение уровней активности**  
Функция `getLevelForCommits(commitCount: number)` определяет интенсивность коммитов:  

```typescript
function getLevelForCommits(commitCount: number) {
  if (commitCount === 0) return 0;
  if (commitCount <= 2) return 1;
  if (commitCount <= 3) return 2;
  if (commitCount <= 4) return 3;
  return 4;
}
```
Чем больше коммитов, тем выше уровень активности (от `0` до `4`).  

### 3. **Запрос данных из GitHub GraphQL API**  
Функция `getCommitsGraphQL(GITHUB_TOKEN: string)` делает запрос к API GitHub и получает данные о коммитах:  

```typescript
async function getCommitsGraphQL(GITHUB_TOKEN: string): Promise<Record<string, number>> {
  const query = `
    query {
      viewer {
        repositories(first: 100) {
          nodes {
            name
            defaultBranchRef {
              target {
                ... on Commit {
                  history(since: "${START_DATE}") {
                    edges {
                      node {
                        committedDate
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    console.error("Ошибка запроса GraphQL:", response.status);
    return {};
  }

  const data = await response.json();
  const activity: Record<string, number> = {};

  data.data.viewer.repositories.nodes.forEach((repo: any) => {
    if (!repo.defaultBranchRef) return;

    repo.defaultBranchRef.target.history.edges.forEach((edge: any) => {
      const date = edge.node.committedDate.split("T")[0];
      activity[date] = (activity[date] || 0) + 1;
    });
  });

  return activity;
}
```
Этот запрос получает список репозиториев пользователя и все коммиты за год.  

### 4. **Обработка данных и логирование**  
Функция `sendResponse(GITHUB_TOKEN: string)` вызывает `getCommitsGraphQL()` и выводит статистику в консоль:  

```typescript
async function sendResponse(GITHUB_TOKEN: string): Promise<{ [key: string]: number }> {
  const activity = await getCommitsGraphQL(GITHUB_TOKEN);
  console.log(activity);
  console.log("\n📊 Статистика коммитов:");

  Object.keys(activity)
    .sort()
    .forEach((date) => {
      console.log(`${date}: ${activity[date]} коммитов`);
    });

  return activity;
}
```
Здесь создается объект, где ключ – дата (`YYYY-MM-DD`), а значение – количество коммитов.  

### 5. **Отрисовка календаря**  
Функция `drawGitHubTabActive(GITHUB_TOKEN: string)` создает HTML-структуру для календаря:  

```typescript
const drawGitHubTabActive = async (GITHUB_TOKEN: string) => {
  const calendarContainer = document.querySelector(".calendar-container");
  if (calendarContainer) {
    if (!GITHUB_TOKEN) {
      calendarContainer.innerHTML = "Нет токена";
      return;
    }

    calendarContainer.innerHTML = `
      <div class="month"></div>
      <div class="calendar">
        <div class="weekdays">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>
        <div class="grid"></div>
      </div>
    `;
  }
```
После этого она:  
1. Создает заголовки с названиями месяцев.  
2. Загружает данные о коммитах.  
3. Отрисовывает сетку календаря (53 недели × 7 дней).  

```typescript
  let activityDay: { [key: string]: number } = await sendResponse(GITHUB_TOKEN);

  const startDate = new Date(new Date().getFullYear(), 0, 1);
  const totalWeeks = 53;
  const daysPerWeek = 7;

  for (let week = 0; week < totalWeeks; week++) {
    const weekContainer = document.createElement("div");
    weekContainer.classList.add("week");

    for (let dayOfWeek = 0; dayOfWeek < daysPerWeek; dayOfWeek++) {
      const day = document.createElement("div");
      day.classList.add("day");

      const date = new Date(startDate);
      date.setDate(
        startDate.getDate() + week * 7 + dayOfWeek - startDate.getDay() + 1
      );

      const attr = date.toISOString().split("T")[0];

      if (
        attr.includes(`${new Date().getFullYear() - 1}`) ||
        attr.includes(`${new Date().getFullYear() + 1}`)
      ) {
        day.style.opacity = "0";
      }
      day.setAttribute("data-date", attr);
      if (activityDay[attr]) {
        day.setAttribute(
          "data-level",
          `${getLevelForCommits(activityDay[attr])}`
        );
      }
      weekContainer.appendChild(day);
    }

    grid?.appendChild(weekContainer);
  }
};
```
Каждый день получает:  
- `data-date` с датой в формате `YYYY-MM-DD`.  
- `data-level` с уровнем активности (от `0` до `4`).  

## 🛠 Итог  
Этот код:  
1. Запрашивает данные о коммитах через GitHub API.  
2. Логирует данные в консоль.  
3. Создает HTML-структуру календаря.  
4. Отображает дни с разными уровнями активности.  

📌 **Готово! Теперь можно использовать календарь для отображения коммитов.** 🚀