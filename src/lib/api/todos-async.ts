import { PUBLIC_API_URL } from '$env/static/public'

export const getJob: GetJob = (id) => {
	return fetch(`${PUBLIC_API_URL}/jobs/${id}`)
}

export const createTodo: CreateTodo = (name: Todo['name']) => {
	return fetch(`${PUBLIC_API_URL}/todos`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			async: 'true'
		},
		body: JSON.stringify({ name })
	})
}

export const updateTodo: UpdateTodo = (id: Todo['id'], name: Todo['name']) => {
	return fetch(`${PUBLIC_API_URL}/todos/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			async: 'true'
		},
		body: JSON.stringify({ name })
	})
}

export const deleteTodo: DeleteTodo = (id: Todo['id']) => {
	return fetch(`${PUBLIC_API_URL}/todos/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			async: 'true'
		}
	})
}
