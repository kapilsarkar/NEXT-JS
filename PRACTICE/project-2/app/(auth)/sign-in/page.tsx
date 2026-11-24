import SignInForm from "./_components/sign-in-form";

const SignInPage = ()=>{
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Sign In</h1>
            <p className="text-lg text-gray-600">Please enter your credentials to access the admin panel.</p>
            <SignInForm/>
        </div>
    )
}

export default SignInPage;