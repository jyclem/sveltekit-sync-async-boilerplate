<script lang="ts">
  export let list: Todo[] = []
  export let error = ''
  export let show: (id: string) => Promise<void>
  export let remove: (id: string) => Promise<void>
  export let resetTodo: () => void

  let todoBeingUpdated: Todo|undefined

  const onEdit = (todo: Todo) => {
    todoBeingUpdated = todo

    show(todo.id)
  }

  const onCancel = () => {
    todoBeingUpdated = undefined

    resetTodo()
  }
</script>

{#if error}
  <div class='error'>Error: {error}</div>
{:else}
  <ol>
    {#each list as todo (todo.id)}
      <li>
        <div class="name">{todo.name}</div>
        <div class="actions">
          {#if todo === todoBeingUpdated}
            <button class="cancel" on:click={onCancel}>Cancel</button>
          {:else}
            <button class="edit" on:click={() => onEdit(todo)}>Edit</button>
            <button class="remove" on:click={() => remove(todo.id)}>Remove</button>
          {/if}
        </div>
      </li>
    {/each}
  </ol>
{/if}

<style lang="scss">
  .error {
    color: red;
  }

  ol {
    list-style-type: none;
    padding: 0;
    align-items: center;

    li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1em;
      border: 1px solid #c6c6c6;
      border-radius: 10px;
      padding: 0.5em;

      .name {
        align-self: center;
      }

      .actions {
        display: flex;
        align-self: flex-start;

        button {
          cursor: pointer;
          display: inline-block;
          padding: 3px 10px;
          margin: 0 5px;
          text-align: center;
          text-decoration: none;
          transition: all 250ms;
          border: 0;
          font-size: 16px;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          width: 5em;

          &.edit {
            background-color: #c2fbd7;
            color: green;
            box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(49, 49, 49, 0.2) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;

            &:hover {
              box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;
            }
          }

          &.remove {
            background-color: #ff4747;
            color: #8c0000;
            box-shadow: rgba(129, 3, 3, 0.2) 0 -25px 18px -14px inset,rgba(129, 3, 3, 0.2) 0 1px 2px,rgba(129, 3, 3, 0.2) 0 2px 4px,rgba(129, 3, 3, 0.2) 0 4px 8px,rgba(129, 3, 3, 0.2) 0 8px 16px,rgba(129, 3, 3, 0.2) 0 16px 32px;

            &:hover {
              box-shadow: rgba(75, 74, 74, 0.35) 0 -25px 18px -14px inset,rgba(212, 29, 4, 0.35) 0 1px 2px,rgba(212, 29, 4, 0.35) 0 2px 4px,rgba(212, 29, 4, 0.35) 0 4px 8px,rgba(212, 29, 4, 0.35) 0 8px 16px,rgba(212, 29, 4, 0.35) 0 16px 32px;
            }
          }

          &.cancel {
            background-color: #afadad;
            color: #504f4f;
            box-shadow: rgba(49, 49, 49, 0.2) 0 -25px 18px -14px inset,rgba(49, 49, 49, 0.2) 0 1px 2px,rgba(49, 49, 49, 0.2) 0 2px 4px,rgba(49, 49, 49, 0.2) 0 4px 8px,rgba(49, 49, 49, 0.2) 0 8px 16px,rgba(49, 49, 49, 0.2) 0 16px 32px;

            &:hover {
              box-shadow: rgba(75, 74, 74, 0.35) 0 -25px 18px -14px inset,rgba(75, 74, 74, 0.35) 0 1px 2px,rgba(75, 74, 74, 0.35) 0 2px 4px,rgba(75, 74, 74, 0.35) 0 4px 8px,rgba(75, 74, 74, 0.35) 0 8px 16px,rgba(75, 74, 74, 0.35) 0 16px 32px;
            }
          }

          &:hover {
            transform: scale(1.05) rotate(-1deg);
          }
        }
      }
    }
  }
</style>