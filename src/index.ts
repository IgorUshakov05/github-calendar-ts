import dotenv from "dotenv";
dotenv.config();
import { GetEventDataProps, GitHubEvent } from "./types";

export async function GetEventData({
  username,
  token,
}: GetEventDataProps): Promise<{
  success: boolean;
  events?: GitHubEvent[];
}> {
  const perPage = 100;
  const page = 1;
  const apiUrl = `https://api.github.com/users/${username}/events/public?per_page=${perPage}&page=${page}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (!response.ok) {
      return { success: false };
    }

    const data: GitHubEvent[] = await response.json();

    if (!data || data.length === 0) {
      return { success: false };
    }
    return { success: true, events: data };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
const getEvent = async () => {
  let data = await GetEventData({
    username: "IgorUshakov05",
    token: process.env.GITHUB_TOKEN || "",
  });
  console.log(data.events);
};

getEvent()