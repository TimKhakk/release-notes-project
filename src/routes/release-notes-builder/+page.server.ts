import { LINEAR_API_COOKIE_KEY_NAME } from '$lib/constants/cookieKeyNames';
import { queryTeams } from '$lib/graphql/queries';
import { LinearClient } from '@linear/sdk';
import type { PageServerLoad } from './$types';

const TEAMS = ['front', 'back'];

export const load = (async ({ cookies }) => {
	const apiKey = JSON.parse(cookies.get(LINEAR_API_COOKIE_KEY_NAME) ?? 'null');

	const linearClient = new LinearClient({ apiKey });
	const graphQLClient = linearClient.client;

	async function loadTeams() {
		const states = await graphQLClient.rawRequest(queryTeams);

		return (
			(states.data?.teams?.nodes as {
				name: string;
				id: string;
			}[]) ?? []
		);
	}
	const allTeams = await loadTeams();

	const teams = allTeams.filter(({ name }) => TEAMS.some((t) => name.toLowerCase().includes(t)));

	return {
		teams
	};
}) satisfies PageServerLoad;
