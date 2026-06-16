import { useState } from "react"
import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { useQuery } from "@apollo/client/react"
import { CREATE_BOOK, ALL_AUTHORS, ALL_BOOKS, EDIT_AUTHOR } from "../queries"

const AuthorForm = (props) => {
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")

  const authors = props.authors

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
          <label>
            name
            <select
              name="name"
              value={name}
              onChange={({ target }) => setName(target.value)}
            >
              {authors.map((a) => (
                <option value={a.name} key={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            born
            <input
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </label>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}
export default AuthorForm
