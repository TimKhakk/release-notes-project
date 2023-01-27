<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';
	import type { PageData } from './$types';
	import dayjs from 'dayjs';
	import { page } from '$app/stores';
	import type { IssueNode, ProjectNode } from '$lib/graphql/queries/queryTeam';

	export let data: PageData;
	console.log('data', data);

	let heading: boolean = true;
	let bussinesNotesURL = '';
	let qaNotesURL = '';
	let releaseNotesDate = new Date();
	let preview: ProjectNode[] = [];

	const handleProjectClick = (pr: ProjectNode) => {
		const hasThisProject = preview.find(({ id }) => id === pr.id);

		if (hasThisProject) {
			return (preview = preview.filter(({ id }) => id !== pr.id));
		}

		preview = [...preview, pr];
	};

	const handleIssueClick = (pr: ProjectNode, issue: IssueNode) => {
		const oldProject = preview.find(({ id }) => id === pr.id);

		if (!oldProject) {
			const newProject: ProjectNode = {
				...pr,
				issues: { nodes: [issue] }
			};

			return (preview = [...preview, newProject]);
		}

		const oldIssues = oldProject.issues.nodes;
		const oldIssue = oldIssues.find(({ id }) => id === issue.id);

		let updatedIssues: IssueNode[] = [...oldIssues, issue];

		if (oldIssue) {
			const isOnlyOne = oldIssues.length === 1;
			if (isOnlyOne) {
				preview = preview.filter(({ id }) => id !== pr.id);
				return;
			}

			updatedIssues = oldIssues.filter(({ id }) => id !== issue.id);
		}

		const updatedProject: ProjectNode = {
			...oldProject,
			issues: { nodes: updatedIssues }
		};

		preview = preview.map((pr) => {
			if (pr.id === oldProject.id) {
				return updatedProject;
			}
			return pr;
		});
	};

	$: resolveProjectChecked = (pr: ProjectNode) => {
		return Boolean(preview.find(({ id }) => id === pr.id));
	};

	$: resolveIssueChecked = ({ id: projectId }: ProjectNode, { id: issueId }: IssueNode) => {
		const project = preview.find(({ id }) => id === projectId);
		const projectChecked = Boolean(project);
		if (!projectChecked) return false;

		const issueFromState = project?.issues.nodes.find(({ id }) => id === issueId);

		return Boolean(issueFromState);
	};

	const prepareStageName = (name: string) => name.toLowerCase().replace('on', '').trim();
	const capitalize = (str: string) => (str.length ? str[0].toUpperCase() + str.slice(1) : '');
	$: stageName = $page.url.searchParams.get('stageName') ?? '';
	$: preparedStageName = capitalize(prepareStageName(stageName));
</script>

<div class="flex items-center gap-4 mb-5">
	<label class="cursor-pointer text-amber-900 hover:text-amber-600">
		<span
			class="border-2 border-svelte rounded inline-flex hover:border-svelte/50 transition"
			class:bg-svelte={heading}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				class="w-3 h-3 fill-white"
				class:fill-transparent={!heading}
				><path fill="none" d="M0 0h24v24H0z" /><path
					class="stroke-2"
					d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
				/></svg
			></span
		>
		Release Notes heading
		<input type="checkbox" class="appearance-none" bind:checked={heading} />
	</label>

	<label>
		Date:
		<input type="date" bind:value={releaseNotesDate} />
	</label>
</div>

<label class="grid grid-cols-[200px_1fr] items-center gap-2 my-1">
	<span>Bussines Notes link:</span>
	<input class="border px-1 py-0.5" type="url" bind:value={bussinesNotesURL} />
</label>

<label class="grid grid-cols-[200px_1fr] items-center gap-2 my-1 mb-10">
	<span>QA Notes link:</span>
	<input class="border px-1 py-0.5" type="url" bind:value={qaNotesURL} />
</label>

{#if data?.projects?.length}
	<div class="grid grid-cols-2">
		<div class="flex flex-col gap-5">
			{#each data.projects as project}
				<div class="flex flex-col gap-1">
					<Checkbox
						checked={resolveProjectChecked(project)}
						onClick={() => handleProjectClick(project)}
						boldLabel
					>
						{project.name}
					</Checkbox>

					<ul class="flex flex-col ml-6">
						{#each project.issues.nodes as issue}
							<li>
								<Checkbox
									checked={resolveIssueChecked(project, issue)}
									onClick={() => handleIssueClick(project, issue)}
								>
									{issue.title}
								</Checkbox>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="flex flex-col px-1 py-0.5" contenteditable="true">
			{#if heading}
				<h1 class="text-[20px]">
					Release Notes ({dayjs(releaseNotesDate).format('MMMM DD')}, {preparedStageName})
				</h1>
				<br />
			{/if}
			{#each preview as project, idx}
				<div class="flex flex-col text-[14px]">
					<h4><strong>{project.name}</strong></h4>

					<ul class="flex flex-col ml-6">
						{#each project.issues.nodes as issue}
							<li>
								<a
									on:click|preventDefault
									class="inline-flex w-max text-blue-400 hover:underline cursor-pointer"
									href={issue.url}>{issue.identifier}</a
								>
								{issue.title}
							</li>
						{/each}
					</ul>
				</div>
				<br />
			{/each}

			{#if preview.length && (bussinesNotesURL || qaNotesURL)}
				<hr />
				<br />
			{/if}

			{#if bussinesNotesURL && bussinesNotesURL.startsWith('https://')}
				<p>
					<a
						on:click|preventDefault
						class="flex w-max text-blue-400 hover:underline cursor-pointer text-[14px]"
						href={bussinesNotesURL}>Bussines Notes</a
					>
				</p>
			{/if}
			{#if qaNotesURL && qaNotesURL.startsWith('https://')}
				<p>
					<a
						on:click|preventDefault
						class="flex w-max text-blue-400 hover:underline cursor-pointer text-[14px]"
						href={qaNotesURL}>QA Notes</a
					>
				</p>
			{/if}
		</div>
	</div>
{:else}
	<div>Nothing found</div>
{/if}
