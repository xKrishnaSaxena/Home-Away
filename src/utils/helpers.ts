import { formatDistance, parseISO } from "date-fns";
import { differenceInDays } from "date-fns";

export const subtractDates = (dateStr1:Date, dateStr2:Date) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr:Date) =>
  
  formatDistance(parseISO(dateStr.toString()), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");


export const getToday = function (options:any = {}) {
  const today = new Date();


  if (options?.end)
   
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value:number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "INR" }).format(
    value
  );
