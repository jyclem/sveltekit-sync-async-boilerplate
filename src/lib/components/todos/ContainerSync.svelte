<script lang="ts">
  import { onMount } from 'svelte'

  import { todoEvents } from '$lib/stores/todoEvents'

  import ContainerWrapper from './ContainerWrapper.svelte'
  import Input from './items/Input.svelte'
  import List from './items/List.svelte'

  import { getTodos, getTodo, createTodo, updateTodo, deleteTodo } from '$lib/api/todos-sync'

  const text = 'Here we execute all our requests synchronoulsy like we would do with a classic API'

  let errorIndex = '', errorShow = '', errorCreate = '', errorUpdate = '', errorDelete = ''
  let list: Todo[] = []
  let todo: Todo|undefined

  const index = async () => {
    const response = await getTodos()

    if (response.status === 200) {
      list = await response.json()

      todoEvents.add('Request: index -> GET /todos')
    } else {
      errorIndex = response.statusText
    }
  }

  const show = async (id: string) => {
    const response = await getTodo(id)

    if (response.status === 200) {
      todo = await response.json()

      todoEvents.add(`Request: show -> GET /todo/${id}`)
    } else {
      errorShow = response.statusText
    }
  }

  const create = async (name: string) => {
    const response = await createTodo(name)

    if (response.status === 201) {
      const res = await response.json()

      await index()
      
      todoEvents.add(`Request: create -> POST /todos with {name: ${name}}`)

      return true
    } else {
      errorCreate = response.statusText

      return false
    }
  }

  const update = async (id: string, name: string) => {
    const response = await updateTodo(id, name)

    if (response.status === 200) {
      await response.json()

      await index()
      
      todoEvents.add(`Request: update -> PATCH /todos/${id} with {name: ${name}}`)

      return true
    } else {
      errorUpdate = response.statusText

      return false
    }
  }

  const remove = async (id: string) => {
    const response = await deleteTodo(id)

    if (response.status === 200) {
      await response.json()
      
      await index()

      todoEvents.add(`Request: remove -> DELETE /todos/${id}`)
    } else {
      errorShow = response.statusText
    }
  }

  onMount(async () => {
    index()
  })

</script>

<ContainerWrapper {text}>
  <svelte:fragment slot="input">
    <Input {todo} error={errorCreate || errorShow || errorUpdate || errorDelete} {create} {update} />
  </svelte:fragment>

  <svelte:fragment slot="list">
    <List {list} error={errorIndex} {show} {remove} reset={() => todo = undefined} />
  </svelte:fragment>
</ContainerWrapper>
