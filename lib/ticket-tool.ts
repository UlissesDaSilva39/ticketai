import { createClient } from '@supabase/supabase-js';
import { tool } from 'ai';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const createSupportTicket = tool({
  description: 'Create a support ticket ONLY when the user explicitly agrees after you offered to create one. Never call this without user confirmation.',
  inputSchema: z.object({
    subject: z.string().describe('Short summary of the user issue'),
    description: z.string().describe('Full description of the problem'),
    userEmail: z.string().email().optional().describe('User email if provided'),
  }),
  execute: async ({ subject, description, userEmail }) => {
    // TODO: Verify the actual table name and required columns in your
    // supabase-helpdesk migrations/001_initial_schema.sql after supabase db reset.
    const { data, error } = await supabase
      .from('tickets')  // <-- CHANGE IF DIFFERENT
      .insert({
        subject,
        description,
        status: 'new',
        priority: 'normal',
        requester_email: userEmail ?? null,
      })
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, ticketId: data.id };
  },
});
