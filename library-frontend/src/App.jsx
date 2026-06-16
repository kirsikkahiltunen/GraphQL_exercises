import { useApolloClient, useQuery } from "@apollo/client/react"
import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import Recommendations from "./components/Recommendations"
import { gql } from "@apollo/client"
import { ALL_AUTHORS, ALL_BOOKS, CURRENT_USER } from "./queries"

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(localStorage.getItem("userToken"))
  const [errorMessage, setErrorMessage] = useState(null)
  const result_authors = useQuery(ALL_AUTHORS)
  const result_books = useQuery(ALL_BOOKS)
  const result_user = useQuery(CURRENT_USER)
  const client = useApolloClient()

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (result_user.loading) {
    return <div>loading...</div>
  }
  if (result_authors.loading) {
    return <div>loading...</div>
  }
  if (result_books.loading) {
    return <div>loading...</div>
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
          <button onClick={() => setPage("login")}>login</button>
        </div>
        <Authors
          show={page === "authors"}
          authors={result_authors.data.allAuthors}
        />

        <Books show={page === "books"} books={result_books.data.allBooks} />

        <LoginForm show={page === "login"} setToken={setToken} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommend")}>recommend</button>
        <button onClick={onLogout}>logout</button>
      </div>

      <Authors
        show={page === "authors"}
        authors={result_authors.data.allAuthors}
        token={token}
      />

      <Books show={page === "books"} books={result_books.data.allBooks} />

      <NewBook show={page === "add"} />

      <Recommendations
        show={page === "recommend"}
        books={result_books.data.allBooks}
        user={result_user.data?.me}
      />
    </div>
  )
}

export default App
