import { Suspense } from "react";

type UserIdPageProps = {
    params: Promise<{
        userid: string;
    }>;
};

// 1. Child component that awaits params
const UserDetails = async ({ params }: UserIdPageProps) => {
    const { userid } = await params;

    return <div>User Id Page {userid}</div>;
};

// 2. Main Page wraps the dynamic child in <Suspense>
const UserIdPage = async ({ params }: UserIdPageProps) => {
    return (
        <div>
            {/* Static shell renders immediately */}
            <h1>User Profile</h1>

            {/* Dynamic content streams in */}
            <Suspense fallback={<p>Loading User...</p>}>
                <UserDetails params={params} />
            </Suspense>
        </div>
    );
};

export default UserIdPage;
