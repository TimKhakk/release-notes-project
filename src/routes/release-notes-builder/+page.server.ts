import {
	SET_SCOPE_STATE_ID_ACTION_KEY_NAME,
	SET_SCOPE_TEAM_ID_ACTION_KEY_NAME
} from '$lib/constants/actionKeyNames';
import {
	LINEAR_API_COOKIE_KEY_NAME,
	SCOPE_STATE_ID_COOKIE_KEY_NAME,
	SCOPE_TEAM_ID_COOKIE_KEY_NAME
} from '$lib/constants/cookieKeyNames';
import {
	LINEAR_API_KEY_NAME,
	SCOPE_STATE_ID_KEY_NAME,
	SCOPE_TEAM_ID_KEY_NAME
} from '$lib/constants/formDataNames';
import { queryIssues, queryTeams, queryWorkflowState } from '$lib/graphql/queries';
import { LinearClient } from '@linear/sdk';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	const apiKey = JSON.parse(cookies.get(LINEAR_API_COOKIE_KEY_NAME) ?? 'null');

	const linearClient = new LinearClient({ apiKey });
	const graphQLClient = linearClient.client;

	async function loadTeams() {
		const states = await graphQLClient.rawRequest(queryTeams);

		return (states.data?.teams?.nodes as any[]) ?? [];
	}
	const teams = await loadTeams();

	const scopeTeamId =
		JSON.parse(cookies.get(SCOPE_TEAM_ID_COOKIE_KEY_NAME) ?? 'null') ?? teams[0].id;

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

		return (states.data?.workflowStates?.nodes as any[]) ?? [];
	}
	const states = await loadWorkFlowState();

	const scopeStateId =
		JSON.parse(cookies.get(SCOPE_STATE_ID_COOKIE_KEY_NAME) ?? 'null') ?? states[0].id;

  async function processQueryIssues() {
    const res = await graphQLClient.rawRequest(queryIssues, {
      filter: {
        team: {
          id: {
            eq: scopeTeamId,
          }
        },
        state: {
          id: {
            eq: scopeStateId,
          }
        }
      }
    });
    return (await res.data?.issues?.nodes ?? []) as any[];
  }
  const issues = await processQueryIssues();

	return {
		scopeStateId,
		scopeTeamId,
		states,
		teams,
    issues,
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	[SET_SCOPE_TEAM_ID_ACTION_KEY_NAME]: async ({ request, cookies }) => {
		const formData = await request.formData();
		const teamId = formData.get(SCOPE_TEAM_ID_KEY_NAME);
		cookies.set(SCOPE_TEAM_ID_COOKIE_KEY_NAME, JSON.stringify(teamId));

		return { success: true, message: '' };
	},

	[SET_SCOPE_STATE_ID_ACTION_KEY_NAME]: async ({ request, cookies }) => {
		console.log('SET_SCOPE_STATE_ID_ACTION_KEY_NAME', SET_SCOPE_STATE_ID_ACTION_KEY_NAME);
		const formData = await request.formData();
		const stateId = formData.get(SCOPE_STATE_ID_KEY_NAME);
		cookies.set(SCOPE_STATE_ID_COOKIE_KEY_NAME, JSON.stringify(stateId));

		return { success: true, message: '' };
	}
};
