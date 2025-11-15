export const enum TaxModeEnum {
    Single = 0,
    Double = 1,
    Multiple = 2
}

export const TaxModeArray = [
    { id: TaxModeEnum.Single, name: "Single" },
    { id: TaxModeEnum.Double, name: "Double" },
    { id: TaxModeEnum.Multiple, name: "Multiple" }
];

export const getTaxModeName = (id: TaxModeEnum) =>
    TaxModeArray.find(x => x.id === id)?.name ?? '';

export const enum TaxGroupEnum {
    Common = 0,
    State = 1,
    Other = 2
}




export const TaxGroupArray = [
    { id: TaxGroupEnum.Common, name: "Common" },
    { id: TaxGroupEnum.State, name: "State" },
    { id: TaxGroupEnum.Other, name: "Other" }
];


export const getTaxGroupName = (id: TaxGroupEnum) =>
    TaxGroupArray.find(x => x.id === id)?.name ?? '';
