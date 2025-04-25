"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import BorrowReturnActions from "@/components/borrow-return-actions"
import DeleteBookDialog from "@/components/delete-book-dialog"

type Book = {
  id: string
  title: string
  author: string
  genre: string
  publication_year: number | null
  isbn: string | null
  is_borrowed: boolean
  borrowed_date: string | null
  borrower: string | null
  description: string | null
}

export default function BookDetails({ id }: { id: string }) {
  // In a real app, this would be fetched from the API
  const [book, setBook] = useState<Book>({
    id,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    publication_year: 1937,
    isbn: "9780547928227",
    is_borrowed: false,
    borrowed_date: null,
    borrower: null,
    description:
      "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep one day to whisk him away on an adventure.",
  })

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{book.title}</CardTitle>
            <CardDescription>by {book.author}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="icon">
              <Link href={`/books/${id}/edit`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">{book.genre}</Badge>
          {book.is_borrowed ? <Badge variant="secondary">Borrowed</Badge> : <Badge variant="default">Available</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Publication Year</h3>
            <p>{book.publication_year || "Unknown"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">ISBN</h3>
            <p>{book.isbn || "Not available"}</p>
          </div>
        </div>

        {book.is_borrowed && (
          <div className="rounded-md bg-muted p-4">
            <h3 className="font-medium">Borrowing Information</h3>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Borrowed by</p>
                <p>{book.borrower || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Borrowed on</p>
                <p>{book.borrowed_date || "Unknown date"}</p>
              </div>
            </div>
          </div>
        )}

        {book.description && (
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="mt-2 text-muted-foreground">{book.description}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <BorrowReturnActions
          id={id}
          isBorrowed={book.is_borrowed}
          onStatusChange={(isBorrowed) => setBook({ ...book, is_borrowed: isBorrowed })}
        />
      </CardFooter>

      <DeleteBookDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        bookId={id}
        bookTitle={book.title}
      />
    </Card>
  )
}
