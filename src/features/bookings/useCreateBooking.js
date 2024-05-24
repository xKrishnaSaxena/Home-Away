import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { createBooking } from "../../services/apiBookings";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { mutate, isAdding } = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success("Booking successfully created");
      queryClient.invalidateQueries({
        queryKey: ["booking"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { mutate, isAdding };
}
