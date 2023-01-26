<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;

	interface StateItem {
		id: string;
		name: string;
		checked: boolean;
		issues: {
			nodes: {
				id: string;
				title: string;
				checked: boolean;
			}[];
		};
	}

	interface IssueNode {
		id: string;
		title: string;
	}

	interface ProjectNode {
		id: string;
		name: string;
		issues: {
			nodes: IssueNode[];
		};
	}
</script>

<div class="flex flex-col gap-6 my-4">
	<ul>
		{#each data.states as state}
			<li class="hover:underline text-blue-400 hover:text-blue-500 cursor-pointer">
				<a href={`${$page.params.team}/${state.id}?stageName=${state.name}`}>
					{state.name}
				</a>
			</li>
		{/each}
	</ul>
</div>
