import { LINEAR_API_COOKIE_KEY_NAME } from '$lib/constants/cookieKeyNames';
import { parseFromCookies } from '$lib/cookies/parseFromCookies';
import { queryTeams } from '$lib/graphql/queries';
import { queryTeam, queryTeamVariables, type ProjectNode } from '$lib/graphql/queries/queryTeam';
import { connect } from '$lib/linearClient/connect';
import { LinearClient } from '@linear/sdk';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies, params }) => {
  if (!params.team || !params.state) return;

	const { team: scopeTeamId } = params;

	const apiKey = parseFromCookies(LINEAR_API_COOKIE_KEY_NAME, cookies);

	if (!apiKey) {
		throw redirect(300, './settings')
	}

  const scopeStateId = params.state;

	const graphQLClient = connect({ apiKey });

  async function loadTeamWithIssuesByState() {
		const res = await graphQLClient.rawRequest(
			queryTeam,
			queryTeamVariables(scopeTeamId, scopeStateId)
		);

		return ((await res.data?.team?.projects?.nodes) ?? []) as ProjectNode[];
	}

	const allProjects = await loadTeamWithIssuesByState();

	const projects = allProjects.filter((pr) => pr.issues?.nodes?.length);

  return {
    projects
  }
}) satisfies PageServerLoad;
