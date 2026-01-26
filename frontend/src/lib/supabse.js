import { createClient } from "@supabase/supabase-js";

const supabseUrl = import.meta.env.mouwpfudiqrvwfdfreoa.supabase.co
const supabaseAnonKey = import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdXdwZnVkaXFydndmZGZyZW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMzg2NzIsImV4cCI6MjA4NDkxNDY3Mn0.u60N8vWpw7KODUI_vwkkGA4mD9i19BJZ6BvrPVvHn8Y

export const supabase = createClient(supabseUrl, supabaseAnonKey);
