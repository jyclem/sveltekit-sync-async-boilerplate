<script lang="ts">
  import { onMount } from 'svelte'

  import { todoEvents } from '$lib/stores/todoEvents'
  import { connect, send } from '$lib/tools/websocket'
  import { 
    getTodos, getTodo, createTodo, updateTodo, deleteTodo,
    indexStoreTodo2, showStoreTodo2, createStoreTodo2, updateStoreTodo2, destroyStoreTodo2
  } from '$lib/api/todos-websocket-chain'

  import ContainerWrapper from './ContainerWrapper.svelte'
  import Description from './items/Description.svelte'
  import Input from './items/Input.svelte'
  import List from './items/List.svelte'

  const text = `Same as 'Async - Websocket' but optimized for create, update and destroy,
                to send one request each time, using a chain of action to ask for the 
                refresh of the Todo list. It is more efficient because we don't have to wait for
                the result and then ask for the refresh of the list, it is automatically done by the
                Backend if the first action is successful.`

  let errorIndex = '', errorShow = '', errorCreate = '', errorUpdate = '', errorDelete = ''
  let list: Todo[] = []
  let todo: Todo|undefined

  $: if ($indexStoreTodo2) { 
    todoEvents.add('Websocket: index data received and indexStoreTodo2 updated')

    if (($indexStoreTodo2 as WebsocketError).error) {
      errorIndex = ($indexStoreTodo2 as WebsocketError).error
    } else {
      list = ($indexStoreTodo2 as Todo[])
    }
  }
  
  $: if ($showStoreTodo2) {
    todoEvents.add('Websocket: show data received and showStoreTodo2 updated')

    if (($showStoreTodo2 as WebsocketError).error) {
      errorShow = ($showStoreTodo2 as WebsocketError).error
    } else {
      todo = ($showStoreTodo2 as Todo)
    }
  }

  $: if (($createStoreTodo2 as WebsocketError)?.error) {
    errorCreate = ($createStoreTodo2 as WebsocketError).error
  }

  $: if (($updateStoreTodo2 as WebsocketError)?.error) {
    errorUpdate = ($updateStoreTodo2 as WebsocketError).error
  }

  $: if (($destroyStoreTodo2 as WebsocketError)?.error) {
    errorDelete = ($destroyStoreTodo2 as WebsocketError).error
  }

  const index = async () => {
    todoEvents.add('Websocket: send index action on todos controller')

    send(getTodos())
  }

  const show = async (id: string) => {
    todoEvents.add('Websocket: send show action on todos controller')

    send(getTodo(id))
  }

  const create = async (name: string) => {
    todoEvents.add('Websocket: send create and index actions on todos controller')

    send({ 1: createTodo(name, 'broadcast-error-only'), 2: getTodos() })

    return true
  }

  const update = async (id: string, name: string) => {
    todoEvents.add('Websocket: send update and index actions on todos controller')

    send({ 1: updateTodo(id, name, 'broadcast-error-only'), 2: getTodos() })
    

    return true
  }

  const remove = async (id: string) => {
    todoEvents.add('Websocket: send destroy and index actions on todos controller')

    send({ 1: deleteTodo(id, 'broadcast-error-only'), 2: getTodos() })
  }

  const resetError = () => {
    errorIndex = '', errorShow = '', errorCreate = '', errorUpdate = '', errorDelete = ''
  }

  const resetTodo = () => {
    todo = undefined
  }

  onMount(() => {
    connect()
    index()

    return () => {
      indexStoreTodo2.set(undefined)
      showStoreTodo2.set(undefined)
      createStoreTodo2.set(undefined)
      updateStoreTodo2.set(undefined)
      destroyStoreTodo2.set(undefined)
    }
  })

</script>

<ContainerWrapper>
  <svelte:fragment slot="description">
    <Description {text} />
  </svelte:fragment>

  <svelte:fragment slot="input">
    <Input {todo} error={errorShow || errorCreate || errorUpdate || errorDelete} {create} {update} {resetError} {resetTodo} />
  </svelte:fragment>

  <svelte:fragment slot="list">
    <List {list} error={errorIndex} {show} {remove} {resetTodo} />
  </svelte:fragment>
</ContainerWrapper>
