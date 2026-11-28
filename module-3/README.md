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

---

# Part 2 – Route Groups and Private Folders

> **Quick refresher:** In the App Router, every folder inside `app/` becomes part of the URL, and a `page.jsx` makes that URL accessible. Two special folder conventions let you *organize* your code without changing your URLs:
>
> - `(folderName)` → **Route Group**: the folder is used for organizing only, and its name is **removed** from the URL.
> - `_folderName` → **Private Folder**: the folder (and everything inside it) is **excluded from routing** completely.

---

## 1. The Problem: Rigid Folder Structure

### Step 1 – `app/admin/dashboard/page.jsx`

Create a folder `admin` inside `app`, then a folder `dashboard` inside it, and add a `page.jsx`.

```jsx
const DashBoardPage = () => {
  return <div>Welcome to DashBoard Page</div>;
};

export default DashBoardPage;
```

### Step 2 – `app/admin/settings/page.jsx`

Inside `admin`, create a second folder `settings` with its own `page.jsx`.

```jsx
const SettingPage = () => {
  return <div>Welcome to Settings Page</div>;
};

export default SettingPage;
```

**Folder structure and URLs at this stage**

```
app/
└── admin/
    ├── dashboard/
    │   └── page.jsx      → /admin/dashboard
    └── settings/
        └── page.jsx      → /admin/settings
```

### Limitation – Rigid folder structure

Every folder name becomes part of the URL, so you can't group related pages (like all admin pages) into one folder **without** adding that folder name to the URL. Also note that `/admin` alone gives a **404**, because the `admin` folder has no `page.jsx` of its own.

---

## 2. Route Groups – `(folderName)`

### Step 3 – Wrap `admin` in parentheses → `(admin)`

Rename `admin` to `(admin)`. Parentheses tell Next.js: *"use this folder for organization only, don't put it in the URL."*

```
app/
└── (admin)/
    ├── dashboard/
    │   └── page.jsx      → /dashboard
    └── settings/
        └── page.jsx      → /settings
```

- Visiting `http://localhost:3000/settings` now works.
- Visiting `http://localhost:3000/admin/settings` now gives a **404**, because `admin` is no longer part of the URL.

> **Rule to remember:** Two route groups can't resolve to the *same URL*. For example, `(admin)/settings/page.jsx` and `(user)/settings/page.jsx` would conflict, since both become `/settings`.

### Step 4 – Auth pages inside a `(auth)` group

Create a folder `auth` inside `app`, and wrap it as `(auth)`. Inside it, create three folders: `sign-in`, `sign-up` and `forget-password`, each with a `page.jsx`. Inside `sign-in`, add a **private folder** `_components` that holds the form component.

```
app/
└── (auth)/
    ├── layout.jsx                  ← shared layout (see note below)
    ├── sign-in/
    │   ├── page.jsx                → /sign-in
    │   └── _components/
    │       └── sign-in-form.jsx    ← NOT a route (private folder)
    ├── sign-up/
    │   └── page.jsx                → /sign-up
    └── forget-password/
        └── page.jsx                → /forget-password
```

#### a) `app/(auth)/sign-in/_components/sign-in-form.jsx`

```jsx
const SignInForm = () => {
  return <div>Welcome to Sign-In Form-Page</div>;
};

export default SignInForm;
```

**Why `_components`?** A folder starting with an underscore is a **private folder**. Next.js ignores it for routing, so `/sign-in/_components` is not a URL, even if it contained a `page.jsx`. This keeps helper files (components, utils, styles) next to the route that uses them without exposing them. (If you ever need a literal underscore in a URL, write the folder as `%5Ffolder`.)

#### b) `app/(auth)/sign-in/page.jsx`

```jsx
import SignInForm from "./_components/sign-in-form";

const SignInPage = () => {
  return (
    <div>
      <h1>Welcome to the Sign In Page</h1>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
```

#### c) `app/(auth)/forget-password/page.jsx`

```jsx
const ForgetPassword = () => {
  return (
    <div>
      <h1>Welcome to Forget Password Page</h1>
    </div>
  );
};

export default ForgetPassword;
```

#### d) `app/(auth)/layout.jsx`

```jsx
const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold text-indigo-500">Welcome to Auth Layout</h1>
      {children}
    </div>
  );
};

export default AuthLayout;
```

**How layouts work with route groups:** A `layout.jsx` wraps every page *inside its folder*, and `children` is where the page renders. Placing the layout at the group level, `(auth)/layout.jsx`, means **all** auth pages (`/sign-in`, `/sign-up`, `/forget-password`) share it. A great use of route groups is giving different sections of your site different layouts without changing any URL.

