var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from "dotenv";
dotenv.config();
export function GetEventData(_a) {
    return __awaiter(this, arguments, void 0, function* ({ username, token, }) {
        const perPage = 100;
        const page = 1;
        const apiUrl = `https://api.github.com/users/${username}/events/public?per_page=${perPage}&page=${page}`;
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
        token: process.env.GITHUB_TOKEN || "",
    });
    console.log(data.events);
});
getEvent();
