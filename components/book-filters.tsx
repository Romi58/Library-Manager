"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// In a real app, this would be fetched from the API
const genres = [
  { value: "Fantasy", label: "Fantasy" },
  { value: "Science Fiction", label: "Science Fiction" },
  { value: "Romance", label: "Romance" },
  { value: "Horror", label: "Horror" },
  { value: "Fiction", label: "Fiction" },
  { value: "Mystery", label: "Mystery" },
  { value: "Thriller", label: "Thriller" },
  { value: "Biography", label: "Biography" },
  { value: "History", label: "History" },
  { value: "Self-Help", label: "Self-Help" },
]

export default function BookFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "")

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value)

    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("genre", value)
    } else {
      params.delete("genre")
    }

    router.push(`/books?${params.toString()}`)
    setOpen(false)
  }

  const clearFilters = () => {
    setSelectedGenre("")

    const params = new URLSearchParams(searchParams)
    params.delete("genre")

    router.push(`/books?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Filters</h3>

      <div className="space-y-2">
        <label className="text-sm font-medium">Genre</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
              {selectedGenre ? genres.find((genre) => genre.value === selectedGenre)?.label : "Select genre..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search genre..." />
              <CommandList>
                <CommandEmpty>No genre found.</CommandEmpty>
                <CommandGroup>
                  {genres.map((genre) => (
                    <CommandItem key={genre.value} value={genre.value} onSelect={() => handleGenreChange(genre.value)}>
                      <Check
                        className={cn("mr-2 h-4 w-4", selectedGenre === genre.value ? "opacity-100" : "opacity-0")}
                      />
                      {genre.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedGenre && (
        <Button variant="ghost" className="w-full" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  )
}
