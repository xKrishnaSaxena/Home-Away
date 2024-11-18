import { createClient, SupabaseClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://fkdxtsxvhjofdsrhebxq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZHh0c3h2aGpvZmRzcmhlYnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU1ODgzMTAsImV4cCI6MjAyMTE2NDMxMH0.Mb-cGqKWI5xx3Yx0wh4mK7jnuomQeqXpkm_cEfXLwAo";

const supabase:SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabase;
