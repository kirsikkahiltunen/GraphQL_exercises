import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { LOGIN, CURRENT_USER } from "../queries"

const LoginForm = ({ show, setError, setToken, setPage }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [login] = useMutation(LOGIN, {
    onCompleted: async (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem("userToken", token)
      setPage("authors")
    },
    onError: (error) => {
      setError("login failed")
    },
  })

  const submit = async (event) => {
    event.preventDefault()
    await login({ variables: { username, password } })
    setUsername("")
    setPassword("")
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
