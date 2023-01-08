<script lang="ts">
	import Button from "$lib/components/Button.svelte";

	let value = '';

	function handleSubmit() {
		console.log('submit', value);
	}
</script>

<svelte:head>
	<title>Settings</title>
	<meta name="description" content="Settings this app" />
</svelte:head>

<div class="flex flex-col">
	<form
		on:submit|preventDefault={handleSubmit}
		class="flex flex-col gap-3 border items-start justify-start border-svelte rounded-md p-4"
	>
		<label class="grid grid-cols-[180px_1fr] w-8/12">
			<span>Linear api key</span>
			<input class="border border-black/50 px-1 pt-0.5" type="text" bind:value />
		</label>
    <Button>Update</Button>
	</form>
</div>
