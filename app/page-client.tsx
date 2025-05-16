"use client"

import { useState, useEffect, useRef } from "react"

export default function CarouselController() {
  // Hero carousel
  const [activeSlide, setActiveSlide] = useState(0)
  const totalSlides = 5

  // College carousel
  const collegeCarouselRef = useRef<HTMLDivElement>(null)

  // Review carousel
  const [activeReviewPage, setActiveReviewPage] = useState(0)
  const reviewTrackRef = useRef<HTMLDivElement>(null)
  const totalReviewPages = 3

  // Hero carousel auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Handle hero carousel navigation
  const goToSlide = (index: number) => {
    setActiveSlide(index)
    const track = document.querySelector(".carousel-track")as HTMLElement
    if (track) {
      track.classList.remove("animate-carousel")
      void track.offsetWidth // Trigger reflow
      track.classList.add("animate-carousel")

      // Update transform
      const trackElement = track as HTMLElement
      trackElement.style.transform = `translateX(-${index * 100}%)`
    }
  }

  // Handle college carousel navigation
  const scrollColleges = (direction: "prev" | "next") => {
    if (collegeCarouselRef.current) {
      const scrollAmount = direction === "next" ? 320 : -320
      collegeCarouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Handle review carousel navigation
  const goToReviewPage = (index: number) => {
    setActiveReviewPage(index)
    if (reviewTrackRef.current) {
      reviewTrackRef.current.style.transform = `translateX(-${index * 100}%)`
    }
  }

  // Attach event listeners after component mounts
  useEffect(() => {
    // Attach click handlers for hero carousel
    const prevBtn = document.querySelector(".carousel-container button:first-child")
    const nextBtn = document.querySelector(".carousel-container button:last-of-type")

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goToSlide((activeSlide - 1 + totalSlides) % totalSlides)
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goToSlide((activeSlide + 1) % totalSlides)
      })
    }

    // Attach click handlers for college carousel
    const collegePrevBtn = document.querySelector(".college-prev")
    const collegeNextBtn = document.querySelector(".college-next")

    if (collegePrevBtn) {
      collegePrevBtn.addEventListener("click", () => scrollColleges("prev"))
    }

    if (collegeNextBtn) {
      collegeNextBtn.addEventListener("click", () => scrollColleges("next"))
    }

    // Attach click handlers for review carousel
    const reviewPrevBtn = document.querySelector(".review-prev")
    const reviewNextBtn = document.querySelector(".review-next")

    if (reviewPrevBtn) {
      reviewPrevBtn.addEventListener("click", () => {
        goToReviewPage((activeReviewPage - 1 + totalReviewPages) % totalReviewPages)
      })
    }

    if (reviewNextBtn) {
      reviewNextBtn.addEventListener("click", () => {
        goToReviewPage((activeReviewPage + 1) % totalReviewPages)
      })
    }

    // Update indicators when active slide changes
    const indicators = document.querySelectorAll(".carousel-indicators button")
    indicators.forEach((indicator, index) => {
      if (index === activeSlide) {
        indicator.classList.add("bg-[#5A00F0]")
        indicator.classList.remove("bg-gray-300")
        indicator.classList.add("w-8")
        indicator.classList.remove("w-2")
      } else {
        indicator.classList.remove("bg-[#5A00F0]")
        indicator.classList.add("bg-gray-300")
        indicator.classList.remove("w-8")
        indicator.classList.add("w-2")
      }
    })

    // Update review indicators
    const reviewIndicators = document.querySelectorAll(".review-indicators button")
    reviewIndicators.forEach((indicator, index) => {
      if (index === activeReviewPage) {
        indicator.classList.add("bg-[#5A00F0]")
        indicator.classList.remove("bg-gray-300")
        indicator.classList.add("w-8")
        indicator.classList.remove("w-2")
      } else {
        indicator.classList.remove("bg-[#5A00F0]")
        indicator.classList.add("bg-gray-300")
        indicator.classList.remove("w-8")
        indicator.classList.add("w-2")
      }
    })
  }, [activeSlide, activeReviewPage])

  return null
}
