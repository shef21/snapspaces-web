import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { Resend } from 'https://esm.sh/resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request payload
    const { booking, creative, client } = await req.json()

    // Initialize Resend with API key
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    // Send email to creative
    await resend.emails.send({
      from: 'Folioo <notifications@folioo.com>',
      to: creative.email,
      subject: 'New Booking Request',
      html: `
        <h1>New Booking Request</h1>
        <p>Hello ${creative.full_name},</p>
        <p>You have received a new booking request from ${client.full_name}.</p>
        <p>Booking Details:</p>
        <ul>
          <li>Date: ${new Date(booking.date).toLocaleDateString()}</li>
          <li>Time: ${booking.time}</li>
          <li>Duration: ${booking.duration} hours</li>
          <li>Location: ${booking.location}</li>
          <li>Notes: ${booking.notes || 'No additional notes'}</li>
        </ul>
        <p>Please log in to your Folioo account to accept or decline this booking request.</p>
        <p>Best regards,<br>The Folioo Team</p>
      `,
    })

    // Send confirmation email to client
    await resend.emails.send({
      from: 'Folioo <notifications@folioo.com>',
      to: client.email,
      subject: 'Booking Request Sent',
      html: `
        <h1>Booking Request Sent</h1>
        <p>Hello ${client.full_name},</p>
        <p>Your booking request has been sent to ${creative.full_name}.</p>
        <p>Booking Details:</p>
        <ul>
          <li>Date: ${new Date(booking.date).toLocaleDateString()}</li>
          <li>Time: ${booking.time}</li>
          <li>Duration: ${booking.duration} hours</li>
          <li>Location: ${booking.location}</li>
          <li>Notes: ${booking.notes || 'No additional notes'}</li>
        </ul>
        <p>We'll notify you once the creative responds to your request.</p>
        <p>Best regards,<br>The Folioo Team</p>
      `,
    })

    return new Response(
      JSON.stringify({ message: 'Notifications sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 