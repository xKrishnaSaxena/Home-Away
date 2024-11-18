import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";
import {  Cabin } from "../../types";
interface EditCabinProps{
  newCabinData:Cabin;
  id:number;
}

export function useEditcabin() {
  const queryClient = useQueryClient();
  const { mutate: editCabin, isLoading: isEditting } = useMutation({
    mutationFn: ({ newCabinData, id }:EditCabinProps) => createCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin successfully edited");
      queryClient.invalidateQueries({
        queryKey: ["cabin"],
      });
    },
    onError: (err:Error) => toast.error(err.message),
  });
  return { editCabin, isEditting };
}
