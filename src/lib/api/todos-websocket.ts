import { send, createWebsocketStores } from '$lib/tools/websocket'

export const [indexStoreTodo, errorIndexStoreTodo] = createWebsocketStores<Todo[]>('indexStoreTodo')

export const [showStoreTodo, errorShowStoreTodo] = createWebsocketStores<Todo>('showStoreTodo')

export const [createStoreTodo, errorCreateStoreTodo] =
	createWebsocketStores<Todo>('createStoreTodo')

export const [updateStoreTodo, errorUpdateStoreTodo] =
	createWebsocketStores<Todo>('updateStoreTodo')

export const [destroyStoreTodo, errorDestroyStoreTodo] = createWebsocketStores<
	Todo & { _destroy: boolean }
>('destroyStoreTodo')

export const getTodos = () => {
	send({
		_controller: 'todos',
		_action: 'index',
		included_in_response: { store: 'indexStoreTodo' }
	})
}

export const getTodo = (id: Todo['id']) => {
	send({
		_controller: 'todos',
		_action: 'show',
		params: { id },
		included_in_response: { store: 'showStoreTodo' }
	})
}

export const createTodo = (name: Todo['name']) => {
	send({
		_controller: 'todos',
		_action: 'create',
		params: { name },
		included_in_response: { store: 'createStoreTodo' }
	})
}

export const updateTodo = (id: Todo['id'], name: Todo['name']) => {
	send({
		_controller: 'todos',
		_action: 'update',
		params: { id, name },
		included_in_response: { store: 'updateStoreTodo' }
	})
}

export const deleteTodo = (id: Todo['id']) => {
	send({
		_controller: 'todos',
		_action: 'destroy',
		params: { id },
		included_in_response: { store: 'destroyStoreTodo' }
	})
}
