type Todo = {
  id: string
  name: string
}

type TodoEvent = {
  name: string
  justAppeared: boolean
}

type GetTodos = () => Promise<Response>

type GetTodo = (id: string) => Promise<Response>

type CreateTodo = (name: string) => Promise<Response>

type UpdateTodo = (id: string, name: string) => Promise<Response>

type DeleteTodo = (id: string) => Promise<Response>

