export enum PaymentMode {
    Cash = 0,
    Cheque = 1,
    BankTransfer = 2,
    UPI = 3,
    Card = 4,
    DD = 5,
    Online = 6
}

export const PaymentModeArray = [
    { id: PaymentMode.Cash, name: 'Cash' },
    { id: PaymentMode.Cheque, name: 'Cheque' },
    { id: PaymentMode.BankTransfer, name: 'BankTransfer' },
    { id: PaymentMode.UPI, name: 'UPI' },
    { id: PaymentMode.Card, name: 'Card' },
    { id: PaymentMode.DD, name: 'DD' },
    { id: PaymentMode.Online, name: 'Online' }
]

export const getPaymentModeName = (mode: PaymentMode): string => {
    return PaymentModeArray.find(x => x.id === mode)?.name || '';
}
