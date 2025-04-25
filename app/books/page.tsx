import { Suspense } from "react"
import Link from "next/link"
import { BookOpen, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import BookList from "@/components/book-list"
import SearchBar from "@/components/search-bar"
import BookFilters from "@/components/book-filters"

export default function BooksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6" />
          <span>Personal Library Manager</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <SearchBar />
          <Button asChild variant="default">
            <Link href="/books/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Book
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/4">
            <Card>
              <CardContent className="p-4">
                <BookFilters />
              </CardContent>
            </Card>
          </div>
          <div className="md:w-3/4">
            <Suspense fallback={<BookListSkeleton />}>
              <BookList />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}

function BookListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
