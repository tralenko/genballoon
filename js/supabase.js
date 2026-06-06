const supabaseUrl = "https://dnfzmmytdonyrrzdxnzb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZnptbXl0ZG9ueXJyemR4bnpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyODE3NTUsImV4cCI6MjA5NTg1Nzc1NX0.HlCNlOancnoiEknx81YN5_ALTsdmTY6mwn9P3RxnkiY";

window.supabaseClient = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);