---

## 3. Home Page and Private Folders

### Step 5 – `app/_root/page.jsx`

```jsx
export default function Home() {
  return (
    <section className="text-gray-400 bg-gray-900 body-font">
      <h1>Welcome to the Home Page-(module-3)</h1>
    </section>
  );
}
```

**Important:** because the folder starts with an underscore, `_root` is a **private folder**, so this page is **not reachable** at any URL (including `/`). This is a nice demo of how private folders work, but it isn't a home page.

To make a real home page, use one of these:

- `app/page.jsx` → served at `/`
- `app/(root)/page.jsx` → also served at `/`, using a route group (note the **parentheses**, not an underscore)

Use only one of them, since two pages resolving to `/` will conflict.

---

## Key Takeaways

| Convention | Example | Effect on URL | Typical use |
| --- | --- | --- | --- |
| Route group | `(auth)` | Name is **removed** from URL | Organize routes, share a layout per section |
| Private folder | `_components` | Folder is **not routable** | Keep helper files beside routes |

- Folder names normally become URL segments. Use `(parentheses)` to remove one, or `_underscore` to hide one entirely.
- A route group needs a `page.jsx` somewhere inside it to produce a URL.
- Layouts apply to everything in their folder, so put shared layouts at the route-group level.

---

## PART-3

## Next.js Intercepting Routes — Revision Guide

**Intercepting Routes** in Next.js allow you to load a route from another part of your application within the current layout. This routing paradigm is especially useful when you want to display new content (like a modal, photo preview, or login screen) without the user switching to a completely different context—while still keeping the URL shareable and refreshable.

> **Core Rule of Thumb:**
> * **Soft Navigation** (clicking a `<Link>` or using `router.push`): Renders the **Intercepted** page.
> * **Hard Navigation** (page reload / refresh or direct URL entry): Renders the **Actual** target page.

---

## 1. Convention Cheat Sheet

Intercepting routes are defined using the `(..)` convention, which works similarly to relative paths (`../`), except it matches **route segments** rather than filesystem folders.

| Convention | Matches Route Segment | Description |
| :--- | :--- | :--- |
| `(.)` | **Same level** | Intercepts a route at the exact same segment level. |
| `(..)` | **One level above** | Intercepts a route one segment level higher. |
| `(..)(..)` | **Two levels above** | Intercepts a route two segment levels higher. |
| `(...)` | **Root `app` directory** | Intercepts a route directly from the root `app/` directory, regardless of nesting depth. |

*(Note: Route groups like `(marketing)` do not count as route segments.)*

---

## 2. Project Folder Structure

Based on your practice setup, here is how the folder hierarchy is organized inside the `app/` directory:

```text
app/
├── final/
│   └── page.jsx                  # Actual route: /final
├── four/
│   └── page.jsx                  # Actual route: /four
├── three/
│   └── page.jsx                  # Actual route: /three
└── one/
    ├── page.jsx                  # Route: /one (Entry point with links)
    ├── (.)two/
    │   └── page.jsx              # Intercepts /one/two (Same level)
    ├── (..)three/
    │   └── page.jsx              # Intercepts /three (One level up)
    └── two/
        ├── page.jsx              # Actual route: /one/two
        ├── (..)(..)four/
        │   └── page.jsx          # Intercepts /four (Two levels up)
        └── inner-two/
            ├── page.jsx          # Route: /one/two/inner-two
            └── (...)final/
                └── page.jsx      # Intercepts /final (From root app/)
```

---

## 3. How Each Interception Works

### A. Same-Level Interception: `(.)`

* **Location:** `app/one/(.)two/page.jsx`
* **Trigger:** Clicking `<Link href="/one/two">` from `/one`.
* **Behavior:** Because `two` is at the same segment level as `(.)two` inside `one/`, Next.js intercepts the soft navigation and renders `SameLevelTwoInterCeptedPage`. Refreshing the browser loads the actual `app/one/two/page.jsx`.

### B. One-Level-Up Interception: `(..)`

* **Location:** `app/one/(..)three/page.jsx`
* **Trigger:** Clicking `<Link href="/three">` from `/one`.
* **Behavior:** `(..)` steps out of `one/` to the `app/` level to match `/three`. Soft navigation renders `ThreeInterCeptingRoutePage`, while a page refresh loads `app/three/page.jsx`.

### C. Two-Levels-Up Interception: `(..)(..)`

