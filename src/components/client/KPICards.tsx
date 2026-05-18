import { useState, useEffect } from "react"; // React hooks til at håndtere state og sideeffekter
import { supabase } from '../../lib/supabase'

type Period = 'week' | 'month' | 'quarter' | 'year'; // Typer for de forskellige perioder brugeren kan vælge imellem

function getDateRange(period: Period) { // Funktion til at beregne start- og slutdatoer for den valgte periode samt den forrige periode

    const now = new Date() // Vi bruger nuværende dato som referencepunkt for at beregne datointervallerne

    switch (period) { // Afhængigt af den valgte periode, beregner vi de relevante datointervaller
        case 'week': 
            return {
                current: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString(), // Startdato for nuværende uge 
                previous: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14).toISOString(), // Startdato for forrige uge
                previousEnd: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString() // Slutdato for forrige uge
            }
        case 'month':
            return {
                current: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(), // Startdato for nuværende måned f.eks. 1. maj 2026
                previous: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(), // Startdato for forrige måned f.eks. 1. april 2026
                previousEnd: new Date(now.getFullYear(), now.getMonth(), 0).toISOString(), // Slutdato for forrige måned f.eks. 30. april 2026
            }
        case 'quarter':
            return {
                current: new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString(), // Startdato for nuværende kvartal (3 måneder tilbage)
                previous: new Date(now.getFullYear(), now.getMonth() - 6, 1).toISOString(), // Startdato for forrige kvartal (6 måneder tilbage)
                previousEnd: new Date(now.getFullYear(), now.getMonth() - 3, 0).toISOString(), // Slutdato for forrige kvartal (3 måneder tilbage minus 1 dag)
            }
        case 'year':            
            return {
                current: new Date(now.getFullYear(), 0, 1).toISOString(), // Startdato for nuværende år f.eks. 1. januar 2026
                previous: new Date(now.getFullYear() - 1, 0, 1).toISOString(), // Startdato for forrige år f.eks. 1. januar 2025
                previousEnd: new Date(now.getFullYear(), 0, 0).toISOString(), // Slutdato for forrige år f.eks. 31. december 2025
            }
    }
}

interface KPIData { // Struktur for KPI-data og hvad det skal indeholde
    totalRevenue: number // Samlet omsætning i den valgte periode
    totalOrders: number // Antal ordrer i den valgte periode
    uniqueCustomers: number // Antal unikke kunder i den valgte periode
    avgOrderValue: number // Gennemsnitlig ordreværdi (total omsætning / antal ordrer) i den valgte periode
    changes: { // Procentvise ændringer sammenlignet med forrige periode
        revenue: {value: string, positive: boolean} // Ændring i omsætning, f.eks. "+10%" eller "-5%" og om det er positivt eller negativt
        orders: {value: string, positive: boolean} // Ændring i antal ordrer, f.eks. "+15%" eller "-8%" og om det er positivt eller negativt
        customers: {value: string, positive: boolean} // Ændring i antal unikke kunder, f.eks. "+20%" eller "-10%" og om det er positivt eller negativt
        avgOrder: {value: string, positive: boolean} // Ændring i gennemsnitlig ordreværdi, f.eks. "+5%" eller "-3%" og om det er positivt eller negativt
    }
}

interface KPICardProps { // Props for KPI-kort komponenten
    period: Period
}

