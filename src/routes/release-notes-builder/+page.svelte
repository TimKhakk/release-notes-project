<script lang="ts">
	import { actionPathGenerator } from '$lib/actions/actionPathGenerator';
	import Button from '$lib/components/Button.svelte';
	import {
		SET_SCOPE_STATE_ID_ACTION_KEY_NAME,
		SET_SCOPE_TEAM_ID_ACTION_KEY_NAME
	} from '$lib/constants/actionKeyNames';
	import { SCOPE_STATE_ID_KEY_NAME, SCOPE_TEAM_ID_KEY_NAME } from '$lib/constants/formDataNames';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
</script>

<div class="flex gap-6 items-center">
	<form
		method="POST"
		action={actionPathGenerator(SET_SCOPE_TEAM_ID_ACTION_KEY_NAME)}
		class="flex gap-4 items-center"
	>
		<label>
			<span>Team:</span>
			<select value={data.scopeTeamId} name={SCOPE_TEAM_ID_KEY_NAME}>
				{#each data.teams as team}
					<option value={team.id}>{team.name}</option>
				{/each}
			</select>
		</label>

		<Button>set scope team id</Button>
	</form>

	<form
		method="POST"
		action={actionPathGenerator(SET_SCOPE_STATE_ID_ACTION_KEY_NAME)}
		class="flex gap-4 items-center"
	>
		<label>
			<span>State:</span>
			<select value={data.scopeStateId} name={SCOPE_STATE_ID_KEY_NAME}>
				{#each data.states as state}
					<option value={state.id}>{state.name}</option>
				{/each}
			</select>
		</label>

		<Button>set scope state id</Button>
	</form>
</div>
