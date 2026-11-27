"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Rocket } from "lucide-react";
import PromoteButton from "@/components/promote/PromoteButton";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, NoteIcon } from "@/components/MusicIcons";
import { useMe, displayName, initials, roleLabel } from "@/lib/hooks/useMe";
import SellModal, { FEE_RATE, TYPE_LABEL, gbp, type Kind } from "@/components/marketplace/SellModal";

// GRID Marketplace: real listings, Stripe checkout (test mode), downloads after
// payment, and "Sell on GRID" to create listings. Same layout as before.

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);

type Listing = {
  id: string;
  kind: Kind;
  title: string;
  description: string | null;
  pricePence: number;
  payWhatYouWant: boolean;
  coverUrl: string | null;
  salesCount: number;
  createdAt: string;
  seller: { id: string; name: string; username: string | null };
  mine: boolean;
  promoted?: boolean;
  owned: boolean;
  orderId: string | null;
  downloadable: boolean;
};

const TABS: { label: string; kind: Kind | null }[] = [
  { label: "All", kind: null },
  { label: "Beats", kind: "beat" },
  { label: "Sample Packs", kind: "sample_pack" },
  { label: "Services", kind: "service" },
  { label: "Merch", kind: "merch" },
];
const COLOR: Record<Kind, string> = { beat: "bg-blue-800", sample_pack: "bg-emerald-800", service: "bg-purple-800", merch: "bg-zinc-800" };

type Receipt = { paid: boolean; orderId: string; title: string | null; kind: Kind | null; sellerId: string | null; sellerName: string; downloadable: boolean };

export default function MarketplacePage() {
  return (
    <Suspense fallback={null}>
      <Marketplace />
    </Suspense>
  );
}

