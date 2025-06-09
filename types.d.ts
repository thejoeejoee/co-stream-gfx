export interface SplitFeed {
    vmix_url: string;
    flags_path: string;
    label: string;
    is_national: boolean;
    is_relay: boolean;
    has_leader: boolean;
    leader: SplitFeedRunner;
    punched: boolean;
    row_idx: number;
    data?: (SplitFeedRunner)[] | null;
}
export interface SplitFeedRunner {
    position: string;
    name: string;
    nationality: string;
    club: string;
    time: string;
}
