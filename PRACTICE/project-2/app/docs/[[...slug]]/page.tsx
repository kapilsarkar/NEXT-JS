// app/docs/[[...slug]]/page.tsx
import { Suspense } from "react";

type DocsPageProps = {
  params: Promise<{ slug?: string[] }>;
};

// 1. Child component awaits `params` and renders the content
const DocsContent = async ({ params }: DocsPageProps) => {
  const { slug } = await params;
  console.log(slug)
  return (
    <div>
      <h1>Docs Page</h1>
      {/* slug is an array like ["a", "b"], or undefined for /docs */}
      <p>{slug ? slug.join("/") : "Home"}</p>
      <h2>{slug}</h2>
    </div>
  );
};

// 2. Top-level page renders immediately with a fallback
const DocsPage = ({ params }: DocsPageProps) => {
  return (
    <Suspense fallback={<p>Loading documentation...</p>}>
      <DocsContent params={params} />
    </Suspense>
  );
};

export default DocsPage;