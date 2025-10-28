"use client"

import { useState } from "react"
import { Search, Clock, BarChart3, Star, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock course data
const courses = [
  {
    id: 1,
    title: "Introduction to Philosophy",
    description:
      "Explore fundamental questions about existence, knowledge, values, reason, mind, and language through the works of great thinkers.",
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.8,
    category: "Philosophy",
  },
  {
    id: 2,
    title: "Ancient Greek History",
    description:
      "Journey through the rise and fall of ancient Greek civilization, from the Bronze Age to the Hellenistic period.",
    duration: "10 weeks",
    level: "Intermediate",
    rating: 4.9,
    category: "History",
  },
  {
    id: 3,
    title: "Critical Thinking & Logic",
    description:
      "Develop essential reasoning skills to analyze arguments, identify fallacies, and construct sound logical frameworks.",
    duration: "6 weeks",
    level: "Beginner",
    rating: 4.7,
    category: "Philosophy",
  },
  {
    id: 4,
    title: "Renaissance Art & Culture",
    description:
      "Discover the artistic revolution that transformed Europe, studying masterworks and the cultural context that shaped them.",
    duration: "12 weeks",
    level: "Advanced",
    rating: 4.9,
    category: "Art History",
  },
  {
    id: 5,
    title: "Ethics in Modern Society",
    description:
      "Examine contemporary moral dilemmas through various ethical frameworks and philosophical perspectives.",
    duration: "8 weeks",
    level: "Intermediate",
    rating: 4.6,
    category: "Philosophy",
  },
  {
    id: 6,
    title: "Classical Literature",
    description:
      "Read and analyze foundational texts from Homer, Virgil, Ovid, and other classical authors that shaped Western literature.",
    duration: "10 weeks",
    level: "Intermediate",
    rating: 4.8,
    category: "Literature",
  },
]

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useState("philosophy")
  const [category, setCategory] = useState("All Categories")
  const [duration, setDuration] = useState("Any Duration")
  const [level, setLevel] = useState("All Levels")
  const [visibleCourses, setVisibleCourses] = useState(6)

  const handleLoadMore = () => {
    setVisibleCourses((prev) => prev + 3)
  }

  return (
    <div className="min-h-screen">
      {/* Fixed Search Bar */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#1e293b]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#1e293b]/60">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-1 shadow-lg shadow-blue-500/50 overflow-hidden">
                <img src="/socrates-logo.png" alt="Sokrat Logo" className="h-full w-full object-cover rounded-lg" />
              </div>
              <span className="font-sans text-2xl font-bold text-foreground">Sokrat</span>
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 pr-4 bg-[#0f172a]/50 border-white/20 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border-b border-white/10 bg-[#1e293b]/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Filter by:</span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-white/20 hover:from-blue-600/30 hover:to-cyan-600/30 hover:border-white/30 text-foreground font-medium transition-all hover:shadow-lg hover:shadow-blue-500/20"
                >
                  {category}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#1e293b] border-white/20">
                <DropdownMenuItem onClick={() => setCategory("All Categories")}>All Categories</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategory("Philosophy")}>Philosophy</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategory("History")}>History</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategory("Art History")}>Art History</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategory("Literature")}>Literature</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-white/20 hover:from-blue-600/30 hover:to-cyan-600/30 hover:border-white/30 text-foreground font-medium transition-all hover:shadow-lg hover:shadow-blue-500/20"
                >
                  {duration}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#1e293b] border-white/20">
                <DropdownMenuItem onClick={() => setDuration("Any Duration")}>Any Duration</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDuration("6 weeks")}>6 weeks</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDuration("8 weeks")}>8 weeks</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDuration("10 weeks")}>10 weeks</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDuration("12+ weeks")}>12+ weeks</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-white/20 hover:from-blue-600/30 hover:to-cyan-600/30 hover:border-white/30 text-foreground font-medium transition-all hover:shadow-lg hover:shadow-blue-500/20"
                >
                  {level}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#1e293b] border-white/20">
                <DropdownMenuItem onClick={() => setLevel("All Levels")}>All Levels</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLevel("Beginner")}>Beginner</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLevel("Intermediate")}>Intermediate</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLevel("Advanced")}>Advanced</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-balance font-sans text-3xl font-bold text-foreground">
            Search Results for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              "{searchQuery}"
            </span>
          </h1>
          <p className="mt-2 text-base text-muted-foreground">Found {courses.length} courses matching your query</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, visibleCourses).map((course, index) => (
            <Card
              key={course.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/30 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="relative space-y-4 pb-4 z-10">
                <div className="inline-block self-start rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-500/50">
                  {course.category}
                </div>
                <CardTitle className="text-balance font-sans text-xl font-bold leading-tight text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-pretty font-body text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative mt-auto pt-4 border-t border-white/10 z-10">
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BarChart3 className="h-4 w-4 text-cyan-400" />
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-foreground">{course.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {visibleCourses < courses.length && (
          <div className="mt-14 flex justify-center">
            <Button
              onClick={handleLoadMore}
              size="lg"
              className="min-w-[220px] h-12 font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300"
            >
              Load More Courses
            </Button>
          </div>
        )}

        {visibleCourses >= courses.length && courses.length > 6 && (
          <div className="mt-14 text-center">
            <p className="text-sm text-muted-foreground font-medium">You've reached the end of the results</p>
          </div>
        )}
      </div>
    </div>
  )
}
