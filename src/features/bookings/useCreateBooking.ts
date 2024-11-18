import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBooking } from "../../services/apiBookings";
import { Booking } from "../../types";

interface CreateBookingParams {
  data: Booking;
  id?: number;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Booking, Error, CreateBookingParams>(
    ({ data, id }) => createBooking(data, id || 0),
    {
      onSuccess: () => {
        toast.success("Booking successfully created");
        queryClient.invalidateQueries({
          queryKey: ["booking"],
        });
      },
      onError: (err: Error) => {
        toast.error(err.message);
      },
    }
  );

  return { mutate: mutation.mutate, isLoading: mutation.isLoading };
}
