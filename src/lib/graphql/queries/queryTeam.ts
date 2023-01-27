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
						url
						identifier
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
		nodes: IssueNode[];
	};
};

export interface IssueNode {
	id: string;
	title: string;
	url: string;
	identifier: string;
}


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
