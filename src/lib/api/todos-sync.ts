import { PUBLIC_API_URL } from '$env/static/public'

export const getTodos: GetTodos = () => {
  return fetch(`${PUBLIC_API_URL}/todos`)
}

export const getTodo: GetTodo = (id: Todo['id']) => {
  return fetch(`${PUBLIC_API_URL}/todos/${id}`)
}

export const createTodo: CreateTodo = (name: Todo['name']) => {
  return fetch(`${PUBLIC_API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })
}

export const updateTodo: UpdateTodo = (id: Todo['id'], name: Todo['name']) => {
  return fetch(`${PUBLIC_API_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })
}

export const deleteTodo: DeleteTodo = (id: Todo['id']) => {
  return fetch(`${PUBLIC_API_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
