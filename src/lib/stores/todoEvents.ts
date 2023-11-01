import { writable } from 'svelte/store';

export const todoEvents = (() => {
  const { subscribe, update, set } = writable([] as TodoEvent[])

  return {
    subscribe,
    set,
    add: (name: string) => {
      const newEvent = { name, isFalling: false }
      update((events) => [newEvent, ...events])

      setTimeout(() => {
        newEvent.isFalling = true
        update((events) => events)
      }, 100)
    },
  }
})()