import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useEditcabin() {
  const queryClient = useQueryClient();
  const { mutate: editCabin, isLoading: isEditting } = useMutation({
    mutationFn: ({ newCabinData, id }) => createCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin successfully edited");
      queryClient.invalidateQueries({
        queryKey: ["cabin"],
      });
    },
    onError: (err) => toast.error(err.message),
  });
  return { editCabin, isEditting };
}
