import { useState } from "react"
import { useQuery } from "@apollo/client/react"
import { ALL_BOOKS, GENRE_BOOKS } from "../queries"

const Books = (props) => {
  const [genre, setGenre] = useState(null)

  const result_genre = useQuery(GENRE_BOOKS, {
    variables: {
      genre: genre,
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(response.data.addBook),
        }
      })
    },
  })
  if (!props.show) {
    return null
  }

  if (result_genre.loading) {
    return <div>loading...</div>
  }

  const filteredBooks = result_genre.data.allBooks

  const genres = [...new Set(props.books.flatMap((b) => b.genres))]

  return (
    <div>
      <h2>books</h2>

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
      <div>
        {genres.map((genre) => (
          <button onClick={() => setGenre(genre)} key={genre}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
