const fs = require("fs");
const p = "app/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

const oldCard = `                <Link
                  key={e.id}
                  href={"/event/" + e.id}
                  className="group block overflow-hidden rounded-xl border bg-white transition hover:border-black"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {e.hero_image ? (
                      <img
                        src={e.hero_image}
                        alt={e.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      {formatEventDate(e.start_date)}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight">
                      {e.title}
                    </h3>
                    {from !== null && (
                      <p className="mt-3 text-sm font-medium">
                        From £{from.toFixed(2)}
                      </p>
                    )}

                    <MiniFriendsGoing
                      eventId={e.id}
                      friends={(goingUsersByEvent[e.id] || [])
                        .filter((u) => u.isFriend)
                        .map((u) => ({ id: u.id, name: u.name }))}
                      totalCount={(interestByEvent[e.id] || { going: 0 }).going}
                    />

                    <div className="mt-3">
                      <MiniInterestButtons
                        eventId={e.id}
                        initialStatus={(interestByEvent[e.id] || { mine: null }).mine}
                        isSignedIn={!!currentUser}
                        initialInterested={(interestByEvent[e.id] || { interested: 0 }).interested}
                        initialGoing={(interestByEvent[e.id] || { going: 0 }).going}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      {e.organizer_id && (
                        <MiniFollowButton
                          targetType="promoter"
                          targetId={e.organizer_id}
                          initialCount={followerCountByOrganizer[e.organizer_id] || 0}
                        />
                      )}
                      <div className="flex items-center gap-1">
                        <ShareButtonMini
                          url={"https://ticketai.org.uk/event/" + e.id}
                          title={e.title}
                        />
                        <span className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium">Get Tickets</span>
                      </div>
                    </div>
                  </div>
                </Link>`;

const newCard = `                <div
                  key={e.id}
                  className="group overflow-hidden rounded-xl border bg-white transition hover:border-black"
                >
                  <Link
                    href={"/event/" + e.id}
                    className="block"
                  >
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      {e.hero_image ? (
                        <img
                          src={e.hero_image}
                          alt={e.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    <div className="px-5 pt-5">
                      <p className="text-xs uppercase tracking-widest text-gray-500">
                        {formatEventDate(e.start_date)}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold leading-tight">
                        {e.title}
                      </h3>
                      {from !== null && (
                        <p className="mt-3 text-sm font-medium">
                          From £{from.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </Link>

                  <div className="px-5 pb-5 pt-2">
                    <MiniFriendsGoing
                      eventId={e.id}
                      friends={(goingUsersByEvent[e.id] || [])
                        .filter((u) => u.isFriend)
                        .map((u) => ({ id: u.id, name: u.name }))}
                      totalCount={(interestByEvent[e.id] || { going: 0 }).going}
                    />

                    <div className="mt-3">
                      <MiniInterestButtons
                        eventId={e.id}
                        initialStatus={(interestByEvent[e.id] || { mine: null }).mine}
                        isSignedIn={!!currentUser}
                        initialInterested={(interestByEvent[e.id] || { interested: 0 }).interested}
                        initialGoing={(interestByEvent[e.id] || { going: 0 }).going}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      {e.organizer_id && (
                        <MiniFollowButton
                          targetType="promoter"
                          targetId={e.organizer_id}
                          initialCount={followerCountByOrganizer[e.organizer_id] || 0}
                        />
                      )}
                      <div className="flex items-center gap-1">
                        <ShareButtonMini
                          url={"https://ticketai.org.uk/event/" + e.id}
                          title={e.title}
                        />
                        <Link
                          href={"/event/" + e.id}
                          className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium"
                        >
                          Get Tickets
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>`;

if (t.includes(oldCard)) {
  t = t.replace(oldCard, newCard);
  fs.writeFileSync(p, t);
  console.log("Card restructured: buttons now outside <Link>.");
} else {
  console.log("Card anchor not found — checking variants.");
  const i = t.indexOf('<MiniFollowButton');
  console.log(JSON.stringify(t.slice(i - 300, i + 200)));
}