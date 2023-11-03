import { send, createWebsocketStores } from '$lib/tools/websocket'
import type { ErrorStore } from '$lib/tools/websocket'
import type { Writable } from 'svelte/store'

export const [indexStoreTodo, errorIndexStoreTodo]: [Writable<undefined | Todo[]>, ErrorStore] =
	createWebsocketStores('indexStoreTodo') as [Writable<undefined | Todo[]>, ErrorStore]

export const [showStoreTodo, errorShowStoreTodo]: [Writable<undefined | Todo>, ErrorStore] =
	createWebsocketStores('showStoreTodo') as [Writable<undefined | Todo>, ErrorStore]

export const [createStoreTodo, errorCreateStoreTodo]: [Writable<undefined | Todo>, ErrorStore] =
	createWebsocketStores('createStoreTodo') as [Writable<undefined | Todo>, ErrorStore]

export const [updateStoreTodo, errorUpdateStoreTodo]: [Writable<undefined | Todo>, ErrorStore] =
	createWebsocketStores('updateStoreTodo') as [Writable<undefined | Todo>, ErrorStore]

export const [destroyStoreTodo, errorDestroyStoreTodo]: [Writable<undefined | (Todo & { _destroy: boolean })>, ErrorStore] =
	createWebsocketStores('destroyStoreTodo') as [Writable<undefined | (Todo & { _destroy: boolean })>, ErrorStore]

export const getTodos = () => {
	send({ _controller: 'todos', _action: 'index', included_in_response: { store: 'indexStoreTodo' } })
}

export const getTodo = (id: Todo['id']) => {
	send({ _controller: 'todos', _action: 'show', params: { id }, included_in_response: { store: 'showStoreTodo' } })
}

export const createTodo = (name: Todo['name']) => {
	send({ _controller: 'todos', _action: 'create', params: { name }, included_in_response: { store: 'createStoreTodo' } })
}

export const updateTodo = (id: Todo['id'], name: Todo['name']) => {
	send({ _controller: 'todos', _action: 'update', params: { id, name }, included_in_response: { store: 'updateStoreTodo' } })
}

export const deleteTodo = (id: Todo['id']) => {
	send({ _controller: 'todos', _action: 'destroy', params: { id }, included_in_response: { store: 'destroyStoreTodo' } })
}