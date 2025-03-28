const style = document.createElement("style");
style.textContent = `
  .calendar-container {
  width: 100%;
  max-width: 900px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #d1d9e0;
}
.month {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 38px;
  margin-bottom: 5px;
}
.calendar {
  display: flex;
}
.weekdays {
  display: flex;
  flex-direction: column;
  width: 30px;
  font-size: 12px;
  justify-content: space-around;
  margin-right: 5px;
}
.grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2px;
  width: 100%;
}
.day {
  width: 10px;
  margin-bottom: 3px;
  aspect-ratio: 1;
  background-color: #ebedf0;
  border-radius: 2px;
  outline: 1px solid #ebedf0;
  outline-offset: -1px;
}
.monthItem {
  font-size: 12px;
}

.day[data-level="4"] {
  background-color: #216e39;
}
.day[data-level="3"] {
  background-color: #30a14e;
}
.day[data-level="2"] {
  background-color: #40c463;
}
.day[data-level="1"] {
  background-color: #9be9a8;
}
.day[data-level="0"] {
  background-color: #ebedf0;
}
`;
document.head.appendChild(style);
const months: { [key: number]: string } = {
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
function getLevelForCommits(commitCount: number) {
  if (commitCount === 0) return 0;
  if (commitCount <= 2) return 1;
  if (commitCount <= 3) return 2;
  if (commitCount <= 4) return 3;
  return 4;
}

const START_DATE: string = `${new Date().getFullYear()}-01-01T00:00:00Z`;

async function getCommitsGraphQL(
  GITHUB_TOKEN: string
): Promise<Record<string, number>> {
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

async function sendResponse(
  GITHUB_TOKEN: string
): Promise<{ [key: string]: number }> {
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
  const monthContainer = document.querySelector(".month");
  const grid = document.querySelector(".grid");

  for (let item = 1; item < 13; item++) {
    const span: HTMLElement = document.createElement("span");
    span.innerText = months[item];
    span.className = "monthItem";
    monthContainer?.appendChild(span);
  }

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
      day.setAttribute("title", attr);

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

export { drawGitHubTabActive };
