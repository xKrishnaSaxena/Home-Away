import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { createBooking } from "../../services/apiBookings";

export function useEditBooking() {
  const queryClient = useQueryClient();
  const { mutate: editBooking, isLoading: isEditting } = useMutation({
    mutationFn: ({ newBookingData, id }) => createBooking(newBookingData, id),
    onSuccess: () => {
      toast.success("Booking Successfully edited");
      queryClient.invalidateQueries({
        queryKey: ["booking"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { editBooking, isEditting };
}
