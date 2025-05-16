"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Loader2, Edit, Trash2, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBlogsByAuthor } from "@/lib/blogs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function BlogsTab({ userId }: { userId: string }) {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!userId) return

      const { blogs, error } = await getBlogsByAuthor(userId)
      if (!error) {
        setBlogs(blogs)
      }
      setLoading(false)
    }

    fetchBlogs()
  }, [userId])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Your Blog Posts</h3>
        <Button asChild>
          <Link href="/blogs/write" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Write New Blog
          </Link>
        </Button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-4">You haven't written any blogs yet.</p>
          <Button asChild>
            <Link href="/blogs/write">Start Writing</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                {blog.coverImage && (
                  <div className="relative h-48 md:h-auto md:w-1/3">
                    <Image src={blog.coverImage || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-4 md:w-2/3">
                  <div className="flex flex-col h-full">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{blog.title}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {blog.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{format(new Date(blog.createdAt), "MMMM d, yyyy")}</p>
                      <p className="mt-2 text-gray-600 line-clamp-3">{blog.content.substring(0, 150)}...</p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {blog.views || 0}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
                          <Link href={`/blogs/${blog.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="ml-1">View</span>
                          </Link>
                        </Button>

                        <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
                          <Link href={`/blogs/edit/${blog.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="ml-1">Edit</span>
                          </Link>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="ml-1">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your blog post.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
