import { Suspense } from "react";

type PostIdPageProps = {
  params: Promise<{ userId: string }>;
};

const PostHeading = async ({ params }: PostIdPageProps) => {
  const { userId } = await params;

  return <h1>Welcome To Post-ID Page : of User {userId}</h1>;
};

const PostIdPage = ({ params }: PostIdPageProps) => {
  return (
    <div>
      <Suspense fallback={<h1>Loading...</h1>}>
        <PostHeading params={params} />
      </Suspense>
    </div>
  );
};

export default PostIdPage;