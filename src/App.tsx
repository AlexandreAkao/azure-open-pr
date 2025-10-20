import { useCallback, useEffect, useState } from "react";
import { createApi } from "./service/api";
import { useConfig } from "./context/useConfig";
import { useChromeStorageLocal } from "use-chrome-storage";
import Collapse from "./components/Collapse";
import Repository from "./components/Repository";
import Settings from "./components/Settings";
import { IRepository } from "./model/IRepository";
import { IPr } from "./model/IPr";
import PullRequest from "./components/PullRequest";
import { SearchInput } from "./styled";
import { setTextBadge } from "./utils/chromeExtension";
import useTimeout from "./hooks/useTimeout";

import "./App.css";

type Prs = {
  title: string;
  data: IPr[];
};

const storage = <T,>(key: string, defaultValue: T) => {
  const isDev = import.meta.env.DEV;

  if (isDev) {
    return () => useState(defaultValue);
  }

  return () => useChromeStorageLocal(key, defaultValue);
};

function App() {
  const [activeRepositories, setActiveRepositories, isInitialStateResolved] =
    storage<string[]>("activeRepositories", [])();

  const [hasError, setHasError] = useState(false);
  const [repositories, setRepositories] = useState<IRepository[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [prs, setPrs] = useState<Prs[]>([]);
  const [search, setSearch] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [prsCount, setPrsCount] = useState(() =>
    prs.reduce((acc, pr) => acc + pr.data.length, 0)
  );

  const { organization, projectName } = useConfig();

  const fetchRepositories = useCallback(async () => {
    try {
      const api = createApi({ organization, projectName });
      const repoData = await api.getRepositories();
      setRepositories(repoData.value);
      setHasError(false);
    } catch (error) {
      setHasError(true);
      console.log(error);
    }
  }, [organization, projectName]);

  const fetchPrs = useCallback(async () => {
    if (!isInitialStateResolved) return;

    setPrs([]);
    const prDatas: Prs[] = [];

    const api = createApi({ organization, projectName });
    await Promise.all(
      activeRepositories.map(async (id) => {
        const pr = await api.getPrs(id);
        if (pr.count > 0) {
          const prData: Prs = {
            title: pr.value[0].repository.name,
            data: pr.value,
          };
          prDatas.push(prData);
        }
      })
    );
    const count = prDatas.reduce((acc, pr) => acc + pr.data.length, 0);

    console.log({ prDatas, count });
    setPrsCount(count);
    setPrs(prDatas);

    const badgeText = count > 0 ? count.toString() : "";
    setTextBadge(badgeText);
  }, [activeRepositories, organization, projectName, isInitialStateResolved]);

  useTimeout(fetchRepositories, 30000);
  useTimeout(fetchPrs, 30000);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  useEffect(() => {
    fetchPrs();
  }, [fetchPrs]);

  const handleAddOrRemoveActive = (id: string) => {
    if (activeRepositories.includes(id)) {
      setActiveRepositories((prev) => prev.filter((item) => item !== id));
    } else {
      setActiveRepositories((prev) => [...prev, id]);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="app-shell">
      <div className="card-centered">
        <h1
          style={{
            fontWeight: 800,
            fontSize: 36,
            marginBottom: 10,
            color: "#90caf9",
            letterSpacing: -1,
            textShadow: "0 2px 8px #0006",
          }}
        >
          Azure Open PRs
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p style={{ color: "#b0bec5", marginBottom: 28, fontSize: 18 }}>
            Visualize e acompanhe Pull Requests dos seus repositórios.
          </p>
          <div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="btn"
              style={{
                background: "#17202a",
                color: "#bdddff",
                border: "1px solid #334",
              }}
            >
              Configurações
            </button>
          </div>
        </div>

        {hasError && (
          <div
            style={{
              background: "#2d1b1b",
              color: "#ff8a80",
              borderRadius: 10,
              padding: 18,
              marginBottom: 28,
              border: "1.5px solid #b71c1c",
              fontWeight: 600,
              boxShadow: "0 2px 8px #0005",
            }}
          >
            <span style={{ fontSize: 18 }}>
              Erro ao carregar os repositórios.
            </span>
            <div style={{ fontWeight: 400, marginTop: 6 }}>
              Por favor, acesse a página da Azure para gerar um novo Token.
            </div>
          </div>
        )}

        <Collapse title="Repositórios" isOpen={isOpen} toggleOpen={setIsOpen}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
              padding: 4,
              border: "1.5px solid #333a4d",
            }}
          >
            <SearchInput
              placeholder="Buscar repositório..."
              onChange={handleSearch}
              value={search}
              style={{
                flex: 1,
                background: "#23272f",
                color: "#fff",
                border: "none",
              }}
            />
            <span style={{ color: "#b0bec5", fontSize: 15 }}>
              {repositories.length} encontrados
            </span>
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto", marginBottom: 8 }}>
            {repositories
              ?.filter((repository) =>
                repository.name.toLowerCase().includes(search.toLowerCase())
              )
              .sort((a) => (activeRepositories.includes(a.id) ? -1 : 1))
              .map((repository) => (
                <div
                  style={{
                    background: activeRepositories.includes(repository.id)
                      ? "#263245"
                      : "#23272f",
                    borderRadius: 8,
                    marginBottom: 6,
                    border: activeRepositories.includes(repository.id)
                      ? "1.5px solid #90caf9"
                      : "1.5px solid #333a4d",
                    transition: "all 0.2s",
                  }}
                >
                  <Repository
                    key={repository.id}
                    name={repository.name}
                    id={repository.id}
                    onCheckbox={handleAddOrRemoveActive}
                    isChecked={activeRepositories.includes(repository.id)}
                  />
                </div>
              ))}
            {repositories.filter((repository) =>
              repository.name.toLowerCase().includes(search.toLowerCase())
            ).length === 0 && (
              <div
                style={{
                  color: "#607d8b",
                  fontSize: 15,
                  textAlign: "center",
                  padding: 16,
                }}
              >
                Nenhum repositório encontrado.
              </div>
            )}
          </div>
        </Collapse>

        <div style={{ marginTop: 38 }}>
          <h2
            style={{
              fontSize: 24,
              color: "#90caf9",
              marginBottom: 18,
              fontWeight: 700,
              textShadow: "0 1px 6px #0007",
            }}
          >
            Pull Requests{" "}
            {prsCount > 0 && (
              <span style={{ color: "#b3e5fc" }}>({prsCount})</span>
            )}
          </h2>
          {prs.length === 0 && (
            <div
              style={{
                color: "#789",
                fontSize: 17,
                textAlign: "center",
                padding: 28,
                background: "#23272f",
                borderRadius: 10,
                border: "1.5px solid #333a4d",
              }}
            >
              Nenhum Pull Request encontrado para os repositórios selecionados.
            </div>
          )}
          <div style={{ display: "grid", gap: 28 }}>
            {prs.map((pr) => (
              <div
                key={pr.title}
                style={{
                  background: "#263245",
                  borderRadius: 12,
                  padding: 24,
                  boxShadow: "0 2px 12px 0 #0006",
                  border: "1.5px solid #333a4d",
                }}
              >
                <h3
                  style={{
                    color: "#b3e5fc",
                    fontWeight: 700,
                    marginBottom: 14,
                    textShadow: "0 1px 4px #0007",
                  }}
                >
                  {pr.title}
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {pr.data.map((data) => (
                    <PullRequest
                      key={data.pullRequestId}
                      data={data}
                      imageUrl={data.createdBy._links.avatar.href}
                      title={data.title}
                      createdBy={data.createdBy.displayName}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
