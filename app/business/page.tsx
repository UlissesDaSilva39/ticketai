"use client";
import Link from "next/link";

export default function BusinessPage() {
  return (
    <div className="page-container">
      <div className="page-header" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <p style={{ color: "#16A36A", fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
          GRID for Business
        </p>
        <h1 className="page-title">Keep your ticket revenue.<br />Own your audience.</h1>
        <p className="page-subtitle" style={{ maxWidth: "800px", marginBottom: "32px" }}>
          GRID connects your listings to a network of music fans, artists, and industry professionals. 
          We don't sell tickets. We take no commission on outbound ticket links.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/business/list" className="btn-primary">List an Event</Link>
          <Link href="/business/claim" className="btn-secondary">Claim Your Profile</Link>
        </div>
      </div>

      <div style={{ marginBottom: "64px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "32px" }}>Why list on GRID?</h2>
        
        <div className="grid-cards">
          <div className="card">
            <h3 className="card-title" style={{ fontSize: "20px", marginBottom: "12px" }}>Keep 100% of Revenue</h3>
            <p className="card-subtitle" style={{ fontSize: "15px", lineHeight: 1.6 }}>
              No booking fees. No commission on outbound ticket links. We link to your existing ticket page so you keep what you earn.
            </p>
          </div>
          
          <div className="card">
            <h3 className="card-title" style={{ fontSize: "20px", marginBottom: "12px" }}>Own Your Audience</h3>
            <p className="card-subtitle" style={{ fontSize: "15px", lineHeight: 1.6 }}>
              Unlike Ticketmaster, we don't hide the buyer from you. Build a direct relationship with your fans.
            </p>
          </div>
          
          <div className="card">
            <h3 className="card-title" style={{ fontSize: "20px", marginBottom: "12px" }}>Real Insights</h3>
            <p className="card-subtitle" style={{ fontSize: "15px", lineHeight: 1.6 }}>
              See how many fans viewed your event this week. Data you can actually use to sell more tickets.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "64px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "12px" }}>Your tools</h2>
        <p style={{ fontSize: "16px", color: "#94A3B8", marginBottom: "32px" }}>
          Choose the dashboard that matches your role. Your profile and audience are shared across all of them.
        </p>
        
        <div className="grid-cards">
          <Link href="/dashboard/organiser" className="card">
            <h3 className="card-title">Organiser</h3>
            <p className="card-subtitle" style={{ marginBottom: "16px" }}>
              List events. Track clicks. Keep 100% of ticket revenue.
            </p>
            <span style={{ color: "#16A36A", fontWeight: 600, fontSize: "14px" }}>Open dashboard →</span>
          </Link>
          
          <Link href="/dashboard/promoter" className="card">
            <h3 className="card-title">Promoter</h3>
            <p className="card-subtitle" style={{ marginBottom: "16px" }}>
              See who's clicking. Build your audience. No platform fees.
            </p>
            <span style={{ color: "#16A36A", fontWeight: 600, fontSize: "14px" }}>Open dashboard →</span>
          </Link>
          
          <Link href="/dashboard/venue" className="card">
            <h3 className="card-title">Venue</h3>
            <p className="card-subtitle" style={{ marginBottom: "16px" }}>
              Claim your venue. Get discovered. Fill your room.
            </p>
            <span style={{ color: "#16A36A", fontWeight: 600, fontSize: "14px" }}>Open dashboard →</span>
          </Link>
          
          <Link href="/dashboard/artist" className="card">
            <h3 className="card-title">Artist</h3>
            <p className="card-subtitle" style={{ marginBottom: "16px" }}>
              Get booked. Share your EPK. Connect with promoters.
            </p>
            <span style={{ color: "#16A36A", fontWeight: 600, fontSize: "14px" }}>Open dashboard →</span>
          </Link>
          
          <Link href="/dashboard/label" className="card">
            <h3 className="card-title">Label</h3>
            <p className="card-subtitle" style={{ marginBottom: "16px" }}>
              Manage your roster. Track artist reach.
            </p>
            <span style={{ color: "#16A36A", fontWeight: 600, fontSize: "14px" }}>Open dashboard →</span>
          </Link>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "64px 32px", background: "#172033", border: "1px solid #293548", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "16px" }}>Not listed yet?</h2>
        <p style={{ fontSize: "16px", color: "#94A3B8", marginBottom: "32px" }}>
          Claim a profile or list your first event. It is free to start.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/discover" className="btn-secondary">Explore GRID</Link>
          <Link href="/register/artist" className="btn-primary">Register as artist</Link>
        </div>
      </div>
    </div>
  );
}
