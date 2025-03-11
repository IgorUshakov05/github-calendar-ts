var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const style = document.createElement("link");
style.setAttribute("href", "https://cdn.jsdelivr.net/gh/IgorUshakov05/github-calendar-ts@master/src/github-calendar.css");
style.rel = "stylesheet";
document.head.appendChild(style);
const months = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
};
function getLevelForCommits(commitCount) {
    if (commitCount === 0)
        return 0;
    if (commitCount <= 2)
        return 1;
    if (commitCount <= 3)
        return 2;
    if (commitCount <= 4)
        return 3;
    return 4;
}
const START_DATE = `${new Date().getFullYear()}-01-01T00:00:00Z`;
function getCommitsGraphQL(GITHUB_TOKEN) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const response = yield fetch("https://api.github.com/graphql", {
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
        const data = yield response.json();
        const activity = {};
        data.data.viewer.repositories.nodes.forEach((repo) => {
            if (!repo.defaultBranchRef)
                return;
            repo.defaultBranchRef.target.history.edges.forEach((edge) => {
                const date = edge.node.committedDate.split("T")[0];
                activity[date] = (activity[date] || 0) + 1;
            });
        });
        return activity;
    });
}
function sendResponse(GITHUB_TOKEN) {
    return __awaiter(this, void 0, void 0, function* () {
        const activity = yield getCommitsGraphQL(GITHUB_TOKEN);
        console.log(activity);
        console.log("\n📊 Статистика коммитов:");
        Object.keys(activity)
            .sort()
            .forEach((date) => {
            console.log(`${date}: ${activity[date]} коммитов`);
        });
        return activity;
    });
}
const drawGitHubTabActive = (GITHUB_TOKEN) => __awaiter(void 0, void 0, void 0, function* () {
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
    const monthContainer = document.querySelector(".month");
    const grid = document.querySelector(".grid");
    for (let item = 1; item < 13; item++) {
        const span = document.createElement("span");
        span.innerText = months[item];
        span.className = "monthItem";
        monthContainer === null || monthContainer === void 0 ? void 0 : monthContainer.appendChild(span);
    }
    let activityDay = yield sendResponse(GITHUB_TOKEN);
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
            date.setDate(startDate.getDate() + week * 7 + dayOfWeek - startDate.getDay() + 1);
            const attr = date.toISOString().split("T")[0];
            if (attr.includes(`${new Date().getFullYear() - 1}`) ||
                attr.includes(`${new Date().getFullYear() + 1}`)) {
                day.style.opacity = "0";
            }
            day.setAttribute("data-date", attr);
            if (activityDay[attr]) {
                day.setAttribute("data-level", `${getLevelForCommits(activityDay[attr])}`);
            }
            weekContainer.appendChild(day);
        }
        grid === null || grid === void 0 ? void 0 : grid.appendChild(weekContainer);
    }
});
export { drawGitHubTabActive };
