import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { updateSetting } from "../../services/apiSettings";

export function useEditSettings() {
  const queryClient = useQueryClient();
  const { mutate: editSettings, isLoading: isEditting } = useMutation({
    mutationFn: updateSetting,
    onSuccess: () => {
      toast.success("Settings successfully edited");
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },
    onError: (err:Error) => toast.error(err.message),
  });
  return { editSettings, isEditting };
}
