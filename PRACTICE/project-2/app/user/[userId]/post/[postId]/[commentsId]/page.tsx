import { Suspense } from "react";

type DynamicCommentsIdPageProps = {
    params : Promise<{userId: string, postId: string, commentsId: string}>;
}

const CommentsContent = async({params} : DynamicCommentsIdPageProps)=>{
 const {userId, postId,commentsId} = await params;

 return (
    <>
          <div>
            <h1>Dynamic Comments Id Page</h1>
              <h2>postId : {postId} </h2>
               <h3>userId : {userId}</h3>
               <h3>commentsId : {commentsId}</h3>
          </div>
    </>
 )
}

const CommentsIdPage = ({params} : DynamicCommentsIdPageProps)=>{
    return (
        <>
         <div>
            <h1>Welcome to Dynamic Comments Id Page</h1>
            <Suspense fallback= {<p>Loading post ...</p>}>
               <CommentsContent params={params}/>
            </Suspense>
         </div>
        </>
    )
}

export default CommentsIdPage;