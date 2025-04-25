"use client"

import { useState } from "react"
import Link from "next/link"
import { BookIcon, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Book = {
  id: string
  title: string
  author: string
  genre: string
  date_added: string
  is_borrowed: boolean
}

export default function RecentlyAddedBooks() {
  // In a real app, this would be fetched from the API
  const [books, setBooks] = useState<Book[]>([
    {
      id: "5",
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "Fiction",
      date_added: "2023-04-15",
      is_borrowed: true,
    },
    {
      id: "4",
      title: "The Shining",
      author: "Stephen King",
      genre: "Horror",
      date_added: "2023-04-10",
      is_borrowed: false,
    },
    {
      id: "3",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Romance",
      date_added: "2023-04-05",
      is_borrowed: false,
    },
  ])

  if (books.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No recently added books</h3>
          <p className="mt-2 text-sm text-muted-foreground">Books you add to your library will appear here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <Card key={book.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                  <BookIcon className="h-6 w-6" />
                </div>
                <div>
                  <Link href={`/books/${book.id}`} className="font-medium hover:underline">
                    {book.title}
                  </Link>
                  <div className="text-sm text-muted-foreground">by {book.author}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline">{book.genre}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Added on {new Date(book.date_added).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              {book.is_borrowed ? (
                <Badge variant="secondary">Borrowed</Badge>
              ) : (
                <Badge variant="default">Available</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
