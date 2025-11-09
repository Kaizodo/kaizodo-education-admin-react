export enum ContentFieldTypeEnum {
    ShortText = 0,
    LongText = 1,
    RichText = 2,
    Image = 3,
    Url = 4,
    Video = 5
}


export const ContentFieldTypeArray = [
    { id: ContentFieldTypeEnum.ShortText, name: 'ShortText' },
    { id: ContentFieldTypeEnum.LongText, name: 'LongText' },
    { id: ContentFieldTypeEnum.RichText, name: 'RichText' },
    { id: ContentFieldTypeEnum.Image, name: 'Image' },
    { id: ContentFieldTypeEnum.Url, name: 'Url' },
    { id: ContentFieldTypeEnum.Video, name: 'Video' }
];

