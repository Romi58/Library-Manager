import { Suspense } from "react"
import Link from "next/link"
import { BookOpen, PlusCircle, BarChart3, BookMarked } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import BookList from "@/components/book-list"
import LibraryStats from "@/components/library-stats"
import SearchBar from "@/components/search-bar"
import RecentlyAddedBooks from "@/components/recently-added-books"
import BorrowedBooks from "@/components/borrowed-books"

export default function Dashboard() {
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-7 w-16" />}>
                <LibraryStats stat="total" />
              </Suspense>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Books</CardTitle>
              <BookMarked className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-7 w-16" />}>
                <LibraryStats stat="available" />
              </Suspense>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Borrowed Books</CardTitle>
              <BookMarked className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-7 w-16" />}>
                <LibraryStats stat="borrowed" />
              </Suspense>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Genres</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-7 w-16" />}>
                <LibraryStats stat="genres" />
              </Suspense>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="all-books" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all-books">All Books</TabsTrigger>
            <TabsTrigger value="recently-added">Recently Added</TabsTrigger>
            <TabsTrigger value="borrowed">Borrowed</TabsTrigger>
          </TabsList>
          <TabsContent value="all-books" className="space-y-4">
            <Suspense fallback={<BookListSkeleton />}>
              <BookList />
            </Suspense>
          </TabsContent>
          <TabsContent value="recently-added" className="space-y-4">
            <Suspense fallback={<BookListSkeleton />}>
              <RecentlyAddedBooks />
            </Suspense>
          </TabsContent>
          <TabsContent value="borrowed" className="space-y-4">
            <Suspense fallback={<BookListSkeleton />}>
              <BorrowedBooks />
            </Suspense>
          </TabsContent>
        </Tabs>
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
