import { createWebsocketStores, addMode } from '$lib/tools/websocket'
import type { Writable } from 'svelte/store'
import type { ErrorStore } from '$lib/tools/websocket'
import type { Mode } from '$lib/tools/websocket'

export const [indexStoreTodo2, errorIndexStoreTodo2]: [Writable<undefined | Todo[]>, ErrorStore] =
	createWebsocketStores('indexStoreTodo2') as [Writable<undefined | Todo[]>, ErrorStore]

export const [showStoreTodo2, errorShowStoreTodo2]: [Writable<undefined | Todo>, ErrorStore] =
	createWebsocketStores('showStoreTodo2') as [Writable<undefined | Todo>, ErrorStore]

export const [createStoreTodo2, errorCreateStoreTodo2]: [Writable<undefined | Todo>, ErrorStore] =
	createWebsocketStores('createStoreTodo2') as [Writable<undefined | Todo>, ErrorStore]

export const [updateStoreTodo2, errorUpdateStoreTodo2]: [Writable<undefined | Todo>, ErrorStore] =
	createWebsocketStores('updateStoreTodo2') as [Writable<undefined | Todo>, ErrorStore]

export const [destroyStoreTodo2, errorDestroyStoreTodo2]: [Writable<undefined | (Todo & { _destroy: boolean })>, ErrorStore] =
	createWebsocketStores('destroyStoreTodo2') as [Writable<undefined | (Todo & { _destroy: boolean })>, ErrorStore]

export const getTodos = (mode?: Mode) => 
  addMode(mode, {
    _controller: 'todos', _action: 'index', included_in_response: { store: 'indexStoreTodo2' }
  })

export const getTodo = (id: Todo['id'], mode?: Mode) =>
  addMode(mode, {
    _controller: 'todos', _action: 'show', params: { id }, included_in_response: { store: 'showStoreTodo2' } }
  )

export const createTodo = (name: Todo['name'], mode?: Mode) => 
  addMode(mode, {
    _controller: 'todos', _action: 'create', params: { name }, included_in_response: { store: 'createStoreTodo2' } }
  )

export const updateTodo = (id: Todo['id'], name: Todo['name'], mode?: Mode) =>
  addMode(mode, {
    _controller: 'todos', _action: 'update', params: { id, name }, included_in_response: { store: 'updateStoreTodo2' } }
  )

export const deleteTodo = (id: Todo['id'], mode?: Mode) =>
  addMode(mode, {
    _controller: 'todos', _action: 'destroy', params: { id }, included_in_response: { store: 'destroyStoreTodo2' } }
  )