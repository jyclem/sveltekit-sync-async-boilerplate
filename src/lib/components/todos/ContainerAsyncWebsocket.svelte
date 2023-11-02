<script lang="ts">
  import { onMount } from 'svelte'

  import { todoEvents } from '$lib/stores/todoEvents'
  import { connect } from '$lib/tools/websocket'
  import { 
    getTodos, getTodo, createTodo, updateTodo, deleteTodo,
    indexStoreTodo, showStoreTodo, createStoreTodo, updateStoreTodo, destroyStoreTodo
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

  $: if ($indexStoreTodo) {    
    todoEvents.add('Websocket: index data received and indexStoreTodo updated')

    if (($indexStoreTodo as WebsocketError).error) {
      errorIndex = ($indexStoreTodo as WebsocketError).error
    } else {
      list = ($indexStoreTodo as Todo[])
    }
  }
  
  $: if ($showStoreTodo) {
    todoEvents.add('Websocket: show data received and showStoreTodo updated')

    if (($showStoreTodo as WebsocketError).error) {
      errorShow = ($showStoreTodo as WebsocketError).error
    } else {
      todo = ($showStoreTodo as Todo)
    }
  }

  $: if ($createStoreTodo) {
    todoEvents.add('Websocket: create data received and createStoreTodo updated')

    if (($createStoreTodo as WebsocketError).error) {
      errorCreate = ($createStoreTodo as WebsocketError).error
    } else {
      index()
    }
  }

  $: if ($updateStoreTodo) {
    todoEvents.add('Websocket: update data received and updateStoreTodo updated')

    if (($updateStoreTodo as WebsocketError).error) {
      errorUpdate = ($updateStoreTodo as WebsocketError).error
    } else {
      index()
    }
  }

  $: if ($destroyStoreTodo) {
    todoEvents.add('Websocket: destroy data received and destroyStoreTodo updated')

    if (($destroyStoreTodo as WebsocketError).error) {
      errorDelete = ($destroyStoreTodo as WebsocketError).error
    } else {
      index()
    }
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

    return () => {
      indexStoreTodo.set(undefined)
      showStoreTodo.set(undefined)
      createStoreTodo.set(undefined)
      updateStoreTodo.set(undefined)
      destroyStoreTodo.set(undefined)
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
