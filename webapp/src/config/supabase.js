import { createClient } from "@supabase/supabase-js";

const supabaseUrl = window.configs.supabaseUrl;
const supabaseKey = window.configs.supabaseKey;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
