import { supabase } from "../lib/supabase";

export async function getOrders() {
    const { data, error } = await supabase
    .from('orders')
    .select(`
        id,
        amount,
        status,
        created_at,
        customers (name),
        products (name)
    `)
    .order('id', { ascending: false })

    if (error) {
        console.error('Fejl ved hentning af ordrer:', error)
        return []
    }

    return data
}