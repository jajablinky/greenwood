/** Same shape as `ViewerActivityEntry` — kept local so helpers do not import providers. */
export type ProfileMockActivityEntry = {
  postId: string
  at: number
  excerpt: string
}

/** Feed post ids from `INITIAL_ACTIVITY_FEED` — links stay valid when mocks are shown. */
export const MOCK_PROFILE_UPVOTE_IDS: string[] = [
  "feed-p-per-blue-f1",
  "feed-p-jaja-research-f1",
  "feed-p-greenwood-f1",
]

export const MOCK_PROFILE_DOWNVOTE_IDS: string[] = ["feed-p-per-blue-f5", "feed-p-greenwood-f2"]

export type MockProfileCreatedRow = { id: string; title: string }

export const MOCK_PROFILE_CREATED: MockProfileCreatedRow[] = [
  { id: "feed-p-per-blue-f2", title: "Lumen — tighter pricing grid" },
  { id: "feed-p-jaja-research-f2", title: "Llamaland" },
]

const hour = 3_600_000
const day = 86_400_000
const baseAt = Date.now()

export const MOCK_PROFILE_REMIXES: ProfileMockActivityEntry[] = [
  {
    postId: "feed-p-per-blue-f4",
    at: baseAt - day * 2 - hour * 3,
    excerpt: "Strip the hero to one headline and a single CTA.",
  },
  {
    postId: "feed-p-jaja-research-f1",
    at: baseAt - day - hour * 8,
    excerpt: "Borrow the cohort chart for a weekly email digest.",
  },
]

export const MOCK_PROFILE_COMMENTS: ProfileMockActivityEntry[] = [
  {
    postId: "feed-p-jaja-research-f1",
    at: baseAt - hour * 6,
    excerpt: "Price action looks fair; might park bids on this listing.",
  },
  {
    postId: "feed-p-per-blue-f6",
    at: baseAt - day * 3 - hour * 2,
    excerpt: "Any chance we expose webhooks for checkout events?",
  },
]
