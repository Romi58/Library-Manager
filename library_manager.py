import json
from datetime import datetime
from typing import List, Dict, Optional, Union, Any

class Book:
    """Class representing a book in the library."""
    
    def __init__(self, title: str, author: str, genre: str, 
                 publication_year: int = None, isbn: str = None):
        """Initialize a book with its details."""
        self.title = title
        self.author = author
        self.genre = genre
        self.publication_year = publication_year
        self.isbn = isbn
        self.date_added = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.is_borrowed = False
        self.borrowed_date = None
        self.return_date = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert book object to dictionary for serialization."""
        return {
            "title": self.title,
            "author": self.author,
            "genre": self.genre,
            "publication_year": self.publication_year,
            "isbn": self.isbn,
            "date_added": self.date_added,
            "is_borrowed": self.is_borrowed,
            "borrowed_date": self.borrowed_date,
            "return_date": self.return_date
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Book':
        """Create a book object from dictionary data."""
        book = cls(
            title=data["title"],
            author=data["author"],
            genre=data["genre"],
            publication_year=data["publication_year"],
            isbn=data["isbn"]
        )
        book.date_added = data["date_added"]
        book.is_borrowed = data["is_borrowed"]
        book.borrowed_date = data["borrowed_date"]
        book.return_date = data["return_date"]
        return book
    
    def __str__(self) -> str:
        """String representation of the book."""
        status = "Borrowed" if self.is_borrowed else "Available"
        year_info = f", {self.publication_year}" if self.publication_year else ""
        isbn_info = f", ISBN: {self.isbn}" if self.isbn else ""
        return f"{self.title} by {self.author}{year_info} - {self.genre}{isbn_info} - {status}"


class Library:
    """Class representing a personal library."""
    
    def __init__(self, name: str = "My Personal Library"):
        """Initialize a library with a name."""
        self.name = name
        self.books: List[Book] = []
    
    def add_book(self, book: Book) -> None:
        """Add a book to the library."""
        self.books.append(book)
        print(f"Added: {book.title} by {book.author}")
    
    def remove_book(self, title: str = None, isbn: str = None) -> bool:
        """Remove a book from the library by title or ISBN."""
        if not title and not isbn:
            print("Error: Please provide either a title or ISBN to remove a book.")
            return False
        
        initial_count = len(self.books)
        
        if isbn:
            self.books = [book for book in self.books if book.isbn != isbn]
        else:
            self.books = [book for book in self.books if book.title.lower() != title.lower()]
        
        if len(self.books) < initial_count:
            print(f"Book {'with ISBN ' + isbn if isbn else title} removed successfully.")
            return True
        else:
            print(f"Book {'with ISBN ' + isbn if isbn else title} not found in the library.")
            return False
    
    def search_books(self, query: str, search_type: str = "all") -> List[Book]:
        """
        Search for books in the library.
        
        Args:
            query: The search term
            search_type: Where to search - "title", "author", "genre", or "all"
        
        Returns:
            A list of matching Book objects
        """
        query = query.lower()
        results = []
        
        for book in self.books:
            if search_type == "title" and query in book.title.lower():
                results.append(book)
            elif search_type == "author" and query in book.author.lower():
                results.append(book)
            elif search_type == "genre" and query in book.genre.lower():
                results.append(book)
            elif search_type == "all" and (
                query in book.title.lower() or 
                query in book.author.lower() or 
                query in book.genre.lower() or
                (book.isbn and query in book.isbn.lower())
            ):
                results.append(book)
        
        return results
    
    def display_books(self, books: List[Book] = None) -> None:
        """Display a list of books or all books in the library."""
        books_to_display = books if books is not None else self.books
        
        if not books_to_display:
            print("No books to display.")
            return
        
        print(f"\n{'=' * 80}")
        print(f"{self.name} - {len(books_to_display)} book(s)")
        print(f"{'=' * 80}")
        
        for i, book in enumerate(books_to_display, 1):
            print(f"{i}. {book}")
        
        print(f"{'=' * 80}\n")
    
    def borrow_book(self, title: str, borrower: str) -> bool:
        """Mark a book as borrowed."""
        for book in self.books:
            if book.title.lower() == title.lower():
                if book.is_borrowed:
                    print(f"'{book.title}' is already borrowed.")
                    return False
                
                book.is_borrowed = True
                book.borrowed_date = datetime.now().strftime("%Y-%m-%d")
                book.borrower = borrower
                print(f"'{book.title}' has been borrowed by {borrower}.")
                return True
        
        print(f"Book '{title}' not found in the library.")
        return False
    
    def return_book(self, title: str) -> bool:
        """Mark a book as returned."""
        for book in self.books:
            if book.title.lower() == title.lower():
                if not book.is_borrowed:
                    print(f"'{book.title}' is not currently borrowed.")
                    return False
                
                book.is_borrowed = False
                book.return_date = datetime.now().strftime("%Y-%m-%d")
                borrower = getattr(book, 'borrower', 'someone')
                print(f"'{book.title}' has been returned by {borrower}.")
                return True
        
        print(f"Book '{title}' not found in the library.")
        return False
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get statistics about the library."""
        total_books = len(self.books)
        borrowed_books = sum(1 for book in self.books if book.is_borrowed)
        available_books = total_books - borrowed_books
        
        genres = {}
        authors = {}
        
        for book in self.books:
            genres[book.genre] = genres.get(book.genre, 0) + 1
            authors[book.author] = authors.get(book.author, 0) + 1
        
        top_genres = sorted(genres.items(), key=lambda x: x[1], reverse=True)[:3]
        top_authors = sorted(authors.items(), key=lambda x: x[1], reverse=True)[:3]
        
        return {
            "total_books": total_books,
            "borrowed_books": borrowed_books,
            "available_books": available_books,
            "unique_genres": len(genres),
            "unique_authors": len(authors),
            "top_genres": top_genres,
            "top_authors": top_authors
        }
    
    def save_to_file(self, filename: str = "library.json") -> bool:
        """Save the library to a JSON file."""
        try:
            data = {
                "name": self.name,
                "books": [book.to_dict() for book in self.books]
            }
            
            # In a real environment, we would use:
            # with open(filename, 'w') as f:
            #     json.dump(data, f, indent=4)
            
            # For demonstration, we'll just print the JSON
            print(f"Library would be saved to {filename}")
            print(json.dumps(data, indent=2)[:200] + "... (truncated)")
            return True
        except Exception as e:
            print(f"Error saving library: {e}")
            return False
    
    @classmethod
    def load_from_file(cls, filename: str = "library.json") -> Optional['Library']:
        """Load a library from a JSON file."""
        try:
            # In a real environment, we would use:
            # with open(filename, 'r') as f:
            #     data = json.load(f)
            
            # For demonstration, we'll create sample data
            print(f"In a real environment, the library would be loaded from {filename}")
            
            # Create a sample library for demonstration
            library = cls("Demo Library")
            sample_books = [
                Book("The Great Gatsby", "F. Scott Fitzgerald", "Classic", 1925),
                Book("To Kill a Mockingbird", "Harper Lee", "Fiction", 1960),
                Book("1984", "George Orwell", "Dystopian", 1949)
            ]
            for book in sample_books:
                library.add_book(book)
            
            return library
        except Exception as e:
            print(f"Error loading library: {e}")
            return None


