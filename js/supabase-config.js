/**
 * supabase-config.js — connects both the admin panel and the public website
 * to your Supabase project.
 *
 * FILL IN THE TWO VALUES BELOW after creating your free Supabase project:
 *   1. Go to supabase.com -> your project -> Settings -> API
 *   2. Copy "Project URL" into SUPABASE_URL below
 *   3. Copy the "anon public" key (NOT the "service_role" key) into
 *      SUPABASE_ANON_KEY below
 *
 * SAFE TO PUBLISH: the anon/public key below is DESIGNED to be visible in
 * browser code — it's not a secret. Real security comes from the Row Level
 * Security (RLS) policies set up in supabase/schema.sql, which control what
 * this key is actually allowed to do (public read, admin-only write).
 *
 * NEVER put your "service_role" key anywhere in this project — that one
 * bypasses all security rules and must stay private, used only if you ever
 * build a separate server-side tool.
 */
const SUPABASE_URL = "https://wookdrzqutibhrukehoe.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_GMW4wHOvPk1OHkp00dIZLw_iev9ppCV";

const SUPABASE_CONFIGURED = !SUPABASE_URL.includes("YOUR_SUPABASE") && !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");

let supabaseClient = null;
if (SUPABASE_CONFIGURED && typeof supabase !== "undefined") {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
