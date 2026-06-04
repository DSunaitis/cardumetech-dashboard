import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vahqyknaturusguypuua.supabase.co/rest/v1/";

const supabaseKey = "sb_publishable_Gn5D1Wy8hKMF-Mtl03htxA_Ithysm6N";

export const supabase = createClient(supabaseUrl, supabaseKey);
``