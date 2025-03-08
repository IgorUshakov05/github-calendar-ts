import { GetEventDataProps, GitHubEvent } from "./types";
export declare function GetEventData({ username, token, }: GetEventDataProps): Promise<{
    success: boolean;
    events?: GitHubEvent[];
}>;
//# sourceMappingURL=index.d.ts.map