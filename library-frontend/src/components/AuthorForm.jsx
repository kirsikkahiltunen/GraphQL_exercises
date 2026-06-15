import { useState } from "react"
import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { CREATE_BOOK, ALL_AUTHORS, ALL_BOOKS, EDIT_AUTHOR } from "../queries"

const AuthorForm = () => {
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")

  const [changeBorn] = useMutation(EDIT_AUTHOR)

  const submit = (event) => {
    event.preventDefault()

    changeBorn({ variables: { name, setBornTo: parseInt(born) } })

    setName("")
    setBorn("")
  }

  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
        <div>
          name{" "}
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born{" "}
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}
export default AuthorForm
