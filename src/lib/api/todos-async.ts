import { PUBLIC_BASE_URL } from '$env/static/public'

export const getJob: GetJob = (id) => {
  return fetch(`${PUBLIC_BASE_URL}/jobs/${id}`)
}

export const createTodo: CreateTodo = (name) => {
  return fetch(`${PUBLIC_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'async': 'true',
    },
    body: JSON.stringify({ name }),
  })
}

export const updateTodo: UpdateTodo = (id, name) => {
  return fetch(`${PUBLIC_BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'async': 'true',
    },
    body: JSON.stringify({ name }),
  })
}

export const deleteTodo: DeleteTodo = (id: string) => {
  return fetch(`${PUBLIC_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'async': 'true',
    },
  })
}