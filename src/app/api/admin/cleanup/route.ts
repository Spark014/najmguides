
import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function POST() {
    try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        // 1. Find Completed trips to count them before deletion
        const { count: completedTripRequests, error: errorTrip } = await supabase
            .from('TripRequest')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Completed')

        if (errorTrip) throw errorTrip

        const { count: completedJoinRequests, error: errorJoin } = await supabase
            .from('JoinRequest')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Completed')

        if (errorJoin) throw errorJoin

        const totalCompletedToAdd = (completedTripRequests || 0) + (completedJoinRequests || 0)

        // 2. Update Statistics
        if (totalCompletedToAdd > 0) {
            // First get current stats
            const { data: currentStats, error: fetchError } = await supabase
                .from('Statistics')
                .select('totalCompletedTrips')
                .eq('id', 'global')
                .single()

            if (fetchError && fetchError.code !== 'PGRST116') { // Ignore 'PGRST116' (no rows)
                throw fetchError
            }

            // Actually, maybeSingle is better
            const { data: currentStatsData, error: statsError } = await supabase
                .from('Statistics')
                .select('totalCompletedTrips')
                .eq('id', 'global')
                .maybeSingle()

            if (statsError) throw statsError

            const currentCount = currentStatsData?.totalCompletedTrips || 0
            const newCount = currentCount + totalCompletedToAdd

            const { error: upsertError } = await supabase
                .from('Statistics')
                .upsert({
                    id: 'global',
                    totalCompletedTrips: newCount,
                    updatedAt: new Date().toISOString()
                })

            if (upsertError) throw upsertError
        }

        // 3. Delete 'Completed' trips immediately (Count and Forget)
        // We do NOT delete 'Archived' anymore here.
        const { error: deleteCompletedTripError } = await supabase
            .from('TripRequest')
            .delete()
            .eq('status', 'Completed')

        if (deleteCompletedTripError) throw deleteCompletedTripError

        const { error: deleteCompletedJoinError } = await supabase
            .from('JoinRequest')
            .delete()
            .eq('status', 'Completed')

        if (deleteCompletedJoinError) throw deleteCompletedJoinError

        // 4. Delete 'Deleted' items older than 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

        const { count: deletedTripRequestsCount, error: deleteTripError } = await supabase
            .from('TripRequest')
            .delete({ count: 'exact' })
            .eq('status', 'Deleted')
            .lt('deletedAt', twentyFourHoursAgo)

        if (deleteTripError) throw deleteTripError

        const { count: deletedJoinRequestsCount, error: deleteJoinError } = await supabase
            .from('JoinRequest')
            .delete({ count: 'exact' })
            .eq('status', 'Deleted')
            .lt('deletedAt', twentyFourHoursAgo)

        if (deleteJoinError) throw deleteJoinError

        return NextResponse.json({
            success: true,
            deletedTripRequests: deletedTripRequestsCount,
            deletedJoinRequests: deletedJoinRequestsCount,
            addedToStats: totalCompletedToAdd
        })
    } catch (error) {
        console.error('Cleanup error:', error)
        return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
    }
}
