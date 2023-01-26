<script lang="ts">
	export let onClick: VoidFunction;
	export let checked: boolean;

	export let boldLabel: boolean = false;
</script>

<label class="cursor-pointer text-amber-900 hover:text-amber-600" class:font-bold={boldLabel}>
	<span
		class="border-2 border-svelte rounded inline-flex hover:border-svelte/50 transition"
		class:bg-svelte={checked}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			class="w-3 h-3 fill-white"
			class:fill-transparent={!checked}
			><path fill="none" d="M0 0h24v24H0z" /><path
				class="stroke-2"
				d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
			/></svg
		></span
	>
	<slot />
	<input type="checkbox" class="appearance-none" on:click={onClick} {checked} />
</label>
