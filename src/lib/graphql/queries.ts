export const queryWorkflowState = `
  query queryWorkflowState($filter: WorkflowStateFilter){
    workflowStates(filter: $filter) {
      nodes {
        id
        name
        team {
          id
          name
        }
      }
    }
  }
`;

export const queryTeams = `
  query queryTeams {
    teams {
      nodes {
        name
        id
      }
    }
  }
`;

export const queryIssues = `
  query queryIssues($filter: IssueFilter) {
    issues(filter: $filter) {
      nodes {
        id
        title
        state {
          id
          color
          name
        }
        project {
          id
          name
          color
          icon
        }
      }
    }
  }`;
