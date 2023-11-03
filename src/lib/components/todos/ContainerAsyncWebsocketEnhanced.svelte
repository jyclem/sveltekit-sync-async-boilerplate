<script lang="ts">
  import { onMount } from 'svelte'

  import { todoEvents } from '$lib/stores/todoEvents'
  import { connect, send } from '$lib/tools/websocket'
  import { 
    getTodos, getTodo, createTodo, updateTodo, deleteTodo,
    indexStoreTodo2, showStoreTodo2, createStoreTodo2, updateStoreTodo2, destroyStoreTodo2,
    errorIndexStoreTodo2, errorShowStoreTodo2, errorCreateStoreTodo2, errorUpdateStoreTodo2, errorDestroyStoreTodo2
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

  // index
  const index = async () => {
    todoEvents.add('Websocket: send index action on todos controller')

    send(getTodos())
  }

  $: if ($indexStoreTodo2) { 
    todoEvents.add('Websocket: index data received and indexStoreTodo2 updated')
  }

  // show
  const show = async (id: Todo['id']) => {
    todoEvents.add('Websocket: send show action on todos controller')

    send(getTodo(id))
  }

  $: if ($showStoreTodo2) {
    todoEvents.add('Websocket: show data received and showStoreTodo2 updated')
  }

  // create
  const create = async (name: Todo['name']) => {
    todoEvents.add('Websocket: send create and index actions on todos controller')

    send({ 1: createTodo(name, 'broadcast-error-only'), 2: getTodos() })

    return true
  }

  // update
  const update = async (id: Todo['id'], name: Todo['name']) => {
    todoEvents.add('Websocket: send update and index actions on todos controller')

    send({ 1: updateTodo(id, name, 'broadcast-error-only'), 2: getTodos() })
    
    return true
  }

  // destroy
  const remove = async (id: Todo['id']) => {
    todoEvents.add('Websocket: send destroy and index actions on todos controller')

    send({ 1: deleteTodo(id, 'broadcast-error-only'), 2: getTodos() })
  }

  // resets
  const resetError = () => {
    errorIndexStoreTodo2.set(undefined)
    errorShowStoreTodo2.set(undefined)
    errorCreateStoreTodo2.set(undefined)
    errorUpdateStoreTodo2.set(undefined)
    errorDestroyStoreTodo2.set(undefined)
  }

  const resetTodo = () => {
    showStoreTodo2.set(undefined)
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
    <Input
      todo={$showStoreTodo2}
      error={$errorShowStoreTodo2 || $errorCreateStoreTodo2 || $errorUpdateStoreTodo2 || $errorDestroyStoreTodo2}
      {create} {update} {resetError} {resetTodo} 
    />
  </svelte:fragment>

  <svelte:fragment slot="list">
    <List list={$indexStoreTodo2} error={$errorIndexStoreTodo2} {show} {remove} {resetTodo} />
  </svelte:fragment>
</ContainerWrapper>
