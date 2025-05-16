import { db, storage } from "./firebase"
import { Timestamp } from "firebase/firestore"
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { optimizeImage } from "./imageOptimization"

// Collection reference
const blogsCollection = collection(db, "blogs")

// Submit a new blog
export const submitBlog = async (
  blogData: {
    title: string
    content: string
    authorId: string
    [key: string]: any
  },
  coverImage: File | null
): Promise<{ success: boolean; blogId: string | null; error: any }> => {
  try {
    let imageUrl: string | null = null

    if (coverImage) {
      const storageRef = ref(storage, `blog-images/${Date.now()}_${coverImage.name}`)
      const optimizedImage = await optimizeImage(coverImage, 1200, 630)
      await uploadBytes(storageRef, optimizedImage)
      imageUrl = await getDownloadURL(storageRef)
    }

    const docRef = await addDoc(blogsCollection, {
      ...blogData,
      coverImage: imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      views: 0,
      comments: [],
    })

    return { success: true, blogId: docRef.id, error: null }
  } catch (error) {
    console.error("Error submitting blog:", error)
    return { success: false, blogId: null, error }
  }
}





// export const submitBlog = async (blogData, coverImage) => {
//   try {
//     // First, upload and optimize the cover image
//     let imageUrl = null

//     if (coverImage) {
//       // Create a reference to the storage location
//       const storageRef = ref(storage, `blog-images/${Date.now()}_${coverImage.name}`)

//       // Optimize the image before uploading
//       const optimizedImage = await optimizeImage(coverImage, 1200, 630)

//       // Upload the optimized image
//       await uploadBytes(storageRef, optimizedImage)

//       // Get the download URL
//       imageUrl = await getDownloadURL(storageRef)
//     }

//     // Add the blog to Firestore
//     const docRef = await addDoc(blogsCollection, {
//       ...blogData,
//       coverImage: imageUrl,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//       likes: 0,
//       views: 0,
//       comments: [],
//     })

//     return { success: true, blogId: docRef.id, error: null }
//   } catch (error) {
//     console.error("Error submitting blog:", error)
//     return { success: false, blogId: null, error }
//   }
// }

// Get all blogs 
export type Blog = {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  authorPhoto: string
  coverImage?: string
  createdAt: Date
  [key: string]: any
}

export const getAllBlogs = async (
  limitCount: number = 10
): Promise<{ blogs: Blog[]; error: any }> => {
  try {
    const q = query(blogsCollection, orderBy("createdAt", "desc"), limit(limitCount))
    const querySnapshot = await getDocs(q)

    const blogs: Blog[] = []
    querySnapshot.forEach((doc) => {
  const data = doc.data() as Partial<Blog> & { createdAt?: Timestamp }

  if (data.title && data.content && data.authorId) {
    blogs.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Blog)
  } else {
    console.warn(`Blog ${doc.id} is missing required fields and was skipped.`)
  }
})

    return { blogs, error: null }
  } catch (error) {
    console.error("Error getting blogs:", error)
    return { blogs: [], error }
  }
}


// export const getAllBlogs = async (limitCount = 10) => {
//   try {
//     const q = query(blogsCollection, orderBy("createdAt", "desc"), limit(limitCount))
//     const querySnapshot = await getDocs(q)

//     const blogs = []
//     querySnapshot.forEach((doc) => {
//       blogs.push({
//         id: doc.id,
//         ...doc.data(),
//         createdAt: doc.data().createdAt?.toDate() || new Date(),
//       })
//     })

//     return { blogs, error: null }
//   } catch (error) {
//     console.error("Error getting blogs:", error)
//     return { blogs: [], error }
//   }
// }

// Get blog by ID
export const getBlogById = async (blogId: string) => {
  try {
    const blogRef = doc(blogsCollection, blogId)
    const blogSnap = await getDoc(blogRef)

    if (blogSnap.exists()) {
      const blogData = blogSnap.data()
      return {
        blog: {
          id: blogId,
          ...blogData,
          createdAt: blogData.createdAt?.toDate() || new Date(),
        },
        error: null,
      }
    } else {
      return { blog: null, error: "Blog not found" }
    }
  } catch (error) {
    console.error("Error getting blog:", error)
    return { blog: null, error }
  }
}

// Get blogs by author
export const getBlogsByAuthor = async (authorId: string) => {
  try {
    const q = query(blogsCollection, where("authorId", "==", authorId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const blogs : Blog[] = []
    querySnapshot.forEach((doc) => {
  const data = doc.data() as Partial<Blog> & { createdAt?: Timestamp }

  if (data.title && data.content && data.authorId) {
    blogs.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Blog)
  } else {
    console.warn(`Blog ${doc.id} is missing required fields and was skipped.`)
  }
})

    return { blogs, error: null }
  } catch (error) {
    console.error("Error getting blogs by author:", error)
    return { blogs: [], error }
  }
}

// export const getBlogsByAuthor = async (authorId: string) => {
//   try {
//     const q = query(blogsCollection, where("authorId", "==", authorId), orderBy("createdAt", "desc"))
//     const querySnapshot = await getDocs(q)

//     const blogs = []
//     querySnapshot.forEach((doc) => {
//       blogs.push({
//         id: doc.id,
//         ...doc.data(),
//         createdAt: doc.data().createdAt?.toDate() || new Date(),
//       })
//     })

//     return { blogs, error: null }
//   } catch (error) {
//     console.error("Error getting blogs by author:", error)
//     return { blogs: [], error }
//   }
// }

// Get blogs by category
export const getBlogsByCategory = async (category: string) => {
  try {
    const q = query(blogsCollection, where("category", "==", category), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const blogs : Blog[] = []
    querySnapshot.forEach((doc) => {
  const data = doc.data() as Partial<Blog> & { createdAt?: Timestamp }

  if (data.title && data.content && data.authorId) {
    blogs.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Blog)
  } else {
    console.warn(`Blog ${doc.id} is missing required fields and was skipped.`)
  }
})

    return { blogs, error: null }
  } catch (error) {
    console.error("Error getting blogs by category:", error)
    return { blogs: [], error }
  }
}

// export const getBlogsByCategory = async (category) => {
//   try {
//     const q = query(blogsCollection, where("category", "==", category), orderBy("createdAt", "desc"))
//     const querySnapshot = await getDocs(q)

//     const blogs = []
//     querySnapshot.forEach((doc) => {
//       blogs.push({
//         id: doc.id,
//         ...doc.data(),
//         createdAt: doc.data().createdAt?.toDate() || new Date(),
//       })
//     })

//     return { blogs, error: null }
//   } catch (error) {
//     console.error("Error getting blogs by category:", error)
//     return { blogs: [], error }
//   }
// }
