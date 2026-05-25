import * as dotenv from 'dotenv' 
dotenv.config()

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY as string

export const supabase = createClient(supabaseUrl, supabaseServiceKey)