import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";
import { Cabin } from "../../types";
interface CreateCabinParams {
  data: Cabin;
  id?: number;
}

export function useCreatecabin() {
  const queryClient = useQueryClient();
  const mutation = useMutation<Cabin,Error,CreateCabinParams>(
    ({data,id})=> createCabin(data,id||0),{
    onSuccess: () => {
      toast.success("Cabin successfully added");
      queryClient.invalidateQueries({
        queryKey: ["cabin"],
      });
    },
    onError: (err:Error) => toast.error(err.message),
  }
);
  return { mutate:mutation.mutate, isAdding:mutation.isLoading };
}
