import Link from "next/link"
import { BookOpen, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AddBookForm from "@/components/add-book-form"

export default function AddBookPage() {
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
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Add New Book</CardTitle>
            <CardDescription>Add a new book to your personal library collection.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddBookForm />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