function Marketplace() {
  const router = useRouter();
  const params = useSearchParams();
  const { me } = useMe();
  const myName = displayName(me?.profile, me?.user.email);

  const [tab, setTab] = useState<Kind | null>(null);
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Listing | null>(null);
  const [pricingMode, setPricingMode] = useState<"fixed" | "pwyw">("fixed");
  const [customPrice, setCustomPrice] = useState(0);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [paying, setPaying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [sellOpen, setSellOpen] = useState(false);

  const load = useCallback(() => {
    setLoadError(null);
    fetch(`/api/marketplace/listings${tab ? `?kind=${tab}` : ""}`, { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setListings(d.listings ?? []))
      .catch(() => setLoadError("Could not load the marketplace."));
  }, [tab]);
  useEffect(load, [load]);

  // Back from Stripe: confirm the payment and show the receipt.
  useEffect(() => {
    const sessionId = params.get("session_id");
    const status = params.get("purchase");
    if (status === "cancelled") {
      router.replace("/marketplace");
      return;
    }
    if (status !== "success" || !sessionId) return;
    fetch("/api/marketplace/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ sessionId }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.orderId) {
          setReceipt(d);
          setPurchaseSuccess(true);
          load();
        }
      })
      .catch(() => undefined)
      .finally(() => router.replace("/marketplace"));
  }, [params, router, load]);

  const handleBuyNow = (product: Listing) => {
    setSelectedProduct(product);
    setPricingMode("fixed");
    setCustomPrice(product.pricePence / 100);
    setPurchaseSuccess(false);
    setReceipt(null);
    setBuyError(null);
  };

  const finalPence = selectedProduct ? (pricingMode === "fixed" ? selectedProduct.pricePence : Math.round(customPrice * 100)) : 0;
  const feePence = Math.round(finalPence * FEE_RATE);
  const totalPence = finalPence + feePence;
  const belowMinimum = !!selectedProduct && finalPence < selectedProduct.pricePence;

  const handleConfirmPurchase = async () => {
    if (!selectedProduct || belowMinimum) return;
    setPaying(true);
    setBuyError(null);
    try {
      const res = await fetch("/api/marketplace/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ listingId: selectedProduct.id, pricePence: selectedProduct.payWhatYouWant ? finalPence : undefined }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.status === 401) return router.push("/login?redirect=/marketplace");
      if (!res.ok || !d.url) throw new Error(d.error || "Could not start checkout.");
      window.location.href = d.url;
    } catch (e) {
      setBuyError(e instanceof Error ? e.message : "Could not start checkout.");
      setPaying(false);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setPurchaseSuccess(false);
    setReceipt(null);
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen relative">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        <aside className="col-span-12 lg:col-span-3 space-y-3 hidden lg:block">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              {me?.profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={me.profile.avatar_url} alt={myName} className="w-20 h-20 mx-auto rounded-full object-cover ring-4 ring-white dark:ring-zinc-900 mb-3 bg-emerald-800" />
              ) : (
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">{me ? initials(myName) : ""}</div>
              )}
              <p className="font-bold text-gray-900 dark:text-white text-lg">{me ? myName : " "}</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{me ? roleLabel(me.profile.role, me.profile.genre) : " "}</p>
              {me?.profile.city && <p className="text-xs text-gray-500 mt-1">{me.profile.city}</p>}
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li><Link href="/marketplace" className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 transition-colors"><MarketIcon className="w-5 h-5 text-emerald-600" /> <span>Marketplace</span></Link></li>
                <li><Link href="/saved" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><BookmarkIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Saved Items</span></Link></li>
                <li><Link href="/groups" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><UsersIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Groups</span></Link></li>
                <li><Link href="/events" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><CalendarSVG className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Events</span></Link></li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2"><MarketIcon className="w-6 h-6 text-emerald-600" /> GRID Marketplace</h1>
            <p className="text-sm text-gray-500 mt-1">Buy and sell beats, sample packs, merch, and studio services.</p>
            <div className="flex gap-3 mt-4">
              <Link href="/seller" className="border border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold px-5 py-2.5 rounded-lg transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/20">Seller Dashboard</Link>
              <button type="button" onClick={() => (me ? setSellOpen(true) : router.push("/login?redirect=/marketplace"))} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm">+ Sell on GRID</button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-3 mt-4 flex flex-wrap gap-4 justify-center text-xs">
              <span className="flex items-center gap-1.5 text-gray-700 dark:text-zinc-300"><span className="text-emerald-600 font-bold">✓</span>Real GRID members</span>
              <span className="flex items-center gap-1.5 text-gray-700 dark:text-zinc-300"><span className="text-emerald-600 font-bold">✓</span>Secure checkout by Stripe</span>
              <span className="flex items-center gap-1.5 text-gray-700 dark:text-zinc-300"><span className="text-emerald-600 font-bold">✓</span>Sellers keep 100% of their price</span>
              <span className="flex items-center gap-1.5 text-gray-700 dark:text-zinc-300"><span className="text-emerald-600 font-bold">✓</span>Instant download</span>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {TABS.map((t) => (
              <button key={t.label} type="button" onClick={() => setTab(t.kind)} aria-pressed={tab === t.kind} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${tab === t.kind ? "bg-emerald-600 text-white" : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {loadError && <p role="alert" className="text-sm text-red-600">{loadError}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings === null
              ? [0, 1].map((i) => <div key={i} className="h-80 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm animate-pulse" />)
              : listings.length === 0 && (
                  <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-10 text-center">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">No {tab ? TABS.find((t) => t.kind === tab)?.label.toLowerCase() : "listings"} yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Be the first: sell your beats, sample packs, services or merch to the GRID community.</p>
                    <button type="button" onClick={() => (me ? setSellOpen(true) : router.push("/login?redirect=/marketplace"))} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm">+ Sell on GRID</button>
                  </div>
                )}
            {(listings ?? []).map((p) => (
              <div key={p.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden group hover:border-emerald-500 transition-colors">
                <div className={`h-40 ${COLOR[p.kind]} flex items-center justify-center relative`}>
                  {p.coverUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  <div className="w-16 h-16 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center relative">
                    <NoteIcon className="w-8 h-8 text-white" />
                  </div>
                  <span className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 text-gray-900 dark:text-white text-xs font-bold px-2 py-1 rounded-md">{TYPE_LABEL[p.kind]}</span>
                  {p.promoted && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-black/70 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      <Rocket className="w-3 h-3" aria-hidden="true" /> Promoted
                    </span>
                  )}
                  {p.payWhatYouWant && (
                    <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">💰 Pay What You Want</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{p.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    by {p.seller.username ? <Link href={`/u/${p.seller.username}`} className="hover:underline">{p.seller.name}</Link> : p.seller.name}
                  </p>
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">Price {p.payWhatYouWant ? "(or more)" : ""}</p>
                      <p className="font-bold text-emerald-600 text-lg">{gbp(p.pricePence)}</p>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">{p.salesCount > 0 ? `${p.salesCount} sold` : "New listing"}</p>
                      <p className="text-[10px] text-gray-500">Listed {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">GRID Fee (10%)</p>
                      <p className="text-xs text-gray-500">{gbp(Math.round(p.pricePence * FEE_RATE))}</p>
                    </div>
                  </div>
                  {p.mine ? (
                    <div className="mt-4 flex gap-2">
                    <Link href="/seller" className="flex-1 block text-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm py-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      Your listing
                    </Link>
                    {!p.promoted && <PromoteButton kind="listing" refId={p.id} label="Boost" className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors" />}
                    </div>
                  ) : p.owned && p.downloadable && p.orderId ? (
                    <a href={`/api/marketplace/download/${p.orderId}`} className="block text-center w-full mt-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm py-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      Download
                    </a>
                  ) : (
                    <button type="button" onClick={() => handleBuyNow(p)} className="w-full mt-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm py-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {p.owned ? "Buy again" : p.payWhatYouWant ? "Choose Price & Buy" : "Buy Now"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {(selectedProduct || purchaseSuccess) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            {purchaseSuccess && receipt ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{receipt.paid ? "Purchase Complete!" : "Payment processing"}</h2>
                <p className="text-sm text-gray-500">
                  {!receipt.paid
                    ? "We'll unlock your purchase as soon as the payment clears."
                    : receipt.downloadable
                      ? `${receipt.title ?? "Your item"} is yours. Download it below — it also stays available on this page.`
                      : `${receipt.sellerName} has been notified. Message them to arrange the details.`}
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  {receipt.paid && receipt.downloadable && (
                    <a href={`/api/marketplace/download/${receipt.orderId}`} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors">Download</a>
                  )}
                  {receipt.paid && !receipt.downloadable && receipt.sellerId && <MessageSeller sellerId={receipt.sellerId} title={receipt.title} />}
                  <button type="button" onClick={closeModal} className="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white">Close</button>
                </div>
              </div>
            ) : selectedProduct ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Complete Your Purchase</h2>
                  <button type="button" aria-label="Close" onClick={closeModal} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">&times;</button>
                </div>

                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-3 mb-4">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{selectedProduct.title}</p>
                  <p className="text-xs text-gray-500">by {selectedProduct.seller.name}</p>
                  {selectedProduct.description && <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-line line-clamp-4">{selectedProduct.description}</p>}
                </div>

                {selectedProduct.payWhatYouWant ? (
                  <>
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">Choose Your Price</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPricingMode("fixed")}
                          className={`py-2.5 rounded-lg border-2 font-bold text-sm transition-colors ${
                            pricingMode === "fixed" ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {gbp(selectedProduct.pricePence)}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPricingMode("pwyw")}
                          className={`py-2.5 rounded-lg border-2 font-bold text-sm transition-colors ${
                            pricingMode === "pwyw" ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          Pay More 💚
                        </button>
                      </div>
                    </div>

                    {pricingMode === "pwyw" && (
                      <div className="mb-4">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Your Price (£)</p>
                        <input
                          type="number"
                          min={selectedProduct.pricePence / 100}
                          step="0.01"
                          value={customPrice}
                          onChange={(e) => setCustomPrice(Number(e.target.value))}
                          className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                        />
                        <p className={`text-[10px] mt-1 ${belowMinimum ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                          {belowMinimum ? `Minimum is ${gbp(selectedProduct.pricePence)}.` : `Suggested: ${gbp(Math.round(selectedProduct.pricePence * 1.5))} — Support the artist!`}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Fixed Price</p>
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{gbp(selectedProduct.pricePence)}</p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-3 mb-4 space-y-1">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Item price:</span><span>{gbp(finalPence)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>GRID Fee (10%):</span><span>{gbp(feePence)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-zinc-700">
                    <span>Total:</span><span>{gbp(totalPence)}</span>
                  </div>
                </div>

                {buyError && <p role="alert" className="text-xs text-red-600 mb-3">{buyError}</p>}
                <button type="button" onClick={handleConfirmPurchase} disabled={paying || belowMinimum} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors">
                  {paying ? "Opening secure checkout…" : `Confirm Purchase — ${gbp(totalPence)}`}
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-2">You&apos;ll pay on Stripe&apos;s secure page.</p>
              </>
            ) : null}
          </div>
        </div>
      )}

      {sellOpen && (
        <SellModal
          onClose={() => setSellOpen(false)}
          onCreated={() => {
            setSellOpen(false);
            setTab(null);
            load();
          }}
        />
      )}
    </div>
  );
}

/** After buying a service or merch: open a chat with the seller. */
function MessageSeller({ sellerId, title }: { sellerId: string; title: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function open() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/messages/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otherUserId: sellerId }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.conversationId) throw new Error(d.error || "Could not open the chat.");
      router.push(`/messages/${d.conversationId}?draft=${encodeURIComponent(`Hi! I just bought “${title ?? "your listing"}” on GRID Marketplace.`)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open the chat.");
      setBusy(false);
    }
  }
  return (
    <>
      <button type="button" onClick={open} disabled={busy} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors">
        {busy ? "Opening…" : "Message seller"}
      </button>
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
    </>
  );
}
