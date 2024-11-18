import { PAGE_SIZE } from "../utils/constants";
import { getToday, subtractDates } from "../utils/helpers";
import { isFuture, isPast, isToday } from "date-fns";
import supabase from "./supabase";
import { Booking } from "../types";
interface getBookingsProps{
  filter:{
    field:string;
    value:string;
  }|null;
  sortBy:{
    field:string;
    direction:string;
  };
  page:number;
}

async function fetchCabinDetails(cabinId:number) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", cabinId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Cabin details could not be fetched");
  }
  return data;
}

export async function getBookings({ filter, sortBy, page }:getBookingsProps) {
  let query = supabase.from("bookings").select("*");
  if (filter) query = query.eq(filter.field, filter.value);

  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;
  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }
  return { data, count };
}

export async function getBooking(id:number) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}


export async function getBookingsAfterDate(date:string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}


export async function getStaysAfterDate(date:string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}


export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");


  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id:number, obj:any) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id:number) {

  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

export async function createBooking(newBooking:Booking, id:number) {
 
  const cabin = await fetchCabinDetails(newBooking.cabinId);
  const numNights = subtractDates(newBooking.endDate, newBooking.startDate);
  const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
  const extrasPrice = newBooking.hasBreakfast
    ? numNights * 15 * newBooking.numGuests
    : 0;
  const totalPrice = cabinPrice + extrasPrice;
  let status;
  if (
    isPast(new Date(newBooking.endDate)) &&
    !isToday(new Date(newBooking.endDate))
  )
    status = "checked-out";
  if (
    isFuture(new Date(newBooking.startDate)) ||
    isToday(new Date(newBooking.startDate))
  )
    status = "unconfirmed";
  if (
    (isFuture(new Date(newBooking.endDate)) ||
      isToday(new Date(newBooking.endDate))) &&
    isPast(new Date(newBooking.startDate)) &&
    !isToday(new Date(newBooking.startDate))
  )
    status = "checked-in";
if(status){
  newBooking = {
    ...newBooking,
    numNights,
    cabinPrice,
    extrasPrice,
    totalPrice,
    status,
  };}

  let query:any = supabase.from("bookings");
  if (!id) query = query.insert([{ ...newBooking }]);
  if (id) query = query.update({ ...newBooking }).eq("id", id);

  const { data, error } = await query.select().single();
  if (error) {
    console.log(error);
    throw new Error("Booking could not be created");
  }
  return data;
}
