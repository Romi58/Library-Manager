"use client"

import { useState } from "react"

interface LibraryStatsProps {
  stat: "total" | "available" | "borrowed" | "genres" | "authors"
}

export default function LibraryStats({ stat }: LibraryStatsProps) {
  // In a real app, this would be fetched from the API
  const [stats, setStats] = useState({
    total_books: 5,
    available_books: 3,
    borrowed_books: 2,
    unique_genres: 5,
    unique_authors: 5,
  })

  let displayValue = ""
  const trend = ""

  switch (stat) {
    case "total":
      displayValue = stats.total_books.toString()
      break
    case "available":
      displayValue = stats.available_books.toString()
      break
    case "borrowed":
      displayValue = stats.borrowed_books.toString()
      break
    case "genres":
      displayValue = stats.unique_genres.toString()
      break
    case "authors":
      displayValue = stats.unique_authors.toString()
      break
  }

  return (
    <div className="text-2xl font-bold">
      {displayValue}
      {trend && (
        <span className={`ml-2 text-sm font-normal ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
          {trend === "up" ? "↑" : "↓"}
        </span>
      )}
    </div>
  )
}
