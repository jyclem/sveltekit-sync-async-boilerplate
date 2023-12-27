import { createWebsocketStores, addMode } from '$lib/tools/websocket'
import type { Mode } from '$lib/tools/websocket'

export const [indexStoreTodo2, errorIndexStoreTodo2] =
	createWebsocketStores<Todo[]>('indexStoreTodo2')

export const [showStoreTodo2, errorShowStoreTodo2] = createWebsocketStores<Todo>('showStoreTodo2')

export const [createStoreTodo2, errorCreateStoreTodo2] =
	createWebsocketStores<Todo>('createStoreTodo2')

export const [updateStoreTodo2, errorUpdateStoreTodo2] =
	createWebsocketStores<Todo>('updateStoreTodo2')

export const [destroyStoreTodo2, errorDestroyStoreTodo2] = createWebsocketStores<
	Todo & { _destroy: boolean }
>('destroyStoreTodo2')

export const getTodos = (mode?: Mode) =>
	addMode(mode, {
		_controller: 'todos',
		_action: 'index',
		included_in_response: { store: 'indexStoreTodo2' }
	})

export const getTodo = (id: Todo['id'], mode?: Mode) =>
	addMode(mode, {
		_controller: 'todos',
		_action: 'show',
		params: { id },
		included_in_response: { store: 'showStoreTodo2' }
	})

export const createTodo = (name: Todo['name'], mode?: Mode) =>
	addMode(mode, {
		_controller: 'todos',
		_action: 'create',
		params: { name },
		included_in_response: { store: 'createStoreTodo2' }
	})

export const updateTodo = (id: Todo['id'], name: Todo['name'], mode?: Mode) =>
	addMode(mode, {
		_controller: 'todos',
		_action: 'update',
		params: { id, name },
		included_in_response: { store: 'updateStoreTodo2' }
	})

export const deleteTodo = (id: Todo['id'], mode?: Mode) =>
	addMode(mode, {
		_controller: 'todos',
		_action: 'destroy',
		params: { id },
		included_in_response: { store: 'destroyStoreTodo2' }
	})
