// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bmeqyeqzmwkavscvxaph.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZXF5ZXF6bXdrYXZzY3Z4YXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTg2OTYsImV4cCI6MjA2MDE5NDY5Nn0.eF1JAtZfFGwTtfWvIbejMs8CUMnvO97MO8Um9aXLasQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);