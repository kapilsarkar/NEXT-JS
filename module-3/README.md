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