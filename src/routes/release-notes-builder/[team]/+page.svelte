<script lang="ts">
	import { enhance } from '$app/forms';
	import { actionPathGenerator } from '$lib/actions/actionPathGenerator';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { SET_SCOPE_STATE_ID_ACTION_KEY_NAME } from '$lib/constants/actionKeyNames';
	import { SCOPE_STATE_ID_KEY_NAME } from '$lib/constants/formDataNames';
	import { mockProjects } from '$lib/constants/mockProjects';
	import type { PageData } from './$types';
	import dayjs from 'dayjs';

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
	$: stageName = data.states?.find(({ id }) => id === data.scopeStateId)?.name ?? '';
	$: preparedStageName = capitalize(prepareStageName(stageName));
</script>

{#if data.states}
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
		Release notes heading
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
				<h1 class="text-xl">
					Release notes ({dayjs(releaseNotesDate).format('MMMM DD')}, {preparedStageName})
				</h1>
				<br />
			{/if}
			{#each preview as project}
				<div class="flex flex-col text-base">
					<h4 class="font-bold">{project.name}</h4>

					<ul class="flex flex-col ml-6">
						{#each project.issues.nodes as issue}
							<li>{issue.title}</li>
						{/each}
					</ul>
				</div>
			{/each}

			{#if preview.length && (bussinesNotesURL || qaNotesURL)}
				<br />
				<hr />
				<br />
			{/if}

			{#if bussinesNotesURL && bussinesNotesURL.startsWith('https://')}
				<div>
					<a
						on:click|preventDefault
						class="flex w-max text-blue-400 hover:underline cursor-pointer"
						href={bussinesNotesURL}>Bussines Notes</a
					>
				</div>
			{/if}
			{#if qaNotesURL && qaNotesURL.startsWith('https://')}
				<div>
					<a
						on:click|preventDefault
						class="flex w-max text-blue-400 hover:underline cursor-pointer"
						href={qaNotesURL}>QA Notes</a
					>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div>Nothing found</div>
{/if}
