
import fs from 'fs'
import path from 'path'

// Manually read .env
const envPath = path.resolve(process.cwd(), '.env')
const envFile = fs.readFileSync(envPath, 'utf-8')
const envVars = envFile.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=')
    if (key && value) {
        acc[key.trim()] = value.trim().replace(/^["']|["']$/g, '')
    }
    return acc
}, {} as Record<string, string>)

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY

async function main() {
    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase URL or Key in .env')
        return
    }

    console.log(`Testing connection to ${supabaseUrl}...`)

    try {
        // Test REST API (health check or list tables)
        // We'll try to fetch the Swagger spec or just the root
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        })

        console.log('Response Status:', response.status)
        console.log('Response Text:', await response.text())

        if (response.ok) {
            console.log('SUCCESS: Supabase REST API is reachable.')
        } else {
            console.error('FAILURE: Supabase REST API returned an error.')
        }

    } catch (error) {
        console.error('NETWORK ERROR:', error)
    }
}

main()
