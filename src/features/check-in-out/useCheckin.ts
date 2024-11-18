import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { updateBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast";
import { Booking } from "../../types";
interface UseCheckInProps{
  bookingId:number;
  breakfast:any;
}

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation<Booking,Error,UseCheckInProps> ( ({ bookingId, breakfast }) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),{
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in`);
      queryClient.invalidateQueries(['myQuery', { active: true }]);
      navigate("/");
    },
    onError: () => toast.error("There was an error while checking in"),
  
  }
);
  return { checkin:mutation.mutate, isCheckingIn:mutation.isLoading };
}
