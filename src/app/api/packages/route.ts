import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { data: packages, error } = await supabase
            .from('Package')
            .select('*')
            .order('order', { ascending: true })

        if (error) {
            console.error('Error fetching packages:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(packages)
    } catch (error) {
        console.error('Error in packages route:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
