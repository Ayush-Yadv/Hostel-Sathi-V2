"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, User, BookmarkIcon, FileText, Settings, LogOut } from "lucide-react"
import { onAuthChange, signOut } from "@/lib/auth"
import SavedHostelsTab from "./tabs/saved-hostels-tab"
import BlogsTab from "./tabs/blogs-tab"
import AccountSettingsTab from "./tabs/account-settings-tab"

export default function ProfileDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("saved-hostels")
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      if (authUser) {
        setUser(authUser)
      } else {
        router.push("/auth/login?redirect=/profile")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
            {user?.photoURL ? (
              <Image
                src={user.photoURL || "/placeholder.svg"}
                alt="Profile"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-blue-500" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.displayName || "User"}</h1>
            <p className="text-gray-500">{user?.email || user?.phoneNumber || "No contact info"}</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="saved-hostels" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="saved-hostels" className="flex items-center gap-2">
            <BookmarkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Saved Hostels</span>
          </TabsTrigger>
          <TabsTrigger value="my-blogs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">My Blogs</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Account Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved-hostels">
          <Card>
            <CardHeader>
              <CardTitle>Saved Hostels/PGs</CardTitle>
              <CardDescription>View and manage your saved accommodations.</CardDescription>
            </CardHeader>
            <CardContent>
              <SavedHostelsTab userId={user.uid} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-blogs">
          <Card>
            <CardHeader>
              <CardTitle>My Blogs</CardTitle>
              <CardDescription>Manage your blog posts and create new content.</CardDescription>
            </CardHeader>
            <CardContent>
              <BlogsTab userId={user.uid} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your profile information and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountSettingsTab user={user} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
