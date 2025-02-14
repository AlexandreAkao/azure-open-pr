import axios from "axios";
import { IRepository } from "../model/IRepository";
import { IPr } from "../model/IPr";

const { VITE_ORGANIZATION, VITE_PROJECT_ID } = import.meta.env;
export const AZURE_URL = `https://dev.azure.com/${VITE_ORGANIZATION}/${VITE_PROJECT_ID}`;

interface IAzureResponse<T> {
  value: T;
  count: number;
}

export const api = axios.create({
  baseURL: AZURE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getRepositories = async () => {
  const repositories = await api.get<IAzureResponse<IRepository[]>>(
    `_apis/git/repositories`
  );

  if (repositories.status === 203)
    throw new Error(
      "Não foi possível obter os repositórios, verifique o token"
    );

  return repositories.data;
};

export const getPrs = async (id: string) => {
  const prs = await api.get<IAzureResponse<IPr[]>>(
    `_apis/git/repositories/${id}/pullRequests`,
    {
      params: {
        "searchCriteria.status": "active",
      },
    }
  );

  const value = prs.data.value.filter(
    (pr) => !pr.createdBy.displayName.includes(VITE_ORGANIZATION)
  );

  return { value, count: value.length };
};
