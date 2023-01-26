<script lang="ts">
	import { enhance } from '$app/forms';
	import { actionPathGenerator } from '$lib/actions/actionPathGenerator';
	import Button from '$lib/components/Button.svelte';
	import { SET_SCOPE_STATE_ID_ACTION_KEY_NAME } from '$lib/constants/actionKeyNames';
	import { SCOPE_STATE_ID_KEY_NAME } from '$lib/constants/formDataNames';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	console.log('data', data);

	let state = data?.states?.find((st) => st.id === data.scopeStateId);
  console.log('state', state);
</script>

{#if data.states}
  {state?.name ?? ''}
	<div class="flex gap-4 items-center mt-4">
		{#each data.states as state}
			<form
				method="POST"
        use:enhance={() => {}}
				action={actionPathGenerator(SET_SCOPE_STATE_ID_ACTION_KEY_NAME)}
				class="flex gap-4 mb-4 items-center"
			>
				<input hidden name={SCOPE_STATE_ID_KEY_NAME} value={state.id} />
				<Button>{state.name}</Button>
			</form>
		{/each}
	</div>
{/if}

{#if data.projects?.length}
	{#each data.projects as project}
		<div class="flex">{project.name}</div>
	{/each}
{:else}
	<div>Nothing found</div>
{/if}
