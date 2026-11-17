import React from 'react'

const PostIdPage = async ({params}) => {
    const {userId} = await params
  return (
    <div>
      Welcome to Post Id Page of User {userId}
    </div>
  )
}

export default PostIdPage
