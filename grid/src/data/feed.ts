export interface Post {
  id: string;
  author: string;
  when: string;
  body: string;
  likes: number;
  comments: number;
  shares: number;
  group?: "Yesterday" | "This week";
}

export const posts: Post[] = [
  { id: "p1",  author: "Someone",           when: "yesterday", body: "Video  House Music",                        likes: 0, comments: 0,  shares: 0,  group: "Yesterday" },
  { id: "p2",  author: "Someone",           when: "yesterday", body: "tesst",                                    likes: 0, comments: 0,  shares: 0,  group: "Yesterday" },
  { id: "p3",  author: "Someone",           when: "yesterday", body: "New release",                              likes: 0, comments: 0,  shares: 1,  group: "Yesterday" },
  { id: "p4",  author: "Someone",           when: "yesterday", body: "New Video Clip house music 2026",          likes: 0, comments: 0,  shares: 0,  group: "Yesterday" },
  { id: "p5",  author: "Someone",           when: "yesterday", body: "New Music and Video Released House Music 2026", likes: 0, comments: 0, shares: 0, group: "Yesterday" },
  { id: "p6",  author: "Someone",           when: "yesterday", body: "Hello I have a great house music veneu to rent", likes: 0, comments: 0, shares: 0, group: "Yesterday" },
  { id: "p7",  author: "Someone",           when: "yesterday", body: "Hello , that is great veneus to have aprty in london", likes: 4, comments: 0, shares: 0, group: "This week" },
  { id: "p8",  author: "Someone",           when: "yesterday", body: "Great - when wil start ? do you have the dates etc.",   likes: 0, comments: 0, shares: 0, group: "This week" },

  { id: "p9",  author: "Amelia Grant",      when: "2d ago", body: "Just wrapped a late-night session. This one is going to be special.",           likes: 7, comments: 6,  shares: 5 },
  { id: "p10", author: "Lily Moore",        when: "2d ago", body: "Best gig I've been to this year was in a tiny room in Hackney. Sound was unreal.", likes: 4, comments: 1,  shares: 3 },
  { id: "p11", author: "Oliver Kaine",      when: "2d ago", body: "New signings incoming. Watch this space.",                                  likes: 0, comments: 6,  shares: 2 },
  { id: "p12", author: "Tide & Time",       when: "2d ago", body: "Pop is the hardest genre to write well. Nobody talks about it.",            likes: 3, comments: 9,  shares: 5 },
  { id: "p13", author: "Rachel Sterling",   when: "2d ago", body: "Working on something with strings. Very different for me.",                 likes: 4, comments: 5,  shares: 0 },
  { id: "p14", author: "Maya Chandran",     when: "3d ago", body: "Anyone got recommendations for good monitors under £500?",                  likes: 0, comments: 2,  shares: 3 },
  { id: "p15", author: "Northlight Music",  when: "3d ago", body: "Berlin next month. First time playing there. Nervous and buzzing.",         likes: 7, comments: 1,  shares: 6 },
  { id: "p16", author: "Alex Morgan",       when: "3d ago", body: "Anyone got recommendations for good reference monitors under £500?",        likes: 1, comments: 2,  shares: 1 },
  { id: "p17", author: "Daniel Kim",        when: "3d ago", body: "Indie rock is having a real moment. The kids are alright.",                 likes: 2, comments: 2,  shares: 6 },
  { id: "p18", author: "Ethan Brooks",      when: "3d ago", body: "Ambient music gets me through 4-hour deep work sessions. Underrated genre.",likes: 4, comments: 6,  shares: 3 },
  { id: "p19", author: "Luke Harrison",     when: "4d ago", body: "Sometimes the demo is better than the final cut. Fight me.",                likes: 5, comments: 7,  shares: 4 },
  { id: "p20", author: "Hexagon Music",     when: "4d ago", body: "Studio time booked for next week. Three days. Let's see what comes out.",   likes: 7, comments: 1,  shares: 1 },
  { id: "p21", author: "Zoe Hart",          when: "4d ago", body: "A&R tip: listen to the rough mixes. The rawness is what makes it.",          likes: 7, comments: 11, shares: 7 },
  { id: "p22", author: "Cathedral Sound",   when: "4d ago", body: "Collaborators wanted for an ambient project. DM if interested.",            likes: 0, comments: 14, shares: 2 },
  { id: "p23", author: "Charlotte Dean",    when: "4d ago", body: "Just heard the new Paper Lions record. Absolutely stunning work.",           likes: 7, comments: 14, shares: 1 },
  { id: "p24", author: "Paper Boat Records",when: "4d ago", body: "The Glasgow scene deserves way more attention than it gets.",               likes: 4, comments: 8,  shares: 7 },
  { id: "p25", author: "Nathan Cole",       when: "4d ago", body: "Hip hop is evolving so fast I can barely keep up. Love it.",                 likes: 1, comments: 14, shares: 4 },
  { id: "p26", author: "Blue Tower Records",when: "5d ago", body: "Residency announced. Three months. Every Friday. Come through.",            likes: 8, comments: 2,  shares: 3 },
  { id: "p27", author: "Max Harris",        when: "5d ago", body: "Vinyl sales are up again. The format refuses to die.",                      likes: 3, comments: 11, shares: 7 },
  { id: "p28", author: "Ryan Stewart",      when: "5d ago", body: "Manchester has the best sound systems in the country. Change my mind.",      likes: 7, comments: 1,  shares: 0 },
  { id: "p29", author: "Sophie Bennett",    when: "5d ago", body: "Mastering done. Release date TBA. Getting close.",                          likes: 5, comments: 12, shares: 5 },
  { id: "p30", author: "Felix Schwarz",     when: "5d ago", body: "Just discovered this amazing new techno label. The future is bright.",       likes: 4, comments: 4,  shares: 2 },
  { id: "p31", author: "Cole Anderson",     when: "5d ago", body: "Just discovered this amazing new techno label. The future is bright.",       likes: 8, comments: 4,  shares: 7 },
];

export const threads = [
  {
    rootAuthor: "Paper Boat Records", rootWhen: "6d", rootBody: "Absolute banger",
    replies: [
      { author: "Ella Watson", when: "5d", body: "Absolute banger" },
      { author: "Zara Patel",  when: "4d", body: "Yes yes yes" },
    ],
  },
  {
    rootAuthor: "Paper Boat Records", rootWhen: "6d", rootBody: "Keep it coming",
    replies: [
      { author: "Ella Watson", when: "5d", body: "This is fire" },
      { author: "Zara Patel",  when: "4d", body: "Need to hear this live" },
    ],
  },
];

export const trending = ["#house", "#techno", "#london", "#dnb"];

export const forYou = [
  { title: "DJ Poxy Live at Basement 44", date: "20 Oct" },
  { title: "Pomoer Odyssey Live",         date: "22 Oct" },
  { title: "Analog Dreams Live",          date: "24 Oct" },
];

export const peopleToFollow = [
  { initials: "RS", name: "Rachel Sterling" },
  { initials: "DC", name: "David Chen" },
  { initials: "SB", name: "Sophie Bennett" },
];