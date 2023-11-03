import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

import { PUBLIC_API_URL } from '$env/static/public'
import { createConsumer } from '@rails/actioncable'

export type ErrorStore = Writable<undefined | string>

/* eslint-disable @typescript-eslint/no-explicit-any */
const SUCCESS_MAPPING: any = {}
const ERROR_MAPPING: any = {}

export const createWebsocketStores = (successStoreKey: string) => {
	if (successStoreKey in SUCCESS_MAPPING) {
		throw `${successStoreKey} already exists in SUCCESS_MAPPING`
	}

	if (successStoreKey in ERROR_MAPPING) {
		throw `${successStoreKey} already exists in ERROR_MAPPING`
	}

	const successStore: Writable<any> = writable(undefined)
	const errorStore: ErrorStore = writable(undefined)

	SUCCESS_MAPPING[successStoreKey] = successStore
	ERROR_MAPPING[successStoreKey] = errorStore

	return [successStore, errorStore]
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
					if (response.error) {
						(ERROR_MAPPING[response.included_in_response.store] as any).set(response.error)
					} else {
						(SUCCESS_MAPPING[response.included_in_response.store] as any).set(response.data)
					}
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
