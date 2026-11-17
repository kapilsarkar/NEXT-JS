import React from 'react'

const CommentsIdPage = async ({params}) => {
    const {userId,postId,commentsId} = await params
  return (
    <div>
      Dynamic Comments Id Page
       <h2>postId :  {postId}</h2>
            <h3>userId : {userId}</h3>
            <h3>commentsId : {commentsId}</h3>
    </div>
  )
}

export default CommentsIdPage
