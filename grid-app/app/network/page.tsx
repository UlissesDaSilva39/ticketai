import { getCardsForTab } from "@/lib/data";
import NetworkCard from "@/components/NetworkCard";
import NetworkTabs from "@/components/NetworkTabs";

export default function NetworkPage({ searchParams }: { searchParams: { tab?: string } }) {
  const tab = searchParams.tab || "everyone";
  const cards = getCardsForTab(tab);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Network</h1>
          <p>Connect with the people building music.</p>
        </div>
      </div>

      <div className="search-row">
        <input className="search" placeholder="Search artists, DJs, producers, managers, promoters..." />
        <button className="btn primary">Search</button>
      </div>

      <NetworkTabs />

      <h2 style={{ fontSize: 18, margin: "16px 0" }}>People you may know ({cards.length})</h2>

      <div className="results-grid">
        {cards.map(c => <NetworkCard key={c.id} card={c} />)}
      </div>
    </>
  );
}
