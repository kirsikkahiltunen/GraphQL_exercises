import { useEffect, useState } from "react"
import { useQuery } from "@apollo/client/react"
import { ALL_BOOKS, GENRE_BOOKS } from "../queries"

const Recommendations = (props) => {
  const [genre, setGenre] = useState(null)
  useEffect(() => {
    if (props.user?.favoriteGenre) {
      setGenre(props.user.favoriteGenre)
    }
  }, [props.user])
  if (!props.show) {
    return null
  }
  const books = props.books
  const filteredBooks = books.filter((b) => b.genres.includes(genre))

  const genres = [...new Set(props.books.flatMap((b) => b.genres))]

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <strong>{props.user.favoriteGenre}</strong>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
