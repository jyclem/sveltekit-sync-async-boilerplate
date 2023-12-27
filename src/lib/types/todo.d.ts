type Todo = {
	id: string
	name: string
}

type TodoEvent = {
	name: string
	isFalling: boolean
}

type GetTodos = () => Promise<Response>

type GetTodo = (id: Todo['id']) => Promise<Response>

type CreateTodo = (name: Todo['name']) => Promise<Response>

type UpdateTodo = (id: Todo['id'], name: Todo['name']) => Promise<Response>

type DeleteTodo = (id: Todo['id']) => Promise<Response>
