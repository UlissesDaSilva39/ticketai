# Manual integration steps

The script created components only. It deliberately did **not** edit your
existing pages. Below is where each component should be wired in.

1. Business tab: wrap the Business layout's children with a mode switch
   using `<ModeToggle />` from `components/ui/ModeToggle.tsx`.
   The dashboard should only render when mode === "business".

2. Network page: import `<RoleChips />` and hold a `Role` state in the
   page; pass it to your existing people query as a filter.

3. Artist page: replace the current header block with
   `<FullBleedHeader imageUrl=... name=... subtitle=... />`.
   Everything below the header is unchanged.

4. Business dashboard: import `<KpiRow />` and pass the three stats you
   already fetch for Insights (views, ticket clicks, saves).

5. Event page: replace the "Get tickets" button block with
   `<TicketCTA status={event.status} ticketUrl={event.ticketUrl} />`.
   If your event model has no `status` field yet, derive it:
     ticketUrl missing -> "unavailable"
     sold-out marker present -> "sold_out"
     otherwise -> "on_sale"

None of these steps touch app/api/, .env files, Stripe, or Supabase
queries beyond the additive `profiles.role` column.
