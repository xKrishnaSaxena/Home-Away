import { useQuery } from "@tanstack/react-query";

import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router-dom";

export function useBooking() {
  const { bookingId } = useParams();
  const parsedBokingId=bookingId?Number(bookingId):undefined;
  const {
    isLoading,
    data: booking,
    error,
  } = useQuery({
    queryKey: ["booking", parsedBokingId],
    queryFn: () => {if(parsedBokingId===undefined){
      throw new Error("Booking ID is not defined or invalid")
    }
    return getBooking(parsedBokingId);
  },
    retry: false,
  });
  console.log(booking);
  return { isLoading, booking, error };
}