* **Location:** `app/one/two/(..)(..)four/page.jsx`
* **Trigger:** Navigating to `/four` via `<Link>` from `/one/two`.
* **Behavior:** `(..)(..)` steps up two route segments (`two` $\rightarrow$ `one` $\rightarrow$ `app`) to match `/four`. Soft navigation renders `FourInterCeptedRoutesPage`, while a page refresh loads `app/four/page.jsx`.

### D. Root-Level Interception: `(...)`

* **Location:** `app/one/two/inner-two/(...)final/page.jsx`
* **Trigger:** Clicking `<Link href="/final">` from `/one/two/inner-two`.
* **Behavior:** Regardless of how deeply nested `inner-two` is, `(...)` looks directly inside the root `app/` directory for `final`. Soft navigation renders `InterCeptedFinalPage`, while refreshing loads `app/final/page.jsx`.

---

## 4. Code Reference

### Entry & Navigation Pages

#### `app/one/page.jsx`

```jsx
import React from 'react'
import Link from 'next/link'

const OnePage = () => {
  return (
    <div>
      <h1>One Page</h1>
      <div className='flex flex-col'>
        <Link href={"/one/two"}>Redirect to Two Page</Link>
        <Link href={"/three"}>Redirect to Three Page</Link>
      </div>
    </div>
  )
}

export default OnePage
```

#### `app/one/two/inner-two/page.jsx`

```jsx
import React from 'react'
import Link from 'next/link'

const InnerTwoPage = () => {
  return (
    <div>
      <h1>Inner Two Page</h1>
      <Link href={"/final"}>Final Page</Link>
    </div>
  )
}

export default InnerTwoPage
```

---

### Intercepting Pages (Rendered on `<Link>` Click)

#### `app/one/(.)two/page.jsx`

```jsx
import React from 'react'

const SameLevelTwoInterCeptedPage = () => {
  return (
    <div>
      <h1>Same Level Two InterCepted Page</h1>
    </div>
  )
}

export default SameLevelTwoInterCeptedPage
```

#### `app/one/(..)three/page.jsx`

```jsx
import React from 'react'

const ThreeInterCeptingRoutePage = () => {
  return (
    <div>
      <h1>ThreeInterCeptingRoutePage</h1>
    </div>
  )
}

export default ThreeInterCeptingRoutePage
```

#### `app/one/two/(..)(..)four/page.jsx`

```jsx
import React from 'react'

const FourInterCeptedRoutesPage = () => {
  return (
    <div>
      <h1>Four InterCepted Routes Page</h1>
    </div>
  )
}

export default FourInterCeptedRoutesPage
```

#### `app/one/two/inner-two/(...)final/page.jsx`

```jsx
import React from 'react'

const InterCeptedFinalPage = () => {
  return (
    <div>
      <h1>InterCepted Final Page</h1>
    </div>
  )
}

export default InterCeptedFinalPage
```

---

### Actual Target Pages (Rendered on Hard Refresh / Direct URL)

#### `app/three/page.jsx`

```jsx
import React from 'react'

const ThreePage = () => {
  return (
    <div>
      <h1>Three Page</h1>
    </div>
  )
}

export default ThreePage
```

#### `app/four/page.jsx`

```jsx
import React from 'react'

const FourPage = () => {
  return (
    <div>
      <h1>Four Page</h1>
    </div>
  )
}

export default FourPage
```

#### `app/final/page.jsx`

```jsx
import React from 'react'

const FinalPage = () => {
  return (
    <div>
      <h1>Final Page</h1>
    </div>
  )
}

export default FinalPage
```

---

## 5. Quick Revision Checklist

- [ ] **Check Folder Syntax:** Ensure parentheses wrap the dots only—e.g., `(.)two`, `(..)three`, `(..)(..)four`, `(...)final` (not `(.two)`).
- [ ] **Add Missing Links:** If you want to test `(..)(..)four` interactively, add `<Link href="/four">Redirect to Four Page</Link>` inside `app/one/two/page.jsx`.
- [ ] **Test Both Behaviors:** Always click the `<Link>` first to verify the intercepted view, then press `F5` / `Cmd+R` to verify the actual route renders.

---

## Next.js App Router: Parallel Routes & Custom 404 Revision Guide

A concise revision reference covering **Parallel Routes (`@slot`)**, **Slot Fallbacks (`default.jsx`)**, **Nested Slot Navigation**, and **Custom Global Not-Found Pages (`not-found.jsx`)** in Next.js App Router.

---

## 1. Core Concepts

