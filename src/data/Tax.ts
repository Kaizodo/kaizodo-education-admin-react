
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
