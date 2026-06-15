import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`
const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`

const App = () => {
  const [page, setPage] = useState("authors")
  const result_authors = useQuery(ALL_AUTHORS)
  const result_books = useQuery(ALL_BOOKS)
  if (result_authors.loading) {
    return <div>loading...</div>
  }
  if (result_books.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors
        show={page === "authors"}
        authors={result_authors.data.allAuthors}
      />

      <Books show={page === "books"} books={result_books.data.allBooks} />

      <NewBook show={page === "add"} />
    </div>
  )
}

export default App
