import supabase, { supabaseUrl } from "./supabase";

export async function getCabin() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data;
}

export async function createCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageid = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
  const imageurl = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageid}`;

  let query = supabase.from("cabins");

  if (!id) query = query.insert([{ ...newCabin, image: imageurl }]);

  if (id) query = query.update({ ...newCabin, image: imageurl }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be inserted");
  }

  if (hasImagePath) return data;

  const { error: imageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageid, newCabin.image);

  if (imageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(imageError);
    throw new Error(
      "Cabin image could not be uploaded , hence cabin was not created"
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }
  return data;
}