export default function KPICards({ period }: KPICardProps) { // Hovedkomponenten der viser KPI-kort baseret på den valgte periode
    const [data, setData] = useState<KPIData | null>(null) // State til at gemme de beregnede KPI-data, initialiseret som null indtil data er hentet og beregnet
    const [loading, setLoading] = useState(true) // State til at håndtere loading-tilstand, initialiseret som true indtil data er hentet og beregnet

    useEffect(() => { // useEffect hook til at hente og beregne KPI-data når komponenten mountes eller når 'period' ændres
        async function fetchData() { 
            setLoading(true) 
            const range = getDateRange(period)

            const { data: currentOrders } = await supabase
                .from ('orders')
                .select('amount, customer_id')
                .gte('created_at', range.current)

            const { data: lastOrders } = await supabase
                .from ('orders') 
                .select ('amount, customer_id')
                .gte ('created_at', range.previous)
                .lte ('created_at', range.previousEnd) 
            
            if (!currentOrders ||!lastOrders) {
                setLoading(false)
                return
            }

            const totalRevenue = currentOrders.reduce((sum: number, o: { amount: number }) => sum + o.amount, 0)
            const totalOrders = currentOrders.length
            const uniqueCustomers = new Set(currentOrders.map((o: { customer_id: string }) => o.customer_id)).size
            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

            const lastRevenue = lastOrders.reduce((sum: number, o: { amount: number }) => sum + o.amount, 0)
            const lastTotalOrders = lastOrders.length
            const lastCustomers = new Set(lastOrders.map((o: { customer_id: string }) => o.customer_id)).size
            const lastAvg = lastTotalOrders > 0 ? lastRevenue / lastTotalOrders : 0

            const calcChange = (current: number, last: number) => {
                if (last === 0) return '+0%'
                const change = ((current - last) / last) * 100 
                return `${change >= 0 ? '+' : ''}${Math.round(change)}%`            
            }

            const isPositive = (current: number, last: number) => current >= last

            setData({
                totalRevenue,
                totalOrders,
                uniqueCustomers,
                avgOrderValue,
                changes: {
                    revenue: { value: calcChange(totalRevenue, lastRevenue), positive: isPositive(totalRevenue, lastRevenue) },
                    orders: { value: calcChange(totalOrders, lastTotalOrders), positive: isPositive(totalOrders, lastTotalOrders) },
                    customers: { value: calcChange(uniqueCustomers, lastCustomers), positive: isPositive(uniqueCustomers, lastCustomers) },
                    avgOrder: { value: calcChange(avgOrderValue, lastAvg), positive: isPositive(avgOrderValue, lastAvg) },
                }
            })
            setLoading(false)
        }

        fetchData()
    }, [period]) // Kør igen når period ændres 

    // Loading skeleton 
    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 p-4 bg-white animate-pulse">
                        <div className="h-3 bg-gray-100 rounded w-1/2 mb-3"></div>
                        <div className="h-6 bg-gray-100 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                    </div>
                ))}
            </div>                
        )
    }

    if (!data) return null

    const accentColors = [
        'bg-primary-light',
        'bg-kpi-green',
        'bg-kpi-amber',
        'bg-kpi-blue',
    ]

    const cards = [
        { 
            label: 'Omsætning',
            value: `${data.totalRevenue.toLocaleString('da-DK')} kr.`,
            change: data.changes.revenue.value,
            positive: data.changes.revenue.positive,
            featured: true,
        },
        {
            label: 'Ordrer',
            value: data.totalOrders.toString(),
            change: data.changes.orders.value,
            positive: data.changes.orders.positive,
            featured: false,
        },
        {
            label: 'Kunder',
            value: data.uniqueCustomers.toString(),
            change: data.changes.customers.value,
            positive: data.changes.customers.positive, 
            featured: false,
        },
        {
            label: 'Gns. ordreværdi',
            value: `${Math.round(data.avgOrderValue).toLocaleString('da-DK')} kr.`,
            change: data.changes.avgOrder.value,
            positive: data.changes.avgOrder.positive,
            featured: false
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {cards.map((card, index) => (
                <div 
                    key={card.label}
                    className={`rounded-xl border p-4 relative overflow-hidden ${
                    card.featured ? 'bg-sidebar border-sidebar' : 'bg-white border-gray-100'
                    }`}
                >

                    {/* Accent linje øverst */}
                    <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentColors[index]}`}></div>

                    {/* Label */}
                    <p className={`text-kpi-label uppercase tracking-wider mb-2 ${card.featured ? 'text-gray-400' : 'text-gray-400'}`}>
                        {card.label}
                    </p>

                    {/* Værdi */}
                    <p className={`text-kpi-value font-medium ${card.featured ? 'text-white' : 'text-gray-900'}`}>
                        {card.value}
                    </p>

                    {/* Change */}
                    <p className={`text-xs mt-1 ${card.positive ? 'text-kpi-green' : 'text-kpi-red'}`}>
                        {card.change} vs sidste periode
                    </p>
                </div>
            ))}
        </div>
    )
}