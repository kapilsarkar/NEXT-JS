import React from 'react'

const UserIdPage =  async ({params}) => {
  const {userid} =   await params
  console.log(userid)
  return (
    <div>
      User Id Page {userid}
    </div>
  )
}

export default UserIdPage
