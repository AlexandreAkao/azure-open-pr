import axios, { AxiosInstance } from "axios";
import { IRepository } from "../model/IRepository";
import { IPr } from "../model/IPr";

const { VITE_ORGANIZATION, VITE_PROJECT_NAME } = import.meta.env;
export const DEFAULT_AZURE_URL = `https://dev.azure.com/${VITE_ORGANIZATION}/${VITE_PROJECT_NAME}`;

interface IAzureResponse<T> {
  value: T;
  count: number;
}

const buildApiUrl = (organization: string, project: string) => {
  return `https://dev.azure.com/${organization}/${project}`;
};

export const createApi = (options?: {
  organization: string;
  projectName: string;
}) => {
  const baseURL =
    options?.organization && options?.projectName
      ? buildApiUrl(options.organization, options.projectName)
      : DEFAULT_AZURE_URL;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const api: AxiosInstance = axios.create({ baseURL, headers });

  const getRepositories = async () => {
    const repositories = await api.get<IAzureResponse<IRepository[]>>(
      `_apis/git/repositories`
    );

    if (repositories.status === 203)
      throw new Error(
        "Não foi possível obter os repositórios, verifique o token"
      );

    return repositories.data;
  };

  const getPrs = async (id: string) => {
    const prs = await api.get<IAzureResponse<IPr[]>>(
      `_apis/git/repositories/${id}/pullRequests`,
      {
        params: {
          "searchCriteria.status": "active",
        },
      }
    );

    const { value } = prs.data;

    return { value, count: value.length };
  };

  return { getRepositories, getPrs };
};
