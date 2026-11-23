import { Suspense } from "react";

type DynamicPostIdPageProps = {
  params: Promise<{ userId: string; postId: string }>;
};

const PostContent = async ({ params }: DynamicPostIdPageProps) => {
  const { userId, postId } = await params;

  return (
    <>
      <h2>User ID : {userId}</h2>
      <h2>Post ID : {postId}</h2>
    </>
  );
};

const DynamicPostIdPage = ({ params }: DynamicPostIdPageProps) => {
  return (
    <div>
      <h1>Welcome to Dynamic Post-Id Page</h1>
      <Suspense fallback={<p>Loading post...</p>}>
        <PostContent params={params} />
      </Suspense>
    </div>
  );
};

export default DynamicPostIdPage;