-- Enable Row Level Security on Statistics table
ALTER TABLE "Statistics" ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows everyone to read statistics (since it's public data on the dashboard)
-- Or restrict it to admins if preferred, but usually stats are public.
-- For now, we'll allow public read access as implied by "public.Statistics is public"
CREATE POLICY "Enable read access for all users" ON "Statistics"
FOR SELECT
USING (true);

-- Only allow admins/service_role to update
CREATE POLICY "Enable update for service role only" ON "Statistics"
FOR ALL
USING (auth.role() = 'service_role');
