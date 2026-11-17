// app/docs/[[...slug]]/page.jsx
import  { Suspense } from 'react';

// 1. Child component handles awaiting `params`
const DocsContent = async ({ params }) => {
    const { slug } = await params;

    return (
        <div>
            <h1>Docs Page</h1>
            <p>
                {slug ? slug.join('/') : 'Home'}
            </p>
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
