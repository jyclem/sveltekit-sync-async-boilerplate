import { PUBLIC_API_URL } from '$env/static/public'
import { createConsumer } from '@rails/actioncable'
import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

export const indexStore: Writable<undefined | Todo[] | WebsocketError> = writable(undefined)
export const showStore: Writable<undefined | Todo | WebsocketError> = writable(undefined)
export const createStore: Writable<undefined | Todo | WebsocketError> = writable(undefined)
export const updateStore: Writable<undefined | Todo | WebsocketError> = writable(undefined)
export const destroyStore: Writable<undefined | (Todo & { _destroy: boolean }) | WebsocketError | undefined> = writable(undefined)

type AnyStore = typeof indexStore | typeof showStore | typeof createStore | typeof updateStore | typeof destroyStore

// for security reason we use a mapping (so that we don't need to use and eval)
const MAPPING: { [key: string]: AnyStore } = { indexStore,	showStore, createStore,	updateStore,	destroyStore }

/* eslint-disable @typescript-eslint/no-explicit-any */
let websocket: any
let channel: any
let isConnected = false

export const connect = () => {
	websocket ||= createConsumer(
		`${PUBLIC_API_URL.replace(/http:/, 'ws:').replace(/https:/, 'wss:')}/cable`
	)

	channel ||= websocket.subscriptions.create(
		{ channel: 'UserChannel' },
		{
			connected: (): any => (isConnected = true),
			disconnected: (): any => {},
			received(response: any): any {
				if (!isConnected) return

				if (response?.included_in_response?.store) {
					(MAPPING[response.included_in_response.store] as AnyStore).set(
						response.error ? { error: response.error } : response.data
					)
				}
			}
		}
	)
}

const send = (data: any) => {
	if (isConnected) {
		channel.send(data)
	} else {
		// otherwise we try a few times
		let nb_retries = 0
		const checkConnectionId = setInterval(() => {
			if (isConnected) channel.send(data)
			if (isConnected || nb_retries > 10) clearInterval(checkConnectionId)
			nb_retries += 1
		}, 500)
	}
}
/* eslint-enable  @typescript-eslint/no-explicit-any */

export const getTodos = () => {
	send({ _controller: 'todos', _action: 'index', included_in_response: { store: 'indexStore' } })
}

export const getTodo = (id: string) => {
	send({ _controller: 'todos', _action: 'show', params: { id }, included_in_response: { store: 'showStore' } })
}

export const createTodo = (name: string) => {
	send({ _controller: 'todos', _action: 'create', params: { name }, included_in_response: { store: 'createStore' } })
}

export const updateTodo = (id: string, name: string) => {
	send({ _controller: 'todos', _action: 'update', params: { id, name }, included_in_response: { store: 'updateStore' } })
}

export const deleteTodo = (id: string) => {
	send({ _controller: 'todos', _action: 'destroy', params: { id }, included_in_response: { store: 'destroyStore' } })
}