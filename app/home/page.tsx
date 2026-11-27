"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayIcon, MicIcon, SlidersIcon, NoteIcon, CalendarSVG, MarketIcon, BookmarkIcon, UsersIcon, HypeIcon, ReplyIcon } from "@/components/MusicIcons";
import OfferBanner from "@/components/home/OfferBanner";
import ProTrialCard from "@/components/home/ProTrialCard";
import InviteCard from "@/components/home/InviteCard";
import TrustStrip from "@/components/home/TrustStrip";
import CtaTracker from "@/components/home/CtaTracker";
import MobileProBar from "@/components/home/MobileProBar";
import MatchedForYou from "@/components/home/MatchedForYou";
import OpenCollabs from "@/components/home/OpenCollabs";
import ProfileStrength from "@/components/home/ProfileStrength";
import GridStories from "@/components/grid/GridStories";
import GridComposer, { type SavedPost } from "@/components/grid/GridComposer";
import HomeFeed from "@/components/home/HomeFeed";
import SuggestedPeople from "@/components/home/SuggestedPeople";
import { useMe, displayName, initials, roleLabel, compactNumber, type MeProfile } from "@/lib/hooks/useMe";
import ProBadge from "@/components/ProBadge";
import { LiveNowStrip, LiveSidebarLink } from "@/components/home/LiveNow";
import SponsoredCard from "@/components/ads/SponsoredCard";
import StartEarning from "@/components/home/StartEarning";
import { Rocket, Wallet } from "lucide-react";

const NAV_LINK = "flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-emerald-50/70 dark:hover:bg-zinc-800 transition-colors group";

// Profile-strength checklist built from the real profile. Edits happen on /profile/edit.
function profileStrengthItems(p: MeProfile) {
  const edit = "/profile/edit";
  const hasName = !!p.full_name && !p.full_name.includes("@");
  const hasLink = !!(p.website || p.instagram || p.twitter || p.spotify || p.youtube || p.soundcloud);
  return [
    { label: "Add your name", done: hasName, href: edit },
    { label: "Add a profile photo", done: !!p.avatar_url, href: edit },
    { label: "Write a short bio", done: !!p.bio, href: edit },
    { label: "Add your city", done: !!p.city, href: edit },
    { label: "Add your genre", done: !!p.genre, href: edit },
    { label: "Link your music or socials", done: hasLink, href: edit },
  ];
}

const VerifiedIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
);
const SparkleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/></svg>
);

