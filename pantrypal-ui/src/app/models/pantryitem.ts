export interface Pantryitem {
    itemId: number,
    itemName: string,
    quantity: number,
    unitOfMeasure: string,
    expirationDate: Date,
    userId?: number,
}
