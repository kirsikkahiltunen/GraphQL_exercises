import { useState } from "react"

const Books = (props) => {
  if (!props.show) {
    return null
  }

  const [genre, setGenre] = useState("all")
  const books = props.books

  const genres = [...new Set(books.flatMap((b) => b.genres))]

  const filteredBooks =
    genre === "all" ? books : books.filter((b) => b.genres.includes(genre))

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
          <button
            value={genre}
            onClick={({ target }) => setGenre(target.value)}
            key={genre}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
