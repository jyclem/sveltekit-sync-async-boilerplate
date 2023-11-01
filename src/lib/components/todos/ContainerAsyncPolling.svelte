<script lang="ts">
  import { onMount } from 'svelte'

  import { todoEvents } from '$lib/stores/todoEvents'
  import { getTodos, getTodo } from '$lib/api/todos-sync'
  import { getJob, createTodo, updateTodo, deleteTodo } from '$lib/api/todos-async'

  import ContainerWrapper from './ContainerWrapper.svelte'
  import Input from './items/Input.svelte'
  import List from './items/List.svelte'

  const text = `Here we execute all our create, update and delete requests asynchronoulsy.
                It means that they will get a job_id in response, and poll on the associated job
                until it is finished before fetching the todos to refresh the list.`

  let errorIndex = '', errorShow = '', errorCreate = '', errorUpdate = '', errorDelete = ''
  let list: Todo[] = []
  let todo: Todo|undefined

  const poll = async (jobId: string, callback: () => void) => {
    const pollingId = setInterval(async () => {
      const response = await getJob(jobId)

      todoEvents.add(`Polling: getJob -> GET /job/${jobId}`)

      const res = await response.json()

      if (res.status === 'complete') {
        todoEvents.add('Polling: job execution complete')

        clearInterval(pollingId)

        callback()
      }
    }, 1000)
  }

  const index = async () => {
    const response = await getTodos()

    todoEvents.add('Request: index -> GET /todos')

    if (response.status === 200) {
      list = await response.json()
    } else {
      errorIndex = response.statusText
    }
  }

  const show = async (id: string) => {
    const response = await getTodo(id)

    todoEvents.add(`Request: show -> GET /todo/${id}`)

    if (response.status === 200) {
      todo = await response.json()
    } else {
      errorShow = response.statusText
    }
  }

  const create = async (name: string) => {
    const response = await createTodo(name)

    todoEvents.add(`Request: create -> POST /todos with {name: ${name}}`)

    if (response.status === 201) {
      const res = await response.json()

      poll(res.job_id, async () => {
        await index()
      })

      return true
    } else {
      errorCreate = response.statusText

      return false
    }
  }

  const update = async (id: string, name: string) => {
    const response = await updateTodo(id, name)

    todoEvents.add(`Request: update -> PATCH /todos/${id} with {name: ${name}}`)

    if (response.status === 200) {
      const res = await response.json()

      poll(res.job_id, async () => {
        await index()
      })

      return true
    } else {
      errorUpdate = response.statusText

      return false
    }
  }

  const remove = async (id: string) => {
    const response = await deleteTodo(id)

    todoEvents.add(`Request: remove -> DELETE /todos/${id}`)

    if (response.status === 200) {
      const res = await response.json()
      
      poll(res.job_id, async () => {
        await index()
      })
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
