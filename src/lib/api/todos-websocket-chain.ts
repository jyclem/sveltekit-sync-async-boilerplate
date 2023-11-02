import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import { addMode } from '$lib/tools/websocket'
import type { Mode } from '$lib/tools/websocket'

export const indexStoreTodo2: Writable<undefined | Todo[] | WebsocketError> = writable(undefined)
export const showStoreTodo2: Writable<undefined | Todo | WebsocketError> = writable(undefined)
export const createStoreTodo2: Writable<undefined | Todo | WebsocketError> = writable(undefined)
export const updateStoreTodo2: Writable<undefined | Todo | WebsocketError> = writable(undefined)
export const destroyStoreTodo2: Writable<undefined | (Todo & { _destroy: boolean }) | WebsocketError | undefined> = writable(undefined)

export const getTodos = (mode?: Mode) => 
  addMode(mode, {
    _controller: 'todos', _action: 'index', included_in_response: { store: 'indexStoreTodo2' }
  })

export const getTodo = (id: string, mode?: Mode) =>
  addMode(mode, {
    _controller: 'todos', _action: 'show', params: { id }, included_in_response: { store: 'showStoreTodo2' } }
  )

export const createTodo = (name: string, mode?: Mode) => 
  addMode(mode, {
    _controller: 'todos', _action: 'create', params: { name }, included_in_response: { store: 'createStoreTodo2' } }
  )


export const updateTodo = (id: string, name: string, mode?: Mode) =>
  addMode(mode, {
    _controller: 'todos', _action: 'update', params: { id, name }, included_in_response: { store: 'updateStoreTodo2' } }
  )


export const deleteTodo = (id: string, mode?: Mode) =>
  addMode(mode, {
    _controller: 'todos', _action: 'destroy', params: { id }, included_in_response: { store: 'destroyStoreTodo2' } }
  )