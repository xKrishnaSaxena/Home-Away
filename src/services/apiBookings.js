import { PAGE_SIZE } from "../utils/constants";
import { getToday, subtractDates } from "../utils/helpers";
import { isFuture, isPast, isToday } from "date-fns";
import supabase from "./supabase";

async function fetchCabinDetails(cabinId) {
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

export async function getBookings({ filter, sortBy, page }) {
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

export async function getBooking(id) {
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

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
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

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
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

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
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

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

export async function createBooking(newBooking, id) {
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

  newBooking = {
    ...newBooking,
    numNights,
    cabinPrice,
    extrasPrice,
    totalPrice,
    status,
  };

  let query = supabase.from("bookings");
  if (!id) query = query.insert([{ ...newBooking }]);
  if (id) query = query.update({ ...newBooking }).eq("id", id);

  const { data, error } = await query.select().single();
  if (error) {
    console.log(error);
    throw new Error("Booking could not be created");
  }
  return data;
}
