import { SET_SCOPE_STATE_ID_ACTION_KEY_NAME } from '$lib/constants/actionKeyNames';
import {
	LINEAR_API_COOKIE_KEY_NAME,
	SCOPE_STATE_ID_COOKIE_KEY_NAME
} from '$lib/constants/cookieKeyNames';
import { SCOPE_STATE_ID_KEY_NAME } from '$lib/constants/formDataNames';
import { parseFromCookies } from '$lib/cookies/parseFromCookies';
import { queryWorkflowState } from '$lib/graphql/queries';
import { queryTeam, queryTeamVariables, type ProjectNode } from '$lib/graphql/queries/queryTeam';
import { connect } from '$lib/linearClient/connect';
import type { Actions, PageServerLoad } from './$types';

const STAGES = ['whiskey', 'tango', 'foxtrot'];

export const load = (async ({ cookies, url, params }) => {
	if (!params.team) return;

	const { team: scopeTeamId } = params;

	const apiKey = parseFromCookies(LINEAR_API_COOKIE_KEY_NAME, cookies);

	if (apiKey === null) return;

	const graphQLClient = connect({ apiKey });

	async function loadWorkFlowState() {
		const states = await graphQLClient.rawRequest(queryWorkflowState, {
			filter: {
				team: {
					id: {
						eq: scopeTeamId
					}
				}
			}
		});

		return (
			(states.data?.workflowStates?.nodes as {
				id: string;
				name: string;
				team: {
					id: string;
					name: string;
				};
			}[]) ?? []
		);
	}

	const allStates = await loadWorkFlowState();
	const states = allStates.filter(({ name }) =>
		STAGES.some((stage) => name.toLowerCase().includes(stage))
	);

	const scopeStateId = parseFromCookies(SCOPE_STATE_ID_COOKIE_KEY_NAME, cookies) ?? states[0].id;

	async function loadTeamWithIssuesByState() {
		const res = await graphQLClient.rawRequest(
			queryTeam,
			queryTeamVariables(scopeTeamId, scopeStateId)
		);

		return ((await res.data?.team?.projects?.nodes) ?? []) as ProjectNode[];
	}

	// const allProjects = await loadTeamWithIssuesByState();
	const allProjects: ProjectNode[] = [];

	const projects = allProjects.filter((pr) => pr.issues?.nodes?.length);

	return {
		states,
		scopeStateId,
		projects
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	[SET_SCOPE_STATE_ID_ACTION_KEY_NAME]: async ({ request, cookies }) => {
		const formData = await request.formData();
		const stateId = formData.get(SCOPE_STATE_ID_KEY_NAME);

		if (!stateId) {
			return {
				success: false,
				message: 'failed to update state id'
			};
		}

		cookies.set(SCOPE_STATE_ID_COOKIE_KEY_NAME, JSON.stringify(stateId));

		return { success: true, message: '' };
	}
};
