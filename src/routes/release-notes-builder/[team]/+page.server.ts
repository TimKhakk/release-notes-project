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
import { reverse, sortBy } from 'lodash';
import { redirect } from '@sveltejs/kit';

const STAGES = ['whiskey', 'tango', 'foxtrot'];

export const load = (async ({ cookies, url, params }) => {
	if (!params.team) return;

	const { team: scopeTeamId } = params;

	const apiKey = parseFromCookies(LINEAR_API_COOKIE_KEY_NAME, cookies);

	if (!apiKey) {
		throw redirect(300, './settings')
	}

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
	const states = reverse(sortBy(allStates
		.filter(({ name }) =>
			STAGES.some((stage) => name.toLowerCase().includes(stage))
		), 'name'));

	const scopeStateIdFromCookies = parseFromCookies(SCOPE_STATE_ID_COOKIE_KEY_NAME, cookies);

	const isInAllState = (scopeId: string | null): scopeId is string => {
		return Boolean(states.find(({ id }) => id === scopeStateIdFromCookies))
	}

	const scopeStateId = isInAllState(scopeStateIdFromCookies) ? scopeStateIdFromCookies : states[0].id;

	return {
		states,
		scopeStateId,
	};
}) satisfies PageServerLoad;
