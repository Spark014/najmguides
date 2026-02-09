import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // In a real app, you would send an email here using Resend, SendGrid, etc.
        // For now, we'll just log it and return success.
        // We could also save to a "ContactMessage" table if we created one, 
        // but usually emails are preferred for contact forms.

        console.log("Contact Form Submission:", body)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error processing contact form:', error)
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        )
    }
}
