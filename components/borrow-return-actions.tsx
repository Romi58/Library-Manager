"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const borrowFormSchema = z.object({
  borrower: z.string().min(1, { message: "Borrower name is required" }),
})

type BorrowFormValues = z.infer<typeof borrowFormSchema>

interface BorrowReturnActionsProps {
  id: string
  isBorrowed: boolean
  onStatusChange: (isBorrowed: boolean) => void
}

export default function BorrowReturnActions({ id, isBorrowed, onStatusChange }: BorrowReturnActionsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BorrowFormValues>({
    resolver: zodResolver(borrowFormSchema),
    defaultValues: {
      borrower: "",
    },
  })

  async function onBorrow(data: BorrowFormValues) {
    setIsSubmitting(true)
    try {
      // In a real app, this would call the API
      // await borrowBook(id, data.borrower);
      console.log("Borrowing book:", id, data)

      onStatusChange(true)
      setIsDialogOpen(false)

      toast({
        title: "Book borrowed",
        description: `The book has been borrowed by ${data.borrower}.`,
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to borrow the book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleReturn() {
    setIsSubmitting(true)
    try {
      // In a real app, this would call the API
      // await returnBook(id);
      console.log("Returning book:", id)

      onStatusChange(false)

      toast({
        title: "Book returned",
        description: "The book has been marked as returned.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to return the book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isBorrowed) {
    return (
      <Button onClick={handleReturn} disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? "Processing..." : "Return Book"}
      </Button>
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">Borrow Book</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Borrow Book</DialogTitle>
          <DialogDescription>Enter the name of the person borrowing this book.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onBorrow)} className="space-y-4">
            <FormField
              control={form.control}
              name="borrower"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Borrower Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
