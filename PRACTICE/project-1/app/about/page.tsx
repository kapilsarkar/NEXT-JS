import Link from "next/link";

const About = ()=>{
    return (
        <div>
            <h1>About Page</h1>
            <p>This is the about page of our application.</p>
            <Link href="/about/myself">Go To Myself</Link>
        </div>
    )
}

export default About;