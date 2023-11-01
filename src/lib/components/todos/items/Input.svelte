<script lang="ts">
  export let todo: Todo|undefined
  export let error: string = ''
  export let create: (name: string) => Promise<boolean>
  export let update: (id: string, name: string) => Promise<boolean>
  export let resetError: () => void
  export let resetTodo: () => void

  let name: string = ''

  const onInput = (event: Event) => {
    name = (event.target as HTMLInputElement).value
    resetError()
  }

  const onCreate = async () => {
    const isSuccess: boolean = await create(name)

    if (isSuccess) name = ''
  }

  const onUpdate = async () => {
    const isSuccess: boolean = await update(todo!.id, name)

    if (isSuccess) {
      name = ''
      resetTodo()
    }
  }
</script>

<div class="input">
  <div>
    <input 
      type="text" name="submit" required value={todo?.name || name} on:input={onInput}
    />
    <label for="submit">Name</label>
  </div>

  {#if todo}
    <button on:click={onUpdate}>Update</button>
  {:else}
    <button disabled={!!(!name)} on:click={onCreate}>Create</button>
  {/if}
</div>
{#if error}
  <div class="error">Error: {error}</div>
{/if}

<style lang="scss">
  .input {
    display: flex;

    div {
      position: relative;
      width: 80%;

      input {
        background: none;
        color: black;
        font-size: 18px;
        margin-right: 1em;
        padding: 10px 10px 10px 5px;
        display: block;
        width: 90%;
        border: none;
        border-radius: 0;
        border-bottom: 1px solid #c6c6c6;
        
        &:focus {
          outline: none;
        }

        &:focus ~ label, &:valid ~ label {
          top: -14px;
          font-size: 12px;
          color: black;
        }
      }

      label {
        position: absolute;
        top: 1em;
        color: #c6c6c6;
        transition: 300ms ease all;
      }
    }

    button {
      background: linear-gradient(to bottom right, rgb(53, 52, 52), rgb(146, 145, 145));
      height: 40px;
      border: 0;
      border-radius: 12px;
      color: #FFFFFF;
      cursor: pointer;
      display: inline-block;
      font-size: 16px;
      font-weight: 500;
      line-height: 2.5;
      outline: transparent;
      padding: 0 1rem;
      text-align: center;
      text-decoration: none;
      transition: box-shadow .2s ease-in-out;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      white-space: nowrap;

      &:disabled {
        background: rgb(216, 215, 215);
      }

      &:not([disabled]):focus {
        box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(66, 66, 66, 0.5), .125rem .125rem 1rem rgba(109, 108, 108, 0.5);
      }

      &:not([disabled]):hover {
        box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(66, 66, 66, 0.5), .125rem .125rem 1rem rgba(109, 108, 108, 0.5);
      }
    }
  }

  .error {
    margin-top: 0.5em;
    color: red;
  }
</style>