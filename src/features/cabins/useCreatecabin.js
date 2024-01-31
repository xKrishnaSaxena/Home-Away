import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useCreatecabin() {
  const queryClient = useQueryClient();
  const { mutate, isAdding } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success("Cabin successfully added");
      queryClient.invalidateQueries({
        queryKey: ["cabin"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { mutate, isAdding };
}
