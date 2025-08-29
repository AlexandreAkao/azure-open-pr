import { IPr } from "../model/IPr";

export const getPullRequestUrl = (data: IPr) => {
  const { VITE_ORGANIZATION, VITE_PROJECT_NAME } = import.meta.env;

  return `https://dev.azure.com/${VITE_ORGANIZATION}/${VITE_PROJECT_NAME}/_git/${data.repository.name}/pullrequest/${data.pullRequestId}`;
};

export const getTaskUrl = (id: string) => {
  const { VITE_ORGANIZATION, VITE_BOARD_NAME } = import.meta.env;

  return `https://dev.azure.com/${VITE_ORGANIZATION}/${VITE_BOARD_NAME}/_workitems/edit/${id}`;
};
