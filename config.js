// Collegamento a Supabase per sincronizzare i dati tra telefono e PC.
// Supabase › Project Settings › API (oppure il pulsante "Connect" in alto):
//   url: "Project URL", per esempio https://abcdefghijkl.supabase.co
//   key: la chiave "Publishable" (sb_publishable_...) oppure la vecchia "anon public".
// Queste due righe si possono pubblicare su GitHub: i dati di ognuno restano protetti
// dalle regole create con supabase.sql. Non mettere MAI qui la chiave "secret" o "service_role".
// Lasciale vuote per usare LiftLog solo su questo dispositivo, senza account.
window.LIFTLOG_SUPABASE = {
  url: "https://vcglqkvygguvkijqdzfq.supabase.co",
  key: "sb_publishable_wWf3ZhwQCJWioPG1C7Hvjg_bru3Dhs6"
};
