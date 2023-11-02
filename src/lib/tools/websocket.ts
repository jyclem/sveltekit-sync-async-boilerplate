import { PUBLIC_API_URL } from '$env/static/public'
import { createConsumer } from '@rails/actioncable'
import { indexStoreTodo, showStoreTodo, createStoreTodo, updateStoreTodo, destroyStoreTodo } from '$lib/api/todos-websocket'
import { indexStoreTodo2, showStoreTodo2, createStoreTodo2, updateStoreTodo2, destroyStoreTodo2 } from '$lib/api/todos-websocket-chain'

/* eslint-disable @typescript-eslint/no-explicit-any */
// for security reason we use a mapping (so that we don't need to use an eval)
const MAPPING: any = { 
  indexStoreTodo, showStoreTodo, createStoreTodo, updateStoreTodo, destroyStoreTodo,
  indexStoreTodo2, showStoreTodo2, createStoreTodo2, updateStoreTodo2, destroyStoreTodo2
}

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
			connected: (): any => { isConnected = true },
			disconnected: (): any => { isConnected = false },
			received(response: any): any {
				if (!isConnected) return

				if (response?.included_in_response?.store) {
					(MAPPING[response.included_in_response.store] as any).set(
						response.error ? { error: response.error } : response.data
					)
				}
			}
		}
	)
}

export const send = (data: any) => {
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

type Params = {
  _controller: string; _action: string; params?: any; included_in_response: { store: string };
  no_broadcast?: boolean; broadcast_error_only?: boolean
}
/* eslint-enable  @typescript-eslint/no-explicit-any */

export type Mode = 'normal' | 'no-broadcast' | 'broadcast-error-only'

export const addMode = (mode: Mode = 'normal', params: Params): Params => {
  return {...params, ...{ no_broadcast: mode === 'no-broadcast', broadcast_error_only: mode === 'broadcast-error-only' }}
}
