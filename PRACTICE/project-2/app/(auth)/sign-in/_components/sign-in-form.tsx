const SignInForm = ()=>{

    return (
        <form className="flex flex-col gap-4 w-full max-w-sm">
            <input type="email" placeholder="Email" className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" placeholder="Password" className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">Sign In</button>
        </form>
    )
}

export default SignInForm;