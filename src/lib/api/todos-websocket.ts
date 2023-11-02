import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import { send } from '$lib/tools/websocket'

export const indexStoreTodo: Writable<undefined | Todo[] | WebsocketError> = writable(undefined)
export const showStoreTodo: Writable<undefined | Todo | WebsocketError> = writable(undefined)
export const createStoreTodo: Writable<undefined | Todo | WebsocketError> = writable(undefined)
export const updateStoreTodo: Writable<undefined | Todo | WebsocketError> = writable(undefined)
export const destroyStoreTodo: Writable<undefined | (Todo & { _destroy: boolean }) | WebsocketError | undefined> = writable(undefined)

export const getTodos = () => {
	send({ _controller: 'todos', _action: 'index', included_in_response: { store: 'indexStoreTodo' } })
}

export const getTodo = (id: string) => {
	send({ _controller: 'todos', _action: 'show', params: { id }, included_in_response: { store: 'showStoreTodo' } })
}

export const createTodo = (name: string) => {
	send({ _controller: 'todos', _action: 'create', params: { name }, included_in_response: { store: 'createStoreTodo' } })
}

export const updateTodo = (id: string, name: string) => {
	send({ _controller: 'todos', _action: 'update', params: { id, name }, included_in_response: { store: 'updateStoreTodo' } })
}

export const deleteTodo = (id: string) => {
	send({ _controller: 'todos', _action: 'destroy', params: { id }, included_in_response: { store: 'destroyStoreTodo' } })
}