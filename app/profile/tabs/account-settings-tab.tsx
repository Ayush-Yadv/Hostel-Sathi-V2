"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Save, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  updateProfile,
  updatePassword,
  verifyBeforeUpdateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

// Form schemas
const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

const emailFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  currentPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: "Current password must be at least 6 characters.",
    }),
    newPassword: z.string().min(6, {
      message: "New password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export default function AccountSettingsTab({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user?.displayName || "",
    },
  })

  // Email form
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: user?.email || "",
      currentPassword: "",
    },
  })

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Handle profile update
  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (auth.currentUser) {
        // Update profile in Firebase Auth
        await updateProfile(auth.currentUser, {
          displayName: data.displayName,
        })

        // Update profile in Firestore
        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, {
          displayName: data.displayName,
        })

        setSuccess("Profile updated successfully!")
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  // Handle email update
  const onEmailSubmit = async (data: z.infer<typeof emailFormSchema>) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (auth.currentUser && auth.currentUser.email) {
        // Re-authenticate user before changing email
        const credential = EmailAuthProvider.credential(auth.currentUser.email, data.currentPassword)

        await reauthenticateWithCredential(auth.currentUser, credential)

        // Send verification email to new address
        await verifyBeforeUpdateEmail(auth.currentUser, data.email)

        setSuccess(
          "Verification email sent to your new email address. Please check your inbox and follow the instructions to complete the email change.",
        )
        emailForm.reset()
      }
    } catch (err: any) {
      setError(err.message || "Failed to update email")
    } finally {
      setLoading(false)
    }
  }

  // Handle password update
  const onPasswordSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (auth.currentUser && auth.currentUser.email) {
        // Re-authenticate user before changing password
        const credential = EmailAuthProvider.credential(auth.currentUser.email, data.currentPassword)

        await reauthenticateWithCredential(auth.currentUser, credential)

        // Update password
        await updatePassword(auth.currentUser, data.newPassword)

        setSuccess("Password updated successfully!")
        passwordForm.reset()
      }
    } catch (err: any) {
      setError(err.message || "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        {user?.email && <TabsTrigger value="email">Email</TabsTrigger>}
        {user?.email && <TabsTrigger value="password">Password</TabsTrigger>}
      </TabsList>

      {/* Success/Error Messages */}
      {(success || error) && (
        <Alert
          className={`mb-6 ${success ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"}`}
        >
          <AlertDescription>{success || error}</AlertDescription>
        </Alert>
      )}

      {/* Profile Tab */}
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile information.</CardDescription>
          </CardHeader>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormDescription>This is the name that will be displayed on your profile.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Read-only fields */}
                {user?.email && (
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user.email} disabled />
                  </div>
                )}

                {user?.phoneNumber && (
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={user.phoneNumber} disabled />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>

      {/* Email Tab */}
      {user?.email && (
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Address</CardTitle>
              <CardDescription>Update your email address. You'll need to verify the new email.</CardDescription>
            </CardHeader>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="new.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>For security, please enter your current password.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading} className="flex items-center gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Update Email
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      )}

      {/* Password Tab */}
      {user?.email && (
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password.</CardDescription>
            </CardHeader>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>Password must be at least 6 characters.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading} className="flex items-center gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                    Update Password
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  )
}
