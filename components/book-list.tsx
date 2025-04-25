"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BookIcon, BookOpen, Edit, MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

type BookType = {
  id: string
  title: string
  author: string
  genre: string
  publication_year: number | null
  isbn: string | null
  is_borrowed: boolean
}

export default function BookList() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""
  const genre = searchParams.get("genre") || ""

  // In a real app, this would be fetched from the API
  const [books, setBooks] = useState<BookType[]>([
    {
      id: "1",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      publication_year: 1937,
      isbn: "9780547928227",
      is_borrowed: false,
    },
    {
      id: "2",
      title: "Dune",
      author: "Frank Herbert",
      genre: "Science Fiction",
      publication_year: 1965,
      isbn: "9780441172719",
      is_borrowed: true,
    },
    {
      id: "3",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Romance",
      publication_year: 1813,
      isbn: "9780141439518",
      is_borrowed: false,
    },
    {
      id: "4",
      title: "The Shining",
      author: "Stephen King",
      genre: "Horror",
      publication_year: 1977,
      isbn: "9780307743657",
      is_borrowed: false,
    },
    {
      id: "5",
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "Fiction",
      publication_year: 1988,
      isbn: "9780062315007",
      is_borrowed: true,
    },
  ])

  // Filter books based on search and genre
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      search === "" ||
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())

    const matchesGenre = genre === "" || book.genre === genre

    return matchesSearch && matchesGenre
  })

  const handleQuickBorrow = async (id: string) => {
    try {
      // In a real app, this would call the API
      // await borrowBook(id);
      setBooks(books.map((book) => (book.id === id ? { ...book, is_borrowed: true } : book)))

      toast({
        title: "Book borrowed",
        description: "The book has been marked as borrowed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to borrow the book.",
        variant: "destructive",
      })
    }
  }

  const handleQuickReturn = async (id: string) => {
    try {
      // In a real app, this would call the API
      // await returnBook(id);
      setBooks(books.map((book) => (book.id === id ? { ...book, is_borrowed: false } : book)))

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

  if (filteredBooks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No books found</h3>
          <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filters, or add a new book.</p>
          <Button asChild className="mt-4">
            <Link href="/books/add">Add a Book</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {filteredBooks.map((book) => (
        <Card key={book.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-start justify-between p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                  <BookIcon className="h-6 w-6" />
                </div>
                <div>
                  <Link href={`/books/${book.id}`} className="font-medium hover:underline">
                    {book.title}
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    by {book.author} • {book.publication_year}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline">{book.genre}</Badge>
                    {book.is_borrowed ? (
                      <Badge variant="secondary">Borrowed</Badge>
                    ) : (
                      <Badge variant="default">Available</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {book.is_borrowed ? (
                  <Button variant="outline" size="sm" onClick={() => handleQuickReturn(book.id)}>
                    Return
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleQuickBorrow(book.id)}>
                    Borrow
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/books/${book.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/books/${book.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
