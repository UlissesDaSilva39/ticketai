import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DISTRIBUTION_BUCKET, checkRelease, isReady } from "@/lib/distribution/checks";
import { EDITABLE_STATUSES, RELEASE_COLUMNS, TRACK_COLUMNS, sanitizeInput, toInput, type ReleaseRow, type TrackRow } from "@/lib/distribution/server";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };
const UUID = /^[0-9a-f-]{36}$/i;

async function load(id: string) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Not signed in" }, { status: 401 }) } as const;
  if (!UUID.test(id)) return { error: NextResponse.json({ error: "Release not found" }, { status: 404 }) } as const;
  // RLS: only the owner can read the release.
  const { data: release } = await supabase.from("releases").select(RELEASE_COLUMNS).eq("id", id).maybeSingle();
  if (!release) return { error: NextResponse.json({ error: "Release not found" }, { status: 404 }) } as const;
  return { user, release: release as ReleaseRow } as const;
}

// GET /api/distribution/releases/<id>: the release, its tracks, checks and an artwork preview link.
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const r = await load(id);
  if ("error" in r) return r.error;
  const admin = createAdminClient();
  const { data: tracks } = await admin.from("release_tracks").select(TRACK_COLUMNS).eq("release_id", id).order("position");
  const input = toInput(r.release, (tracks ?? []) as TrackRow[]);
  let artworkUrl: string | null = null;
  if (r.release.artwork_path) {
    const { data } = await admin.storage.from(DISTRIBUTION_BUCKET).createSignedUrl(r.release.artwork_path, 3600);
    artworkUrl = data?.signedUrl ?? null;
  }
  return NextResponse.json({
    id,
    status: r.release.status,
    notifyOnLaunch: r.release.notify_on_launch,
    updatedAt: r.release.updated_at,
    release: input,
    artworkUrl,
    checks: checkRelease(input),
  });
}

// PATCH /api/distribution/releases/<id>: save the whole editor state.
// Status becomes "ready" when every required check passes, otherwise "draft".
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const r = await load(id);
  if ("error" in r) return r.error;
  if (!EDITABLE_STATUSES.includes(r.release.status)) {
    return NextResponse.json({ error: "This release has been submitted and can't be edited here." }, { status: 409 });
  }

  const body = await req.json().catch(() => ({}));
  const { input, invalidCodes } = sanitizeInput(body, r.user.id);
  const checks = checkRelease(input);
  const status = isReady(checks) ? "ready" : "draft";
  const admin = createAdminClient();

  const { error } = await admin
    .from("releases")
    .update({
      title: input.title,
      primary_artist: input.primaryArtist,
      release_type: input.releaseType,
      genre: input.genre,
      language: input.language,
      label_name: input.labelName,
      copyright_line: input.copyrightLine,
      release_date: input.releaseDate,
      upc: input.upc,
      explicit: input.explicit,
      artwork_path: input.artworkPath,
      artwork_width: input.artworkWidth,
      artwork_height: input.artworkHeight,
      rights_confirmed_at: input.rightsConfirmed ? r.release.rights_confirmed_at ?? new Date().toISOString() : null,
      notify_on_launch: body.notifyOnLaunch !== false,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("owner_id", r.user.id);
  if (error) {
    console.error("[distribution/releases PATCH]", error.message);
    return NextResponse.json({ error: "Could not save. Please try again." }, { status: 500 });
  }

  // Replace the track list in order.
  await admin.from("release_tracks").delete().eq("release_id", id);
  if (input.tracks.length) {
    const { error: tErr } = await admin.from("release_tracks").insert(
      input.tracks.map((t, i) => ({
        release_id: id,
        position: i + 1,
        title: t.title,
        version: t.version,
        featured_artists: t.featuredArtists,
        composers: t.composers,
        producers: t.producers,
        isrc: t.isrc,
        explicit: t.explicit,
        audio_path: t.audioPath,
        audio_name: t.audioName,
      }))
    );
    if (tErr) {
      console.error("[distribution/releases PATCH tracks]", tErr.message);
      return NextResponse.json({ error: "Saved the release, but not the tracks. Please save again." }, { status: 500 });
    }
  }

  return NextResponse.json({ status, checks, invalidCodes, savedAt: new Date().toISOString() });
}

// DELETE /api/distribution/releases/<id>: delete a draft or ready release and its files.
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const r = await load(id);
  if ("error" in r) return r.error;
  if (!EDITABLE_STATUSES.includes(r.release.status)) {
    return NextResponse.json({ error: "Submitted releases can't be deleted here." }, { status: 409 });
  }
  const admin = createAdminClient();
  const { data: tracks } = await admin.from("release_tracks").select("audio_path").eq("release_id", id);
  const paths = [r.release.artwork_path, ...(tracks ?? []).map((t) => t.audio_path)].filter((p): p is string => !!p);
  await admin.from("releases").delete().eq("id", id).eq("owner_id", r.user.id);
  if (paths.length) await admin.storage.from(DISTRIBUTION_BUCKET).remove(paths).catch(() => undefined);
  return NextResponse.json({ deleted: true });
}
