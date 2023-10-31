import { writable } from 'svelte/store';

export const todoEvents = (() => {
  const { subscribe, update, set } = writable([] as TodoEvent[])

  return {
    subscribe,
    set,
    add: (name: string) => {
      const newEvent = { name, justAppeared: true }
      update((events) => [newEvent, ...events])

      setTimeout(() => {
        newEvent.justAppeared = false
        update((events) => events)
      }, 100)
    },
  }
})()