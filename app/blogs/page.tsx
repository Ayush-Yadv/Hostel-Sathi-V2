"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Clock, User, ArrowUp } from "lucide-react"
import CommonNavbar from "@/components/common-navbar"
import CommonFooter from "@/components/common-footer"
import WhatsAppButton from "@/components/whatsapp-button"
import MobileNav from "@/components/mobile-nav"
import Head from "next/head"

// Hardcoded blog data
const blogs = [
  {
    id: 1,
    title: "Steps You Should Follow to Get a Hostel Easily",
    content: `Finding the right hostel can be a daunting task, but with the right approach, it can be smooth sailing. Here's a comprehensive guide to help you secure your ideal hostel:

1. Start Early
Begin your search at least 2-3 months before your college starts. This gives you enough time to research, visit, and compare different options.

2. Research Online
Use platforms like Hostel Sathi to browse through verified hostels. Read reviews, check amenities, and compare prices.

3. Visit in Person
Always visit the hostel before booking. Check the rooms, common areas, and facilities. Meet the staff and current residents if possible.

4. Check Location
Ensure the hostel is within a reasonable distance from your college. Consider transportation options and safety of the area.

5. Verify Documents
Ask for necessary documents like registration certificate, fire safety certificate, and food license.

6. Understand the Rules
Go through the hostel rules and regulations. Make sure you're comfortable with the curfew timings and other restrictions.

7. Check Payment Terms
Understand the payment structure, refund policy, and any additional charges.

8. Book in Advance
Once you've found the right hostel, book it immediately to secure your spot.

Remember, a good hostel can significantly impact your college experience, so take your time to make the right choice.`,
    author: "Ayush Yadav",
    date: "March 15, 2024",
    image: "/blog-images/hostel-steps.jpg",
    readTime: "5 min read",
    keywords: ["how to get hostel", "hostel admission guide", "hostel booking steps"]
  },
  {
    id: 2,
    title: "Necessary Things You Should Carry from Home for Hostel Life",
    content: `Moving to a hostel? Here's your essential packing list to make your hostel life comfortable:

1. Bedding Essentials
- Bed sheets (2-3 sets)
- Pillow and pillow covers
- Blanket/Quilt
- Mattress protector

2. Clothing
- Daily wear clothes
- Formal wear
- Undergarments
- Socks
- Winter wear
- Rain gear

3. Toiletries
- Toothbrush and toothpaste
- Soap/Shower gel
- Shampoo and conditioner
- Deodorant
- Towels (2-3)
- Sanitary items

4. Study Materials
- Notebooks
- Stationery
- Laptop and charger
- Power bank
- Extension cord

5. Kitchen Items
- Water bottle
- Lunch box
- Cutlery set
- Snacks and dry food

6. First Aid
- Basic medicines
- Band-aids
- Pain relievers
- Prescription medicines

7. Miscellaneous
- Laundry bag
- Hangers
- Lock and keys
- Umbrella
- ID cards and documents

Remember to pack light but smart. You can always buy things you need later.`,
    author: "Muskan Singh",
    date: "March 14, 2024",
    image: "/blog-images/hostel-essentials.jpg",
    readTime: "4 min read",
    keywords: ["hostel essentials", "packing list for hostel", "what to carry to hostel"]
  },
  {
    id: 3,
    title: "How to Choose the Right Hostel Near Your College",
    content: `Choosing the right hostel is crucial for your college life. Here's how to make the best choice:

1. Location
- Distance from college
- Transportation availability
- Safety of the area
- Nearby facilities

2. Facilities
- Room types and sizes
- Bathroom facilities
- Common areas
- Study rooms
- WiFi availability
- Food quality

3. Budget
- Monthly rent
- Food charges
- Additional fees
- Payment terms

4. Rules and Regulations
- Curfew timings
- Visitor policies
- Food timings
- Room maintenance

5. Security
- CCTV cameras
- Security guards
- Entry/exit system
- Emergency protocols

6. Reviews and Reputation
- Student feedback
- Years in operation
- Management reputation
- Past incidents

7. Additional Services
- Laundry facilities
- Cleaning services
- Medical assistance
- Maintenance support

Take your time to visit multiple hostels and compare them before making a decision.`,
    author: "Rohit Kumar",
    date: "March 13, 2024",
    image: "/blog-images/choose-hostel.jpg",
    readTime: "6 min read",
    keywords: ["choose best hostel", "hostel selection guide", "hostel near college"]
  },
  {
    id: 4,
    title: "Top 10 Mistakes Students Make While Choosing a Hostel",
    content: `Avoid these common mistakes when selecting your hostel:

1. Not Visiting in Person
Don't rely solely on online photos. Visit the hostel to check the actual conditions.

2. Ignoring Location
A slightly cheaper hostel far from college might cost more in transportation and time.

3. Not Reading Reviews
Check multiple review sources to get a complete picture.

4. Overlooking Security
Don't compromise on security features for lower rent.

5. Not Checking Food Quality
Food is crucial for your health and daily routine.

6. Ignoring Rules
Understand all rules before booking to avoid conflicts later.

7. Not Checking Maintenance
Check how well the hostel is maintained and how quickly issues are resolved.

8. Focusing Only on Price
The cheapest option isn't always the best value for money.

9. Not Meeting Current Residents
Talk to current students to get real feedback.

10. Rushing the Decision
Take your time to make an informed choice.`,
    author: "Ayush Yadav",
    date: "March 12, 2024",
    image: "/blog-images/hostel-mistakes.jpg",
    readTime: "5 min read",
    keywords: ["hostel mistakes", "avoid hostel issues", "hostel choosing errors"]
  },
  {
    id: 5,
    title: "How to Manage Your Budget in a Hostel as a Student",
    content: `Managing finances in a hostel can be challenging. Here's how to do it effectively:

1. Create a Budget
- List all income sources
- Track all expenses
- Set spending limits
- Save for emergencies

2. Food Management
- Eat in the mess when possible
- Cook simple meals
- Buy groceries in bulk
- Avoid frequent outside food

3. Transportation
- Use public transport
- Share auto/cab rides
- Walk when possible
- Get a student pass

4. Entertainment
- Look for student discounts
- Use free campus facilities
- Share streaming subscriptions
- Attend free events

5. Shopping
- Buy essentials in bulk
- Look for student discounts
- Avoid impulse buying
- Share items with roommates

6. Emergency Fund
- Save 10% of your budget
- Keep some cash handy
- Have a backup plan

7. Track Expenses
- Use budgeting apps
- Keep receipts
- Review spending weekly
- Adjust budget as needed

Remember, good financial habits now will help you throughout life.`,
    author: "Muskan Singh",
    date: "March 11, 2024",
    image: "/blog-images/hostel-budget.jpg",
    readTime: "6 min read",
    keywords: ["hostel budget tips", "money saving in hostel", "hostel financial planning"]
  },
  {
    id: 6,
    title: "Roommate Etiquettes: How to Maintain Peace in Shared Hostels",
    content: `Living with roommates requires understanding and compromise. Here are essential etiquettes:

1. Communication
- Be clear about expectations
- Discuss issues calmly
- Listen to others
- Respect boundaries

2. Space Management
- Keep your area clean
- Don't encroach on others' space
- Share storage fairly
- Maintain common areas

3. Noise Control
- Respect quiet hours
- Use headphones
- Keep phone calls private
- Be mindful of others

4. Sharing Resources
- Take turns cleaning
- Share expenses fairly
- Don't use others' items without permission
- Replace what you use

5. Food and Kitchen
- Label your food
- Clean up after cooking
- Share kitchen duties
- Respect food preferences

6. Guests
- Inform before bringing guests
- Limit guest stays
- Ensure guests follow rules
- Be considerate of others

7. Conflict Resolution
- Address issues early
- Be open to compromise
- Apologize when wrong
- Move on from conflicts

Remember, good roommate relationships make hostel life enjoyable.`,
    author: "Rohit Kumar",
    date: "March 10, 2024",
    image: "/blog-images/roommate-etiquette.jpg",
    readTime: "5 min read",
    keywords: ["roommate tips", "hostel etiquette", "living with roommates"]
  },
  {
    id: 7,
    title: "Best Food Hacks for Hostel Students with Limited Resources",
    content: `Make the most of your hostel kitchen with these food hacks:

1. Quick Breakfast Ideas
- Overnight oats
- Fruit and yogurt
- Toast with spreads
- Instant noodles with veggies

2. Easy Lunch Options
- Rice and dal
- Pasta dishes
- Sandwiches
- Salads

3. Snack Solutions
- Popcorn
- Nuts and seeds
- Fruits
- Energy bars

4. Cooking Tips
- Use one-pot recipes
- Cook in batches
- Share cooking with friends
- Use simple ingredients

5. Storage Solutions
- Airtight containers
- Ziplock bags
- Label everything
- First in, first out

6. Budget-Friendly Ingredients
- Rice and pulses
- Seasonal vegetables
- Eggs
- Basic spices

7. Time-Saving Tricks
- Pre-cut vegetables
- Use instant mixes
- Cook extra for leftovers
- Plan meals ahead

Remember, good food doesn't have to be expensive or complicated.`,
    author: "Ayush Yadav",
    date: "March 9, 2024",
    image: "/blog-images/food-hacks.jpg",
    readTime: "4 min read",
    keywords: ["hostel food hacks", "cooking in hostel", "instant food for hostel"]
  },
  {
    id: 8,
    title: "Hostel Life vs PG Life: What Should You Choose?",
    content: `Compare hostel and PG life to make the right choice:

Hostel Life
1. Advantages
- Structured environment
- Regular meals
- More social interaction
- Better security
- Study atmosphere

2. Disadvantages
- Strict rules
- Less privacy
- Fixed timings
- Limited customization

PG Life
1. Advantages
- More freedom
- Better privacy
- Flexible timings
- Customizable space
- Independent cooking

2. Disadvantages
- Higher cost
- More responsibility
- Less social interaction
- Need to manage everything

Consider these factors:
- Your personality
- Budget
- Location
- College requirements
- Family preferences

Choose based on what suits your lifestyle and needs best.`,
    author: "Muskan Singh",
    date: "March 8, 2024",
    image: "/blog-images/hostel-vs-pg.jpg",
    readTime: "5 min read",
    keywords: ["hostel vs pg", "best accommodation for students", "pg or hostel"]
  },
  {
    id: 9,
    title: "How to Stay Safe and Healthy in a Hostel Environment",
    content: `Stay safe and healthy in your hostel with these tips:

1. Personal Safety
- Lock your room
- Don't share keys
- Be aware of surroundings
- Report suspicious activities

2. Health Maintenance
- Regular exercise
- Balanced diet
- Adequate sleep
- Regular check-ups

3. Hygiene
- Keep room clean
- Wash hands regularly
- Maintain personal hygiene
- Clean shared spaces

4. Emergency Preparedness
- Know emergency numbers
- First aid kit
- Important documents
- Emergency contacts

5. Mental Health
- Stay connected with family
- Make friends
- Take breaks
- Seek help when needed

6. Food Safety
- Check food quality
- Store food properly
- Stay hydrated
- Avoid street food

7. Security Measures
- Use CCTV areas
- Travel in groups
- Inform about whereabouts
- Follow hostel rules

Remember, your safety and health are priorities.`,
    author: "Rohit Kumar",
    date: "March 7, 2024",
    image: "/blog-images/hostel-safety.jpg",
    readTime: "5 min read",
    keywords: ["hostel safety", "health tips for hostel students", "secure hostel living"]
  },
  {
    id: 10,
    title: "How Hostel Life Helps You Become Independent",
    content: `Hostel life teaches valuable life skills:

1. Time Management
- Balancing studies and fun
- Meeting deadlines
- Managing schedules
- Prioritizing tasks

2. Financial Independence
- Budgeting
- Saving money
- Making purchases
- Handling expenses

3. Social Skills
- Making friends
- Resolving conflicts
- Working in teams
- Building networks

4. Personal Growth
- Self-discipline
- Decision making
- Problem solving
- Adaptability

5. Life Skills
- Laundry
- Basic cooking
- Room maintenance
- Personal care

6. Responsibility
- Managing belongings
- Following rules
- Taking care of health
- Being accountable

7. Cultural Exposure
- Meeting diverse people
- Learning new perspectives
- Understanding differences
- Building tolerance

Hostel life shapes you into a responsible adult.`,
    author: "Ayush Yadav",
    date: "March 6, 2024",
    image: "/blog-images/independent-life.jpg",
    readTime: "5 min read",
    keywords: ["benefits of hostel life", "independent student life", "hostel experience"]
  }
]

