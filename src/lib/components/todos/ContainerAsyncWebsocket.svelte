<script lang="ts">
  import { onMount } from 'svelte'

  import { todoEvents } from '$lib/stores/todoEvents'
  import { connect } from '$lib/tools/websocket'
  import { 
    getTodos, getTodo, createTodo, updateTodo, deleteTodo,
    indexStoreTodo, showStoreTodo, createStoreTodo, updateStoreTodo, destroyStoreTodo,
    errorIndexStoreTodo, errorShowStoreTodo, errorCreateStoreTodo, errorUpdateStoreTodo, errorDestroyStoreTodo
  } from '$lib/api/todos-websocket'

  import ContainerWrapper from './ContainerWrapper.svelte'
  import Description from './items/Description.svelte'
  import Input from './items/Input.svelte'
  import List from './items/List.svelte'

  const text = `Here we execute all our requests asynchronously trough websockets.
                When we receive the result, we store it in a Svelte Store to update the display.`

  // index
  const index = async () => {
    todoEvents.add('Websocket: send index action on todos controller')

    getTodos()
  }

  $: if ($indexStoreTodo) {    
    todoEvents.add('Websocket: index data received and indexStoreTodo updated')
  }

  // show
  const show = async (id: Todo['id']) => {
    todoEvents.add('Websocket: send show action on todos controller')

    getTodo(id)
  }

  $: if ($showStoreTodo) {
    todoEvents.add('Websocket: show data received and showStoreTodo updated')
  }

  // create
  const create = async (name: Todo['name']) => {
    todoEvents.add('Websocket: send create action on todos controller')

    createTodo(name)

    return true
  }

  $: if ($createStoreTodo) {
    todoEvents.add('Websocket: create data received and createStoreTodo updated')

    index()
  }

  // update
  const update = async (id: Todo['id'], name: Todo['name']) => {
    todoEvents.add('Websocket: send update action on todos controller')

    updateTodo(id, name)

    return true
  }

  $: if ($updateStoreTodo) {
    todoEvents.add('Websocket: update data received and updateStoreTodo updated')

    index()
  }

  // destroy

  const remove = async (id: Todo['id']) => {
    todoEvents.add('Websocket: send destroy action on todos controller')

    deleteTodo(id)
  }

  $: if ($destroyStoreTodo) {
    todoEvents.add('Websocket: destroy data received and destroyStoreTodo updated')

    index()
  }

  // resets
  const resetError = () => {
    errorIndexStoreTodo.set(undefined)
    errorShowStoreTodo.set(undefined)
    errorCreateStoreTodo.set(undefined)
    errorUpdateStoreTodo.set(undefined)
    errorDestroyStoreTodo.set(undefined)
  }

  const resetTodo = () => {
    showStoreTodo.set(undefined)
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
    <Input
      todo={$showStoreTodo}
      error={$errorShowStoreTodo || $errorCreateStoreTodo || $errorUpdateStoreTodo || $errorDestroyStoreTodo}
      {create} {update} {resetError} {resetTodo} 
    />
  </svelte:fragment>

  <svelte:fragment slot="list">
    <List list={$indexStoreTodo} error={$errorIndexStoreTodo} {show} {remove} {resetTodo} />
  </svelte:fragment>
</ContainerWrapper>
