import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const { mutate: deleteBookingfunction, isLoading: isDeletingBooking } =
    useMutation({
      mutationFn: (id:number) => deleteBooking(id),
      onSuccess: () => {
        toast.success("Booking deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["bookings"],
        });
      },
      onError: (err:Error) => toast.error(err.message),
    });
  return { deleteBookingfunction, isDeletingBooking };
}
