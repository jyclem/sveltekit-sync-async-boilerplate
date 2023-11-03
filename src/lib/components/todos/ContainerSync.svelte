<script lang="ts">
  import { onMount } from 'svelte'

  import { todoEvents } from '$lib/stores/todoEvents'
  import { getTodos, getTodo, createTodo, updateTodo, deleteTodo } from '$lib/api/todos-sync'

  import ContainerWrapper from './ContainerWrapper.svelte'
  import Description from './items/Description.svelte'
  import Input from './items/Input.svelte'
  import List from './items/List.svelte'

  const text = `Here we execute all our requests synchronoulsy like we would do with a classic API.
                After a create, update or remove, we refetch the todos to refresh the list.`

  let errorIndex = '', errorShow = '', errorCreate = '', errorUpdate = '', errorDelete = ''
  let list: Todo[] = []
  let todo: Todo|undefined

  const index = async () => {
    const response = await getTodos()

    todoEvents.add('Request: index -> GET /todos')

    if (response.status === 200) {
      list = await response.json()
    } else {
      errorIndex = response.statusText
    }
  }

  const show = async (id: Todo['id']) => {
    const response = await getTodo(id)

    todoEvents.add(`Request: show -> GET /todo/${id}`)

    if (response.status === 200) {
      todo = await response.json()
    } else {
      errorShow = response.statusText
    }
  }

  const create = async (name: Todo['name']) => {
    const response = await createTodo(name)

    todoEvents.add(`Request: create -> POST /todos with {name: ${name}}`)

    if (response.status === 201) {
      const res = await response.json()

      await index()

      return true
    } else {
      errorCreate = response.statusText

      return false
    }
  }

  const update = async (id: Todo['id'], name: Todo['name']) => {
    const response = await updateTodo(id, name)

    todoEvents.add(`Request: update -> PATCH /todos/${id} with {name: ${name}}`)

    if (response.status === 200) {
      await response.json()

      await index()

      return true
    } else {
      errorUpdate = response.statusText

      return false
    }
  }

  const remove = async (id: Todo['id']) => {
    const response = await deleteTodo(id)

    todoEvents.add(`Request: remove -> DELETE /todos/${id}`)

    if (response.status === 200) {
      await response.json()
      
      await index()

    } else {
      errorShow = response.statusText
    }
  }

  const resetError = () => {
    errorIndex = '', errorShow = '', errorCreate = '', errorUpdate = '', errorDelete = ''
  }

  const resetTodo = () => {
    todo = undefined
  }

  onMount(async () => {
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
