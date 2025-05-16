import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase"

// Function to optimize images before uploading 
export const optimizeImage = async (file: File, maxWidth = 1200, maxHeight = 800): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          let width = img.width
          let height = img.height

          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }

          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }

          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error("Image optimization failed. Blob is null."))
              }
            },
            file.type,
            0.8
          )
        }
      }
      reader.onerror = (error) => {
        reject(error)
      }
    } catch (error) {
      reject(error)
    }
  })
}





// export const optimizeImage = async (file, maxWidth = 1200, maxHeight = 800) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const reader = new FileReader()
//       reader.readAsDataURL(file)
//       reader.onload = (event) => {
//         const img = new Image()
//         img.src = event.target.result
//         img.onload = () => {
//           // Calculate new dimensions while maintaining aspect ratio
//           let width = img.width
//           let height = img.height

//           if (width > maxWidth) {
//             height = (height * maxWidth) / width
//             width = maxWidth
//           }

//           if (height > maxHeight) {
//             width = (width * maxHeight) / height
//             height = maxHeight
//           }

//           // Create canvas and draw resized image
//           const canvas = document.createElement("canvas")
//           canvas.width = width
//           canvas.height = height
//           const ctx = canvas.getContext("2d")
//           ctx.drawImage(img, 0, 0, width, height)

//           // Convert to Blob with reduced quality
//           canvas.toBlob(
//             (blob) => {
//               resolve(blob)
//             },
//             file.type,
//             0.8, // 80% quality
//           )
//         }
//       }
//       reader.onerror = (error) => {
//         reject(error)
//       }
//     } catch (error) {
//       reject(error)
//     }
//   })
// }

// Function to optimize and upload multiple images
export const optimizeAndUploadImages = async (
  images: File[],
  storagePath: string
): Promise<{ urls: string[]; error: any }> => {
  try {
    const urls: string[] = []

    for (const image of images) {
      const storageRef = ref(storage, `${storagePath}/${Date.now()}_${image.name}`)

      const optimizedImage = await optimizeImage(image)

      await uploadBytes(storageRef, optimizedImage)

      const imageUrl = await getDownloadURL(storageRef)
      urls.push(imageUrl)
    }

    return { urls, error: null }
  } catch (error) {
    console.error("Error optimizing and uploading images:", error)
    return { urls: [], error }
  }
}







// export const optimizeAndUploadImages = async (images, storagePath) => {
//   try {
//     const urls = []

//     for (const image of images) {
//       // Create a reference to the storage location
//       const storageRef = ref(storage, `${storagePath}/${Date.now()}_${image.name}`)

//       // Optimize the image before uploading
//       const optimizedImage = await optimizeImage(image)

//       // Upload the optimized image
//       await uploadBytes(storageRef, optimizedImage)

//       // Get the download URL
//       const imageUrl = await getDownloadURL(storageRef)
//       urls.push(imageUrl)
//     }

//     return { urls, error: null }
//   } catch (error) {
//     console.error("Error optimizing and uploading images:", error)
//     return { urls: [], error }
//   }
// }
