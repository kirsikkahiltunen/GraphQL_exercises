import { useQuery } from "@apollo/client/react"
import { useState } from "react"

const Recommendations = (props) => {
  if (!props.show) {
    return null
  }

  const books = props.books

  const genres = [...new Set(books.flatMap((b) => b.genres))]

  const filteredBooks = books.filter((b) =>
    b.genres.includes(props.user.favoriteGenre),
  )

  return (
    <div>
      <h2>Recommendations</h2>
      <div>books in your favorite genre: {props.user.favoriteGenre}</div>
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
