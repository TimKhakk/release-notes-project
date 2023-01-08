<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { LINEAR_API_KEY_NAME } from '$lib/constants/formDataNames';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<svelte:head>
	<title>Settings</title>
	<meta name="description" content="Settings this app" />
</svelte:head>

<div class="flex flex-col">
	<form
		method="POST"
		class="flex flex-col gap-3 border items-start justify-start border-svelte rounded-md p-4"
	>
		<label class="grid grid-cols-[180px_1fr_1fr] gap-4 w-full">
			<span>Linear api key</span>
			<input
      value={data.apiKey}
				name={LINEAR_API_KEY_NAME}
				class="border border-black/50 px-1 pt-0.5"
				type="text"
			/>
			<span class={form?.success ? 'text-green-500' : 'text-red-500' + ' font-semibold'}>
				{form?.message ?? ''}
			</span>
		</label>
		<Button>Update</Button>
	</form>
</div>
