from flask import Flask, request, jsonify
import json
from datetime import datetime
from typing import List, Dict, Optional, Union, Any

app = Flask(__name__)

# Book class from our original Python library manager
class Book:
    def __init__(self, title: str, author: str, genre: str, 
                 publication_year: int = None, isbn: str = None):
        self.id = None  # Will be set when added to library
        self.title = title
        self.author = author
        self.genre = genre
        self.publication_year = publication_year
        self.isbn = isbn
        self.date_added = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.is_borrowed = False
        self.borrowed_date = None
        self.return_date = None
        self.borrower = None
        self.description = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "genre": self.genre,
            "publication_year": self.publication_year,
            "isbn": self.isbn,
            "date_added": self.date_added,
            "is_borrowed": self.is_borrowed,
            "borrowed_date": self.borrowed_date,
            "return_date": self.return_date,
            "borrower": self.borrower,
            "description": self.description
        }

# Library class to manage books
class Library:
    def __init__(self):
        self.books = []
        self.next_id = 1
    
    def add_book(self, book: Book) -> Book:
        book.id = str(self.next_id)
        self.next_id += 1
        self.books.append(book)
        return book
    
    def get_book(self, book_id: str) -> Optional[Book]:
        for book in self.books:
            if book.id == book_id:
                return book
        return None
    
    def update_book(self, book_id: str, data: Dict[str, Any]) -> Optional[Book]:
        book = self.get_book(book_id)
        if not book:
            return None
        
        for key, value in data.items():
            if hasattr(book, key):
                setattr(book, key, value)
        
        return book
    
    def delete_book(self, book_id: str) -> bool:
        book = self.get_book(book_id)
        if not book:
            return False
        
        self.books.remove(book)
        return True
    
    def borrow_book(self, book_id: str, borrower: str) -> Optional[Book]:
        book = self.get_book(book_id)
        if not book or book.is_borrowed:
            return None
        
        book.is_borrowed = True
        book.borrowed_date = datetime.now().strftime("%Y-%m-%d")
        book.borrower = borrower
        return book
    
    def return_book(self, book_id: str) -> Optional[Book]:
        book = self.get_book(book_id)
        if not book or not book.is_borrowed:
            return None
        
        book.is_borrowed = False
        book.return_date = datetime.now().strftime("%Y-%m-%d")
        return book
    
    def get_all_books(self) -> List[Dict[str, Any]]:
        return [book.to_dict() for book in self.books]
    
    def get_borrowed_books(self) -> List[Dict[str, Any]]:
        return [book.to_dict() for book in self.books if book.is_borrowed]
    
    def get_recently_added_books(self, limit: int = 5) -> List[Dict[str, Any]]:
        sorted_books = sorted(self.books, key=lambda x: x.date_added, reverse=True)
        return [book.to_dict() for book in sorted_books[:limit]]
    
    def get_stats(self) -> Dict[str, Any]:
        total_books = len(self.books)
        borrowed_books = sum(1 for book in self.books if book.is_borrowed)
        available_books = total_books - borrowed_books
        
        genres = set(book.genre for book in self.books if book.genre)
        authors = set(book.author for book in self.books if book.author)
        
        return {
            "total_books": total_books,
            "borrowed_books": borrowed_books,
            "available_books": available_books,
            "unique_genres": len(genres),
            "unique_authors": len(authors)
        }

# Create a library instance
library = Library()

# Add some sample books
sample_books = [
    Book("The Hobbit", "J.R.R. Tolkien", "Fantasy", 1937, "9780547928227"),
    Book("Dune", "Frank Herbert", "Science Fiction", 1965, "9780441172719"),
    Book("Pride and Prejudice", "Jane Austen", "Romance", 1813, "9780141439518"),
    Book("The Shining", "Stephen King", "Horror", 1977, "9780307743657"),
    Book("The Alchemist", "Paulo Coelho", "Fiction", 1988, "9780062315007")
]

for book in sample_books:
    library.add_book(book)

# Set descriptions for the books
library.books[0].description = "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep one day to whisk him away on an adventure."
library.books[1].description = "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness."
library.books[2].description = "The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry of the British Regency."
library.books[3].description = "Jack Torrance, his wife Wendy, and their young son Danny move into the Overlook Hotel, where Jack has been hired as the winter caretaker. Cut off from civilization for months, Jack hopes to battle alcoholism and uncontrolled rage while writing a play."
library.books[4].description = "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined."

# Mark some books as borrowed
library.borrow_book("2", "Alice")
library.borrow_book("5", "Bob")

# API Routes
@app.route('/api/books', methods=['GET'])
def get_books():
    return jsonify(library.get_all_books())

@app.route('/api/books', methods=['POST'])
def add_book():
    data = request.json
    book = Book(
        title=data.get('title'),
        author=data.get('author'),
        genre=data.get('genre'),
        publication_year=data.get('publication_year'),
        isbn=data.get('isbn')
    )
    book.description = data.get('description')
    
    added_book = library.add_book(book)
    return jsonify(added_book.to_dict()), 201

@app.route('/api/books/<book_id>', methods=['GET'])
def get_book(book_id):
    book = library.get_book(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    
    return jsonify(book.to_dict())

@app.route('/api/books/<book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.json
    updated_book = library.update_book(book_id, data)
    
    if not updated_book:
        return jsonify({"error": "Book not found"}), 404
    
    return jsonify(updated_book.to_dict())

@app.route('/api/books/<book_id>', methods=['DELETE'])
def delete_book(book_id):
    success = library.delete_book(book_id)
    
    if not success:
        return jsonify({"error": "Book not found"}), 404
    
    return jsonify({"message": "Book deleted successfully"})

@app.route('/api/books/<book_id>/borrow', methods=['POST'])
def borrow_book(book_id):
    data = request.json
    borrower = data.get('borrower')
    
    if not borrower:
        return jsonify({"error": "Borrower name is required"}), 400
    
    book = library.borrow_book(book_id, borrower)
    
    if not book:
        return jsonify({"error": "Book not found or already borrowed"}), 404
    
    return jsonify(book.to_dict())

@app.route('/api/books/<book_id>/return', methods=['POST'])
def return_book(book_id):
    book = library.return_book(book_id)
    
    if not book:
        return jsonify({"error": "Book not found or not borrowed"}), 404
    
    return jsonify(book.to_dict())

@app.route('/api/books/borrowed', methods=['GET'])
def get_borrowed_books():
    return jsonify(library.get_borrowed_books())

@app.route('/api/books/recent', methods=['GET'])
def get_recent_books():
    limit = request.args.get('limit', default=5, type=int)
    return jsonify(library.get_recently_added_books(limit))

@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify(library.get_stats())

if __name__ == '__main__':
    app.run(port=5328, debug=True)