export default function BlogsPage() {
  const [visibleBlogs, setVisibleBlogs] = useState(5)
  const [selectedBlog, setSelectedBlog] = useState<typeof blogs[0] | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Scroll to top when blog changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedBlog])

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showMoreBlogs = () => {
    setVisibleBlogs(prev => prev + 5)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // SEO metadata
  const seoTitle = selectedBlog 
    ? `${selectedBlog.title} | Hostel Sathi Blog`
    : "Hostel Sathi Blog - Student Accommodation Tips & Guides"
  
  const seoDescription = selectedBlog
    ? selectedBlog.content.substring(0, 160) + "..."
    : "Find expert advice on hostel life, accommodation tips, and student living guides. Learn about hostel selection, roommate etiquette, and more."

  const seoKeywords = selectedBlog
    ? [...selectedBlog.keywords, "hostel", "student accommodation", "college life", "hostel tips"]
    : ["hostel", "student accommodation", "college life", "hostel tips", "hostel guide", "student living"]

  if (selectedBlog) {
    const recommendedBlogs = blogs
      .filter(blog => blog.id !== selectedBlog.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    return (
      <>
        <Head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          <meta name="keywords" content={seoKeywords.join(", ")} />
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDescription} />
          <meta property="og:type" content="article" />
          <meta property="og:image" content={selectedBlog.image} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoTitle} />
          <meta name="twitter:description" content={seoDescription} />
          <meta name="twitter:image" content={selectedBlog.image} />
        </Head>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <CommonNavbar />
          <main className="max-w-4xl mx-auto px-4 py-8">
            <button
              onClick={() => setSelectedBlog(null)}
              className="flex items-center text-[#5A00F0] mb-6 hover:text-[#4800C0] transition-colors duration-300 group"
            >
              <ChevronRight className="rotate-180 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" size={20} />
              Back to Blogs
            </button>
            <article className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
              <div className="relative h-64 md:h-96">
                <Image
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#5A00F0] to-[#B366FF] bg-clip-text text-transparent">
                  {selectedBlog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                  <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                    <User size={16} className="mr-2 text-[#5A00F0]" />
                    {selectedBlog.author}
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                    <Clock size={16} className="mr-2 text-[#5A00F0]" />
                    {selectedBlog.readTime}
                  </div>
                  <div className="bg-gray-50 px-3 py-1 rounded-full">
                    {formatDate(selectedBlog.date)}
                  </div>
                </div>
                <div className="prose max-w-none">
                  {selectedBlog.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 text-gray-700 leading-relaxed text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {selectedBlog.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-[#5A00F0] hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            {/* Recommended Blogs Section */}
            <div className="mt-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-[#5A00F0] to-[#B366FF] bg-clip-text text-transparent">
                Recommended Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedBlogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                    onClick={() => setSelectedBlog(blog)}
                  >
                    <div className="relative h-48">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover transform hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-3 line-clamp-2 hover:text-[#5A00F0] transition-colors duration-300">
                        {blog.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User size={14} className="mr-1 text-[#5A00F0]" />
                          {blog.author}
                        </div>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1 text-[#5A00F0]" />
                          {blog.readTime}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </main>
          <CommonFooter />
          <WhatsAppButton />
          <MobileNav />
          
          {/* Scroll to Top Button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-[#5A00F0] text-white p-3 rounded-full shadow-lg hover:bg-[#4800C0] transform hover:scale-110 transition-all duration-300 z-50"
              aria-label="Scroll to top"
            >
              <ArrowUp size={24} />
            </button>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords.join(", ")} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <CommonNavbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#5A00F0] to-[#B366FF] bg-clip-text text-transparent">
            Blogs & Articles
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(0, visibleBlogs).map((blog) => (
              <article
                key={blog.id}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedBlog(blog)}
              >
                <div className="relative h-48">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-3 line-clamp-2 hover:text-[#5A00F0] transition-colors duration-300">
                    {blog.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <User size={14} className="mr-1 text-[#5A00F0]" />
                      {blog.author}
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-[#5A00F0]" />
                      {blog.readTime}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {blog.content.split('\n\n')[0]}
                  </p>
                </div>
              </article>
            ))}
          </div>
          {visibleBlogs < blogs.length && (
            <div className="text-center mt-12">
              <button
                onClick={showMoreBlogs}
                className="bg-gradient-to-r from-[#5A00F0] to-[#B366FF] text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-purple-200 transform hover:scale-105 transition-all duration-300"
              >
                Load More Blogs
              </button>
            </div>
          )}
        </main>
        <CommonFooter />
        <WhatsAppButton />
        <MobileNav />
        
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-[#5A00F0] text-white p-3 rounded-full shadow-lg hover:bg-[#4800C0] transform hover:scale-110 transition-all duration-300 z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp size={24} />
          </button>
        )}
      </div>
    </>
  )
}
