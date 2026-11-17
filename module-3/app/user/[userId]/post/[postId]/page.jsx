import React from "react";

const DynamicPostIdPage = async({params}) => {
    const {userId,postId} = await params;
    return (
        <div>DynamicPostIdPage 
            <h2>postId :  {postId}</h2>
            <h3>userId : {userId}</h3>
        </div>
    )
}

export default DynamicPostIdPage