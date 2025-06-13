import IAddOn from "./add-ons"

export default interface IQuotationView{
    coverName: string
    coverId: number
    coverBasePremium: number
    finalPremium: number
    calcNotes: string
    addOnsTotal: number
    addOns: IAddOn[]
}