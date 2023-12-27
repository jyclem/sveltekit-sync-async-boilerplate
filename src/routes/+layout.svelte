<script lang="ts">
	import NavigationBar from '$lib/components/NavigationBar.svelte'
</script>

<NavigationBar />

<div>
	<slot />
</div>

<style lang="scss">
	div {
		display: flex;
		justify-content: center;
		margin-top: 2em;
	}
</style>
