import Link from "next/link"

const TwoPage = ()=>{
    return (  
        <div>
            <h1>Two Page</h1>   
            <Link href={"/four"}>Go To Four Page</Link>
        </div>
    )
}

export default TwoPage