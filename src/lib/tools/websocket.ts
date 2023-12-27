import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

import { PUBLIC_API_URL } from '$env/static/public'
import { createConsumer } from '@rails/actioncable'

/* eslint-disable @typescript-eslint/no-explicit-any */
const SUCCESS_MAPPING: any = {}
const ERROR_MAPPING: any = {}
/* eslint-enable  @typescript-eslint/no-explicit-any */

export const createWebsocketStores: <SuccessStoreType>(
	successStoreKey: string
) => [Writable<SuccessStoreType | undefined>, Writable<string | undefined>] = <SuccessStoreType>(
	successStoreKey: string
) => {
	if (successStoreKey in SUCCESS_MAPPING) {
		throw `${successStoreKey} already exists in SUCCESS_MAPPING`
	}

	if (successStoreKey in ERROR_MAPPING) {
		throw `${successStoreKey} already exists in ERROR_MAPPING`
	}

	const successStore: Writable<undefined | SuccessStoreType> = writable(undefined)
	const errorStore: Writable<undefined | string> = writable(undefined)

	SUCCESS_MAPPING[successStoreKey] = successStore
	ERROR_MAPPING[successStoreKey] = errorStore

	return [successStore, errorStore]
}

/* eslint-disable @typescript-eslint/no-explicit-any */
let websocket
let channel: any
let isConnected = false

export const connect = () => {
	websocket ||= createConsumer(
		`${PUBLIC_API_URL.replace(/http:/, 'ws:').replace(/https:/, 'wss:')}/cable`
	)

	channel ||= websocket.subscriptions.create(
		{ channel: 'UserChannel' },
		{
			connected: () => {
				isConnected = true
			},
			disconnected: () => {
				isConnected = false
			},
			received(response: any) {
				if (!isConnected) return

				if (response?.included_in_response?.store) {
					if (response.error) {
						ERROR_MAPPING[response.included_in_response.store].set(response.error)
					} else {
						SUCCESS_MAPPING[response.included_in_response.store].set(response.data)
					}
				}
			}
		}
	)
}
/* eslint-enable  @typescript-eslint/no-explicit-any */

export const send = <DataType>(data: DataType) => {
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

type Params<ParamsType> = {
	params?: ParamsType
}

type ParamsExtended<ParamsType> = {
	_controller: string
	_action: string
	included_in_response: { store: string }
	no_broadcast?: boolean
	broadcast_error_only?: boolean
} & Params<ParamsType>

export type Mode = 'normal' | 'no-broadcast' | 'broadcast-error-only'

export const addMode = <ParamsType>(
	mode: Mode = 'normal',
	paramsExtended: ParamsExtended<ParamsType>
): ParamsExtended<ParamsType> => {
	return {
		...paramsExtended,
		...{
			no_broadcast: mode === 'no-broadcast',
			broadcast_error_only: mode === 'broadcast-error-only'
		}
	}
}