export default function HomePage() {
  const router = useRouter();
  const { me, loading: meLoading } = useMe();
  const myName = displayName(me?.profile, me?.user.email);
  const isPro = !!me?.pro?.active;
  const [isPlaying, setIsPlaying] = useState(false);
  const trackRef = useRef<HTMLAudioElement>(null);
  function toggleTrack() {
    const a = trackRef.current;
    if (!a) return;
    if (a.paused) void a.play().catch(() => setIsPlaying(false));
    else a.pause();
  }
  const [postToast, setPostToast] = useState(false);
  const [newPost, setNewPost] = useState<SavedPost | null>(null);

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen relative">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <aside className="col-span-12 lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            {me?.profile.cover_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={me.profile.cover_image} alt="" className="h-20 w-full object-cover" />
            ) : (
              <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            )}
            <div className="p-5 -mt-10 text-center relative">
              {me?.profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={me.profile.avatar_url} alt={myName} className="w-20 h-20 mx-auto rounded-full object-cover ring-4 ring-white dark:ring-zinc-900 mb-3 bg-emerald-800" />
              ) : (
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">
                  {meLoading ? "" : initials(myName)}
                </div>
              )}
              {meLoading ? (
                <div className="space-y-2" aria-label="Loading your profile">
                  <div className="h-5 w-32 mx-auto rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-24 mx-auto rounded bg-gray-100 dark:bg-zinc-800 animate-pulse" />
                </div>
              ) : (
                <>
                  <p className="font-bold text-gray-900 dark:text-white text-lg flex items-center justify-center gap-1.5">
                    {myName}
                    {isPro && <ProBadge tier={me?.pro?.tier} />}
                  </p>
                  {me?.profile.username && <p className="text-xs text-gray-500">@{me.profile.username}</p>}
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{roleLabel(me?.profile.role, me?.profile.genre)}</p>
                  {me?.profile.city && <p className="text-xs text-gray-500 mt-1">{me.profile.city}</p>}
                </>
              )}
              
              <div className="mt-5 space-y-2">
                {me?.latestTrack ? (
                  <>
                    <button
                      type="button"
                      onClick={toggleTrack}
                      aria-pressed={isPlaying}
                      title={me.latestTrack.title}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-2"
                    >
                      <PlayIcon className="w-3.5 h-3.5" /> {isPlaying ? "Pause Track" : "Play Latest Track"}
                    </button>
                    <audio
                      ref={trackRef}
                      src={me.latestTrack.url}
                      preload="none"
                      onEnded={() => setIsPlaying(false)}
                      onPause={() => setIsPlaying(false)}
                      onPlay={() => setIsPlaying(true)}
                    />
                    {isPlaying && <p className="text-xs text-gray-500 truncate">&#9835; {me.latestTrack.title}</p>}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => document.getElementById("composer")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-2"
                  >
                    <PlayIcon className="w-3.5 h-3.5" /> Share your first track
                  </button>
                )}
                <Link href="/epk" className="w-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors block text-center">View EPK</Link>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-gray-100 dark:border-zinc-800 text-center">
                <div><p className="font-bold text-gray-900 dark:text-white text-base">{me ? compactNumber(me.counts.following) : "–"}</p><p className="text-[11px] text-gray-500 uppercase tracking-wide">Following</p></div>
                <div><p className="font-bold text-gray-900 dark:text-white text-base">{me ? compactNumber(me.counts.followers) : "–"}</p><p className="text-[11px] text-gray-500 uppercase tracking-wide">Followers</p></div>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              {me && <ProfileStrength items={profileStrengthItems(me.profile)} />}
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li><LiveSidebarLink className={NAV_LINK} /></li>
                <li><Link href="/earnings" className={NAV_LINK}><Wallet className="w-5 h-5 text-emerald-600" aria-hidden="true" /> <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Earnings</span></Link></li>
                <li><Link href="/boost" className={NAV_LINK}><Rocket className="w-5 h-5 text-emerald-600" aria-hidden="true" /> <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Boost</span></Link></li>
                <li><Link href="/marketplace" className={NAV_LINK}><MarketIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Marketplace</span></Link></li>
                <li><Link href="/saved" className={NAV_LINK}><BookmarkIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Saved Items</span></Link></li>
                <li><Link href="/groups" className={NAV_LINK}><UsersIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Groups</span></Link></li>
                <li><Link href="/events" className={NAV_LINK}><CalendarSVG className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Events</span></Link></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN */}
        <main className="col-span-12 lg:col-span-6 space-y-4">
          <CtaTracker />
          {!isPro && <MobileProBar />}
          <OfferBanner />
          
          {/* STORIES */}
          <GridStories myName={myName} myAvatar={me?.profile.avatar_url ?? null} />

          {/* "Start earning" checklist (hidden once complete or dismissed) */}
          <StartEarning />

          {/* Who's live right now (GRID LIVE) */}
          <LiveNowStrip />

          {/* Opportunities ranked for this user (/api/matches) */}
          <MatchedForYou isPro={isPro} />

          {/* Composer (photo/video/audio/event posts) */}
          <div id="composer" />
          <GridComposer
            userName={myName}
            userInitial={me ? initials(myName) : ""}
            userAvatar={me?.profile.avatar_url ?? null}
            audioIcon={<NoteIcon className="w-4 h-4" />}
            eventIcon={<CalendarSVG className="w-4 h-4" />}
            onPublished={(post) => {
              setNewPost(post);
              setPostToast(true);
              setTimeout(() => setPostToast(false), 3000);
            }}
          />

          {/* Real feed from the posts table */}
          <HomeFeed
            newPost={newPost}
            me={
              me
                ? {
                    id: me.user.id,
                    name: myName,
                    username: me.profile.username,
                    avatar: me.profile.avatar_url ?? null,
                    role: me.profile.role,
                    genre: me.profile.genre ?? null,
                    tier: (me.pro?.tier as "free" | "pro" | "premium" | undefined) ?? "free",
                  }
                : null
            }
          />

        </main>

        {/* RIGHT COLUMN */}
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          {!isPro && !meLoading && <ProTrialCard />}
          <InviteCard />
          <SponsoredCard />
          <OpenCollabs />

          <SuggestedPeople />
        </aside>
      </div>

      {/* PUBLISH TOAST */}
      {postToast && (
        <div role="status" className="fixed bottom-8 right-8 z-50 bg-zinc-900 text-white pl-3 pr-6 py-3 rounded-xl shadow-xl ring-1 ring-white/10 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-emerald-600 grid place-items-center flex-none" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
          </span>
          <span>
            <span className="block font-bold">Posted</span>
            <span className="block text-xs text-gray-400">Your update is live on your network.</span>
          </span>
        </div>
      )}

    </div>
  );
}