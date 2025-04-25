import { Suspense } from "react"
import Link from "next/link"
import { BookOpen, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import BookDetails from "@/components/book-details"

export default function BookPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6" />
          <span>Personal Library Manager</span>
        </Link>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
        <Suspense fallback={<BookDetailsSkeleton />}>
          <BookDetails id={params.id} />
        </Suspense>
      </main>
    </div>
  )
}

function BookDetailsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[200px]" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-[120px]" />
      </CardFooter>
    </Card>
  )
}