def demo_library_manager():
    """Demonstrate the library manager functionality."""
    # Create a new library
    my_library = Library("My Reading Collection")
    
    # Add some books
    my_library.add_book(Book("The Hobbit", "J.R.R. Tolkien", "Fantasy", 1937))
    my_library.add_book(Book("Dune", "Frank Herbert", "Science Fiction", 1965))
    my_library.add_book(Book("Pride and Prejudice", "Jane Austen", "Romance", 1813))
    my_library.add_book(Book("The Shining", "Stephen King", "Horror", 1977))
    my_library.add_book(Book("The Alchemist", "Paulo Coelho", "Fiction", 1988))
    
    # Display all books
    print("\nAll books in the library:")
    my_library.display_books()
    
    # Search for books
    print("\nSearching for 'the' in titles:")
    results = my_library.search_books("the", "title")
    my_library.display_books(results)
    
    # Borrow a book
    my_library.borrow_book("Dune", "Alice")
    my_library.borrow_book("The Hobbit", "Bob")
    
    # Try to borrow an already borrowed book
    my_library.borrow_book("Dune", "Charlie")
    
    # Display updated library
    print("\nLibrary after borrowing books:")
    my_library.display_books()
    
    # Return a book
    my_library.return_book("Dune")
    
    # Display statistics
    stats = my_library.get_statistics()
    print("\nLibrary Statistics:")
    print(f"Total books: {stats['total_books']}")
    print(f"Borrowed books: {stats['borrowed_books']}")
    print(f"Available books: {stats['available_books']}")
    print(f"Unique genres: {stats['unique_genres']}")
    print(f"Unique authors: {stats['unique_authors']}")
    
    print("\nTop genres:")
    for genre, count in stats['top_genres']:
        print(f"- {genre}: {count} book(s)")
    
    print("\nTop authors:")
    for author, count in stats['top_authors']:
        print(f"- {author}: {count} book(s)")
    
    # Save the library
    my_library.save_to_file()
    
    # Remove a book
    my_library.remove_book(title="The Alchemist")
    
    # Display final library
    print("\nFinal library contents:")
    my_library.display_books()


# Run the demonstration
if __name__ == "__main__":
    demo_library_manager()
