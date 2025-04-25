"use client"

import { useState } from "react"
import Link from "next/link"
import { BookIcon, UserCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

type Book = {
  id: string
  title: string
  author: string
  genre: string
  borrowed_date: string
  borrower: string
}

export default function BorrowedBooks() {
  const { toast } = useToast()

  // In a real app, this would be fetched from the API
  const [books, setBooks] = useState<Book[]>([
    {
      id: "2",
      title: "Dune",
      author: "Frank Herbert",
      genre: "Science Fiction",
      borrowed_date: "2023-03-15",
      borrower: "Alice",
    },
    {
      id: "5",
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "Fiction",
      borrowed_date: "2023-04-01",
      borrower: "Bob",
    },
  ])

  const handleReturn = async (id: string) => {
    try {
      // In a real app, this would call the API
      // await returnBook(id);

      setBooks(books.filter((book) => book.id !== id))

      toast({
        title: "Book returned",
        description: "The book has been marked as returned.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to return the book.",
        variant: "destructive",
      })
    }
  }

  if (books.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <UserCheck className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No borrowed books</h3>
          <p className="mt-2 text-sm text-muted-foreground">Books that are currently borrowed will appear here.</p>
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
                  <div className="mt-1 space-y-1">
                    <Badge variant="outline">{book.genre}</Badge>
                    <div className="text-xs text-muted-foreground">
                      Borrowed by <span className="font-medium">{book.borrower}</span> on{" "}
                      {new Date(book.borrowed_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleReturn(book.id)}>
                Return
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
