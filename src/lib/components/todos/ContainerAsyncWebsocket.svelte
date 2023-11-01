<script lang="ts">
  import { onMount } from 'svelte'

  import { todoEvents } from '$lib/stores/todoEvents'
  import { 
    connect,
    getTodos, getTodo, createTodo, updateTodo, deleteTodo,
    indexStore, showStore, createStore, updateStore, destroyStore 
  } from '$lib/api/todos-websocket'

  import ContainerWrapper from './ContainerWrapper.svelte'
  import Description from './items/Description.svelte'
  import Input from './items/Input.svelte'
  import List from './items/List.svelte'

  const text = `Here we execute all our requests asynchronously trough websockets.
                When we receive the result, we store it in a Svelte Store to update the display.`

  let errorIndex = '', errorShow = '', errorCreate = '', errorUpdate = '', errorDelete = ''
  let list: Todo[] = []
  let todo: Todo|undefined

  $: if ($indexStore) { 
    todoEvents.add('Websocket: index data received and indexStore updated')

    if (($indexStore as WebsocketError).error) {
      errorIndex = ($indexStore as WebsocketError).error
    } else {
      list = ($indexStore as Todo[])
    }
    indexStore.set(undefined)
  }
  
  $: if ($showStore) {
    todoEvents.add('Websocket: show data received and showStore updated')

    if (($showStore as WebsocketError).error) {
      errorShow = ($showStore as WebsocketError).error
    } else {
      todo = ($showStore as Todo)
    }
    showStore.set(undefined)
  }

  $: if ($createStore) {
    todoEvents.add('Websocket: create data received and createStore updated')

    if (($createStore as WebsocketError).error) {
      errorCreate = ($createStore as WebsocketError).error
    } else {
      index()
    }
    createStore.set(undefined)
  }

  $: if ($updateStore) {
    todoEvents.add('Websocket: update data received and updateStore updated')

    if (($updateStore as WebsocketError).error) {
      errorUpdate = ($updateStore as WebsocketError).error
    } else {
      index()
    }
    updateStore.set(undefined)
  }

  $: if ($destroyStore) {
    todoEvents.add('Websocket: create data received and destroyStore updated')

    if (($destroyStore as WebsocketError).error) {
      errorDelete = ($destroyStore as WebsocketError).error
    } else {
      index()
    }
    destroyStore.set(undefined)
  }

  const index = async () => {
    todoEvents.add('Websocket: send index action on todos controller')

    getTodos()
  }

  const show = async (id: string) => {
    todoEvents.add('Websocket: send show action on todos controller')

    getTodo(id)
  }

  const create = async (name: string) => {
    todoEvents.add('Websocket: send create action on todos controller')

    createTodo(name)

    return true
  }

  const update = async (id: string, name: string) => {
    todoEvents.add('Websocket: send update action on todos controller')

    updateTodo(id, name)

    return true
  }

  const remove = async (id: string) => {
    todoEvents.add('Websocket: send destroy action on todos controller')

    deleteTodo(id)
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
