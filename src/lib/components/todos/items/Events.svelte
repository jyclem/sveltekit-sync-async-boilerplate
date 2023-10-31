<script lang="ts">
  import { fly } from 'svelte/transition'
  import { todoEvents } from '$lib/stores/todoEvents'
</script>

<div class='container'>
  <div class="title">Events</div>
  <div class="events">
    {#each $todoEvents as event (event)}
      {#if event.justAppeared}
        <div transition:fly={{ y: '100em', duration: 100000 }}>
          {event.name}
        </div>
      {/if}
    {/each}
  </div>
</div>

<style lang="scss">
  .container {
    height: 100%;
    .title {
      text-align: center;
    }

    .events {
      margin-top: 1em;
      height: 100%;
      border: solid 1px #c6c6c6;
      border-radius: 5px;
      padding: 0.5em;
      overflow: hidden;

      div {
        color: #c6c6c6;
        font-style: italic;
      }
    }
  }
</style>