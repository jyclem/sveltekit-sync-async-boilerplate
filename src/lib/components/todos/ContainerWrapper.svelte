<script lang="ts">
  import Description from './items/Description.svelte'
  import Events from './items/Events.svelte'

  export let text = ''
</script>

<div class="container">
  <div class="column">
    <div class="row">
      <Description {text} />
    </div>
    <div class="row">
      <slot name="input" />
    </div>
    <div class="row">
      <slot name="list" />
    </div>
  </div>

  <div class="column">
    <Events />
  </div>
</div>

<style lang="scss">
  .container {
    display: grid;
    grid-template-columns: 3fr 2fr;
    column-gap: 1em;

    .row:not(:last-child) {
      margin-bottom: 2em;
    }
  }
</style>