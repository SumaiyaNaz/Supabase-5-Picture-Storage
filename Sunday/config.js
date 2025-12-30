import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://yzeojxkfombjqjwtgmtp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZW9qeGtmb21ianFqd3RnbXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzQxOTMsImV4cCI6MjA3NjMxMDE5M30.bIzSezX82_ok90aELjCAazvsY7eleOpQkprsZPMVIDE'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;