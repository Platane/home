export type Point = { x: number, y: number, z: number };

export type MediaImg = {
    type: 'img',
    url: string,
    label: ?string,
};
export type MediaLink = {
    type: 'link',
    url: string,
    label: ?string,
};
export type Media = MediaImg | MediaLink;

export type Event = {
    startDate: number,
    endDate: number,
    media: Array<Media>,
    icon_url: string,
    description: string,
    title: string,
};

export type TimeLine = {
    icon: string,
    label: string,
    events: Array<Event>,
};
