"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  BookOpen,
  FileText,
  Video,
  Edit3,
  PresentationIcon as PresentationChart,
  GraduationCap,
  FileCheck,
  ClipboardList,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react"

const tools = [
  {
    title: "MCQ Generator",
    description: "Create multiple choice questions from any topic",
    icon: ClipboardList,
    href: "/mcq-generator",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    title: "YouTube Generator",
    description: "Generate educational video scripts and ideas",
    icon: Video,
    href: "/youtube-generator",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
  },
  {
    title: "Text Summarizer",
    description: "Summarize long texts for easier comprehension",
    icon: FileText,
    href: "/text-summarizer",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    title: "Text Rewriter",
    description: "Rewrite content for different grade levels",
    icon: Edit3,
    href: "/text-rewriter",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    title: "Lesson Plan",
    description: "Create structured lesson plans",
    icon: BookOpen,
    href: "/lesson-plan",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  {
    title: "PPT Generator",
    description: "Generate presentation outlines and content",
    icon: PresentationChart,
    href: "/ppt-generator",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
  },
  {
    title: "Essay Grader",
    description: "Provide feedback on student essays",
    icon: GraduationCap,
    href: "/essay-grader",
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
  },
  {
    title: "Worksheet Generator",
    description: "Create educational worksheets",
    icon: FileCheck,
    href: "/worksheet-generator",
    color: "text-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
  },
]

const stats = [
  { title: "Tools Available", value: "8", icon: TrendingUp, description: "AI-powered tools" },
  { title: "Grade Levels", value: "K-12", icon: Users, description: "Kindergarten to 12th grade" },
  { title: "Time Saved", value: "80%", icon: Clock, description: "Average time reduction" },
]

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    console.log("Home page session:", session, "status:", status);
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // If no session, show sign in prompt
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl lg:text-2xl">Welcome to GrowWise</CardTitle>
            <CardDescription>Please sign in to access the AI Teacher Toolkit</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">AI Teacher Toolkit Dashboard</h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Welcome back, <span className="font-medium">{session.user?.name}</span>! Comprehensive AI-powered tools for
          educators from Kindergarten to 12th Grade
        </p>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="responsive-grid grid-md-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-enhanced">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-xl lg:text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{stat.description}</p>
                </div>
                <div className="p-2 lg:p-3 rounded-lg bg-gradient-to-br from-growwise-navy/10 to-growwise-orange/10">
                  <stat.icon className="h-5 w-5 lg:h-6 lg:w-6 text-growwise-navy dark:text-growwise-orange" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tools Grid - Responsive */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl lg:text-2xl font-semibold text-foreground">Available Tools</h2>
          <p className="text-sm text-muted-foreground hidden sm:block">Choose a tool to get started</p>
        </div>

        <div className="responsive-grid grid-md-2 grid-lg-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <Card key={tool.title} className="card-enhanced group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 lg:p-3 rounded-lg ${tool.bgColor} transition-transform group-hover:scale-110`}>
                    <tool.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${tool.color}`} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardTitle className="text-base lg:text-lg leading-tight">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">{tool.description}</CardDescription>
                <Button asChild className="w-full btn-enhanced">
                  <Link href={tool.href}>
                    Open Tool
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section - Responsive */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl">Key Features</CardTitle>
          <CardDescription>What makes our AI Teacher Toolkit special</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="responsive-grid grid-md-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm lg:text-base">Grade Level Adaptation</h4>
              <p className="text-xs lg:text-sm text-muted-foreground">
                All tools can adapt content for K-12 levels automatically
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm lg:text-base">Subject Flexibility</h4>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Works across all subjects - Math, Science, English, History, and more
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm lg:text-base">Professional Interface</h4>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Clean, intuitive design with dark/light mode support
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm lg:text-base">Production Ready</h4>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Optimized for deployment and ready for classroom use
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