* **Parallel Routes (`@folder`):** Render multiple independent pages simultaneously inside the same `layout.jsx`. Named slots are passed automatically as props alongside `children` and do **not** add segments to the URL path.
* **Why `default.jsx` Is Required:** Every parallel slot shares the same URL. During a hard refresh or direct visit to a nested slot route (like `/admin-dashboard/team-docs`), Next.js resolves that URL across **all** sibling slots (`children`, `@analytics`, `@team`). Any slot without a matching route uses `default.jsx` as its fallback instead of throwing a build/runtime error or 404.

---

## 2. Folder Structure

```text
app/
├── not-found.jsx                   # Global custom 404 page
└── admin-dashboard/
    ├── layout.jsx                  # Receives { children, analytics, team }
    ├── page.jsx                    # Main slot (children)
    ├── default.jsx                 # Fallback for children
    ├── @analytics/
    │   ├── page.jsx                # Analytics slot
    │   └── default.jsx             # Fallback for @analytics
    └── @team/
        ├── page.jsx                # Team slot
        ├── default.jsx             # Fallback for @team
        └── team-docs/
            └── page.jsx            # Sub-route rendered inside @team (/admin-dashboard/team-docs)
public/
└── not-found.svg                   # Static SVG referenced as "/not-found.svg"
```

## 3. Common Errors & Fixes

| Error / Issue | Cause | Fix |
| :--- | :--- | :--- |
| **The default export is not a React Component / infinite reload** | Filename typo (`lay.out.jsx` instead of `layout.jsx`), unsaved file, or stale `.next` cache. | Rename strictly to `layout.jsx`, save files, run `rm -rf .next && npm run dev`. |
| **Parallel route slots cannot render the same URLs** | Navigating to `/admin-dashboard/team-docs` when `children` or `@analytics` has no matching route or `default.jsx`. | Add `default.jsx` in `app/admin-dashboard/` and inside every `@slot` folder. |
| **Tailwind utility ignored (`flex - flex-col`)** | Stray hyphen inside class string. | Use `flex flex-col`. |

## 4. Minimal Code Reference

- A. Layout (app/admin-dashboard/layout.jsx)

```js
const AdminLayout = ({ children, analytics, team }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-6">{children}</div>
      <div className="grid grid-cols-2 gap-6">
        <div>{analytics}</div>
        <div>{team}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
```

## B. Pages & Nested Slot Route

- `app/admin-dashboard/page.jsx`

```js
const AdminPage = () => {
  return (
    <div>
      <h2>Admin Overview</h2>
      <p>Welcome to the admin dashboard!</p>
    </div>
  );
};

export default AdminPage;
```

- `app/admin-dashboard/@analytics/page.jsx`

```js
const AnalyticsPage = () => {
  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <p>View application metrics and insights.</p>
    </div>
  );
};

export default AnalyticsPage;
```

- `app/admin-dashboard/@team/page.jsx`

```js
import Link from "next/link";

const TeamPage = () => {
  return (
    <div>
      <h2>Team Dashboard</h2>
      <p>Manage team members and access resources.</p>
      <Link href="/admin-dashboard/team-docs">Go To Team Docs</Link>
    </div>
  );
};

export default TeamPage;
```

- `app/admin-dashboard/@team/team-docs/page.jsx`

```js
import Link from "next/link";

const TeamDocsPage = () => {
  return (
    <div>
      <h2>Team Docs Page</h2>
      <Link href="/admin-dashboard">Go to Default</Link>
    </div>
  );
};

export default TeamDocsPage;
```

## C. Fallback default.jsx Files

- `app/admin-dashboard/default.jsx`

```js
import AdminPage from "./page";
export default AdminPage;
```

- `app/admin-dashboard/@analytics/default.jsx`

```js
import AnalyticsPage from "./page";
export default AnalyticsPage;
```

- `app/admin-dashboard/@team/default.jsx`

```js
import TeamPage from "./page";
export default TeamPage;
```

## D. Custom Global 404 (app/not-found.jsx)

```js
import Image from "next/image";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image alt="Page not found" height="{400}" src="/not-found.svg" width="{400}"/>
      <h1 className="text-4xl font-bold mt-4">404 — Page Not Found</h1>
      <Link className="mt-4 underline" href="/">
        Go To Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
```

## 5. Key Takeaways

- @folder slots map to the parent URL and are passed as props into layout.jsx.

- Always create default.jsx in the parent route and every @slot folder so hard reloads on sub-routes resolve cleanly.

- Clear .next (rm -rf .next) whenever renaming Next.js special files (layout.jsx, default.jsx, not-found.jsx).
