<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col gap-6 my-4">
	<ul>
		{#each data.teams as team}
			<li class="hover:underline text-blue-400 hover:text-blue-500 cursor-pointer">
				<a href={`/release-notes-builder/${team.id}`}>
					{team.name}
				</a>
			</li>
		{/each}
	</ul>
</div>
