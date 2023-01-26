export const queryTeam = `
query QueryTeam($teamId: String!, $filter: IssueFilter) {
  team(id: $teamId) {
    projects {
      nodes {
        id
        name
        issues(filter: $filter) {
          nodes {
            id
            title
          }
        }
      }
    }
  }
}`;

export type ProjectNode = {
	id: string;
	name: string;
	issues: {
		nodes: {
			id: string;
			title: string;
		}[];
	};
};

export function queryTeamVariables(teamId: string, stateId: string) {
	return {
		teamId,
		filter: {
			state: {
				id: {
					eq: stateId
				}
			}
		}
	};
}
