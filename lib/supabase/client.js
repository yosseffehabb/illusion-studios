import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lbyhpfxypfhdmddvbsjy.supabase.co";
const supabaseAnonKey = "sb_publishable_gBTB-LZHORhIA9fJ8GBXoQ_XzomMsVm"; // Paste the real key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
