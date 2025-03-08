export type Commit = {
    sha: string;
    author: {
        email: string;
        name: string;
    };
    message: string;
    distinct: boolean;
    url: string;
};
export type Actor = {
    id: number;
    login: string;
    display_login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
};
export type Repo = {
    id: number;
    name: string;
    url: string;
};
export type Payload = {
    repository_id: number;
    push_id: number;
    size: number;
    distinct_size: number;
    ref: string;
    head: string;
    before: string;
    commits: Commit[];
};
export type GetEventDataProps = {
    username: string;
    token: string;
};
export type GitHubEvent = {
    id: string;
    eventType: string;
    actor: Actor;
    repo: Repo;
    payload: Payload;
    public: boolean;
    created_at: string;
};
//# sourceMappingURL=types.d.ts.map