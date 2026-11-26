import React from 'react'
import Link from 'next/link'

const OnePage = () => {
  return (
    <div>
      <h1>One Page</h1>
      <div className=' flex flex-col'>
             <Link href= {"/one/two"}>Redirect to Two Page</Link>
      <Link href={"/three"}>Redirect to Three Page</Link>
      </div>
     
    </div>
  )
}

export default OnePage
