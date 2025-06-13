import dayjs from "dayjs";

const dateOnly = (rawDate: Date | string): string => dayjs(rawDate).format("YYYY-MM-DD");
const dateTime = (rawDate: Date | string): string => dayjs(rawDate).format("YYYY-MM-DD HH:mm:ss");
const formatCurrency = (amount: number | undefined, currency: string = 'BWP', locale: string = 'en-BW')  =>{
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount || 0);
  }
  

export { dateOnly, dateTime, formatCurrency };