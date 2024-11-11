import { useQuery } from "@tanstack/react-query";
import { getCabin } from "../../services/apiCabins";
import supabase from "../../services/supabase";

export function useCabins() {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ["cabin"],
    queryFn: getCabin,
  });
  return { isLoading, cabins, error };
}
export async function getImageUrl(path) {
  const { data } = supabase.storage.from("room-images").getPublicUrl(path);
  return data.publicUrl;
}
