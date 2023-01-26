<script lang="ts">
	import { enhance } from '$app/forms';
	import { actionPathGenerator } from '$lib/actions/actionPathGenerator';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Checkbox.svelte';
	import { SET_SCOPE_STATE_ID_ACTION_KEY_NAME } from '$lib/constants/actionKeyNames';
	import { SCOPE_STATE_ID_KEY_NAME } from '$lib/constants/formDataNames';
	import { mockProjects } from '$lib/constants/mockProjects';
	import type { PageData, ActionData } from './$types';

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

	// let preview: StateItem[] = prepareState(mockProjects);
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

{#if mockProjects.length}
	<div class="grid grid-cols-2">
		<div class="flex flex-col gap-5">
			{#each mockProjects as project}
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
			{#each preview as project}
				<div class="flex flex-col">
					<h4 class="font-bold">{project.name}</h4>

					<ul class="flex flex-col ml-6">
						{#each project.issues.nodes as issue}
							<li>{issue.title}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div>Nothing found</div>
{/if}
