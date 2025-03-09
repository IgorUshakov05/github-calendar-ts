var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function GetEventData(_a) {
    return __awaiter(this, arguments, void 0, function* ({ username, token, }) {
        const perPage = 100;
        const page = 1;
        const apiUrl = `https://api.github.com/users/${username}/events?per_page=${perPage}&page=${page}`;
        try {
            const response = yield fetch(apiUrl, {
                headers: {
                    Authorization: `token ${token}`,
                },
            });
            if (!response.ok) {
                return { success: false };
            }
            const data = yield response.json();
            if (!data || data.length === 0) {
                return { success: false };
            }
            return { success: true, events: data };
        }
        catch (error) {
            console.error(error);
            return { success: false };
        }
    });
}
const getEvent = () => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield GetEventData({
        username: "IgorUshakov05",
        token: "",
    });
    console.log(data.events);
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
    const monthContainer = document.querySelector(".month");
    const grid = document.querySelector(".grid");
    for (let item = 1; item < 13; item++) {
        const span = document.createElement("span");
        span.innerText = months[item];
        span.className = "monthItem";
        monthContainer === null || monthContainer === void 0 ? void 0 : monthContainer.appendChild(span);
    }
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
            const today = new Date().toISOString().split("T")[0];
            const dayOfMonth = date.getDate();
            if (attr.includes(`${new Date().getFullYear() - 1}`) ||
                attr.includes(`${new Date().getFullYear() + 1}`)) {
                day.style.opacity = "0";
            }
            day.setAttribute("data-date", attr);
            weekContainer.appendChild(day);
        }
        grid === null || grid === void 0 ? void 0 : grid.appendChild(weekContainer);
    }
});
getEvent();
