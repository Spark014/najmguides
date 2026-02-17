-- Fix RLS Policies for JoinRequest and TripRequest

-- Drop duplicate policies for JoinRequest
DROP POLICY IF EXISTS "Enable insert access for all users" ON "JoinRequest";
DROP POLICY IF EXISTS "Enable insert for everyone" ON "JoinRequest";

-- Create a single, clear policy for JoinRequest
CREATE POLICY "Enable public insert for JoinRequest" ON "JoinRequest"
FOR INSERT
WITH CHECK (true); -- Public form submission, so true is acceptable but explicit

-- Drop duplicate policies for TripRequest
DROP POLICY IF EXISTS "Enable insert access for all users" ON "TripRequest";
DROP POLICY IF EXISTS "Enable insert for everyone" ON "TripRequest";

-- Create a single, clear policy for TripRequest
CREATE POLICY "Enable public insert for TripRequest" ON "TripRequest"
FOR INSERT
WITH CHECK (true); -- Public form submission
