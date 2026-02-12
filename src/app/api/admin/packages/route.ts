
import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server" // Keep for GET (public access)
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { data, error } = await supabase
            .from('Package')
            .select('*')
            .order('order', { ascending: true })

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching packages:", error)
        return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Use service role to bypass RLS
        const supabase = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Get max order to append
        const { data: maxOrderData } = await supabase
            .from('Package')
            .select('order')
            .order('order', { ascending: false })
            .limit(1)
            .single()

        const nextOrder = (maxOrderData?.order || 0) + 1

        const { data, error } = await supabase
            .from('Package')
            .insert([{ ...body, order: nextOrder }])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error creating package:", error)
        return NextResponse.json({ error: "Failed to create package" }, { status: 500 })
    }
}
