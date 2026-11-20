# Next.js – Module 3

A step-by-step record of everything covered in module 3: **nested dynamic routes**, **catch-all segments** and **optional catch-all segments**.

> **Quick refresher:** Next.js (App Router) uses *file-system routing*. A folder inside `app/` becomes a URL segment, and a `page.jsx` inside it makes that segment publicly accessible. A folder wrapped in square brackets, like `[userId]`, is a **dynamic segment**: its value is read from the URL.

---

## 1. Nested Dynamic Routes

**Goal:** build routes like `/user`, `/user/42` and `/user/42/post/7`, where parts of the URL change dynamically.

**Final folder structure**

```
app/
└── user/
    ├── page.jsx                  → /user
    └── [userId]/
        ├── page.jsx              → /user/42
        └── post/
            └── [postId]/
                └── page.jsx      → /user/42/post/7
```

### Step 1 – Static route: `app/user/page.jsx`

Create a folder named `user` and add a `page.jsx` inside it. This is a normal static route that renders at `/user`.

```jsx
const UserPage = () => {
  return <div>User Page</div>;
};

export default UserPage;
```

### Step 2 – Dynamic segment: `app/user/[userId]/page.jsx`

Create a folder named `[userId]` inside `user`, then add a `page.jsx`. The folder name in brackets becomes the **key** inside `params`, so `/user/42` gives `userId = "42"`.

```jsx
const DynamicUserIdPage = async ({ params }) => {
  const { userId } = await params;

  return <div>Dynamic User Id Page {userId}</div>;
};

export default DynamicUserIdPage;
```

**Why `await params`?** In recent Next.js versions (15+), `params` is a **Promise**, so you must `await` it in an `async` Server Component before reading values. (In a Client Component you can't use `async`; use React's `use(params)` instead.)

> Note: param values are always **strings**, even if the URL looks like a number. Convert with `Number(userId)` if needed.

### Step 3 – Nesting dynamic segments: `app/user/[userId]/post/[postId]/page.jsx`

Create a static folder `post` inside `[userId]`, then a dynamic folder `[postId]` inside `post`, and add a `page.jsx`. Each dynamic folder along the path adds its own key to `params`.

```jsx
const PostIdPage = async ({ params }) => {
  const { userId, postId } = await params;

  return (
    <div>
      Welcome to Post Id Page {postId} of User {userId}
    </div>
  );
};

export default PostIdPage;
```

For `/user/42/post/7`, `params` is `{ userId: "42", postId: "7" }`.

---

## 2. Catch-All and Optional Catch-All Segments

**Goal:** handle URLs with an *unknown number of segments* using a single route file. This is common for docs sites, wikis and file explorers.

| Folder name | Matches `/docs` | Matches `/docs/a` | Matches `/docs/a/b/c` | `slug` value |
| --- | --- | --- | --- | --- |
| `[...slug]` (catch-all) | ❌ No | ✅ | ✅ | `["a"]`, `["a","b","c"]` |
| `[[...slug]]` (optional catch-all) | ✅ Yes | ✅ | ✅ | `undefined`, `["a"]`, `["a","b","c"]` |

The only difference is the **double brackets**: they make the segment *optional*, so the base route `/docs` also matches. In that case `slug` is `undefined`, which is why the code below checks `slug ? ... : 'Home'`.

### Step 1 – Create `app/docs/[[...slug]]/page.jsx`

Create a `docs` folder inside `app`, then a `[[...slug]]` folder inside it, and add a `page.jsx`.

```jsx
// app/docs/[[...slug]]/page.jsx
import { Suspense } from "react";

// 1. Child component awaits `params` and renders the content
const DocsContent = async ({ params }) => {
  const { slug } = await params;

  return (
    <div>
      <h1>Docs Page</h1>
      {/* slug is an array like ["a", "b"], or undefined for /docs */}
      <p>{slug ? slug.join("/") : "Home"}</p>
    </div>
  );
};

// 2. Top-level page renders immediately with a fallback
const DocsPage = ({ params }) => {
  return (
    <Suspense fallback={<p>Loading documentation...</p>}>
      <DocsContent params={params} />
    </Suspense>
  );
};

export default DocsPage;
```

**How it works**

- `slug` is always an **array** of the URL pieces after `/docs`, so `/docs/getting-started/install` gives `["getting-started", "install"]`.
- `slug.join("/")` turns that array back into a readable path.
- `<Suspense>` shows the `fallback` while the child component is waiting for `params` to resolve. This is the recommended pattern when your app uses dynamic data and Next.js's newer rendering model (Cache Components). In a basic setup it isn't strictly required, and you could simply make `DocsPage` itself `async` and `await params` directly.

---

## Key Takeaways

- `[name]` → one dynamic segment. `[...name]` → one *or more*. `[[...name]]` → *zero* or more.
- Dynamic values arrive through `params`, which must be **awaited** in Server Components.
- Nested dynamic folders produce multiple keys in `params`.
- Catch-all params are **arrays**; single dynamic params are **strings**.