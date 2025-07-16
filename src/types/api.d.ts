
export interface ILiveFeed {
    label: string;
    is_national: boolean;
    is_relay: boolean;
    has_leader: boolean;
    finish:      boolean;
    leader: ILiveFeedRunner;
    punched: boolean;
    row_idx: number;
    data?: (ILiveFeedRunner)[] | null;
}
export interface ILiveFeedRunner {
    position: string;
    name: string;
    nationality: string;
    club: string;
    time: string;
    change: number;
}

export interface IParameters {
    'class': string;
    data: IKeyValue[];
}
export interface IKeyValue {
    key: string;
    value: string;
}

export interface IFreeText {
    title: string
    text: string
}

export interface IRaceTitle {
    title: string
    date: string
    place: string
}

export interface ISpeaker {
    title: string
    commentators: string
}

export interface IWeather {
    title: string;
    date: string;
    place: string;
    temperature: string;
    humidity: string;
    wind_speed: string;
}

// {"vmix_url": "127.0.0.1:8080", "flags_path": "C:UserschmelDocumentsorientacnisportyIOF_GRAFIKAvlajky_3_letters_JWOC", "label": "Startovka", "class": "H21C", "page": 1, "data": [{"bib_number": "", "name": "Ptu00e1u010dek Jonu00e1u0161", "nationality": "CZE", "club": "TBM", "start_time": "11:11"}, {"bib_number": "", "name": "Seidenglanz Ju00e1chym", "nationality": "CZE", "club": "SSU", "start_time": "11:15"}, {"bib_number": "", "name": "u0160torek Jan", "nationality": "CZE", "club": "JPV", "start_time": "11:19"}, {"bib_number": "", "name": "Chaloupka Josef", "nationality": "CZE", "club": "UOL", "start_time": "11:23"}, {"bib_number": "", "name": "u0160torek David", "nationality": "CZE", "club": "JPV", "start_time": "11:27"}, {"bib_number": "", "name": "Horvu00e1t Petr", "nationality": "CZE", "club": "TBM", "start_time": "11:31"}, {"bib_number": "", "name": "Bialou017eyt Marek", "nationality": "CZE", "club": "PGP", "start_time": "11:35"}, {"bib_number": "", "name": "Pudel Jaroslav", "nationality": "CZE", "club": "STE", "start_time": "11:39"}, {"bib_number": "", "name": "Holusek Jiu0159u00ed", "nationality": "CZE", "club": "JPV", "start_time": "11:43"}, {"bib_number": "", "name": "Fendrych Michal", "nationality": "CZE", "club": "STE", "start_time": "11:47"}]}
export interface IStartList {
    label:      string;
    class:      string;
    page:       number;
    data:    IStartListRunner[];
    is_national: boolean;
    is_relay:    boolean;
}

export interface IStartListRunner {
    bib_number:  string;
    name:        string;
    nationality: string;
    club?:        string;
    start_time?:  string;

    start_time_ts?: number; // optional, unix timestamp
}

export interface ISingleRunner {
    bib_number:  string;
    name:        string;
    nationality: string;
    club:        string;
    detail:      string;
    class:       string;
    is_national: boolean;
    is_relay:    boolean;
}

export interface IStartDetail {
    bib_number:  string;
    name:        string;
    nationality: string;
    club:        string;
    detail:      string;
    start_time:  string;
    class:       string;
    is_national: boolean;
    is_relay:    boolean;
}

export interface IResults {
    label:      string;
    class:      string;
    page:       number;
    data:       IResultsRunner[];
    is_national: boolean;
    is_relay:    boolean;
    finish:      boolean;
}

export interface IResultsRunner {
    position:    string;
    name:        string;
    nationality: string;
    club:        string;
    time:        string;
    change:      number;
}

export interface IFlowers {
    label:       string;
    class:       string;
    rows:        number;
    data:        IFlowersRunner[];
    is_relay:    boolean;
    is_national: boolean;
}

export interface IFlowersRunner {
    position:    string;
    name:        string;
    nationality: string;
    club:        string;
}

export interface IPositionHistory {
    class: string;
    is_national: boolean;
    is_relay: boolean;
    controls: string[];
    data:  IPositionHistoryRunner[];
}

export interface IPositionHistoryRunner {
    name:        string;
    club:        string;
    nationality: string;
    history:     IPositionHistoryEntry[];
}

export interface IPositionHistoryEntry {
    position:   number;
    time_loss:  number;
}

export interface ClubFlagConfiguration {
  is_national: boolean;
  is_relay: boolean;
}
