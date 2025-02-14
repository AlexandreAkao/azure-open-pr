import { IPr } from "../model/IPr";

export const getPullRequestUrl = (data: IPr) => {
  const { ORGANIZATION, PROJECT_NAME } = import.meta.env;

  return `https://dev.azure.com/${ORGANIZATION}/${PROJECT_NAME}/_git/${data.repository.name}/pullrequest/${data.pullRequestId}`;
};
