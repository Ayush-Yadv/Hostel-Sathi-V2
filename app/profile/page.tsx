import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import ProfileDashboard from "./profile-dashboard"

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("auth") 

  if (!authCookie) {
    redirect("/auth/login?redirect=/profile")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileDashboard />
    </div>
  )
}




// import { redirect } from "next/navigation"
// import { cookies } from "next/headers"
// import ProfileDashboard from "./profile-dashboard"

// export default function ProfilePage() {
//   // Server-side check if user is logged in
//   const cookieStore = cookies()
//   const authCookie = cookieStore.get("auth")?.value

//   if (!authCookie) {
//     redirect("/auth/login?redirect=/profile")
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <ProfileDashboard />
//     </div>
//   )
// }
