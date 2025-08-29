import { useEffect, useState } from "react";
import { getPrs, getRepositories } from "./service/api";
import { useChromeStorageLocal } from "use-chrome-storage";
import Collapse from "./components/Collapse";
import Repository from "./components/Repository";
import { IRepository } from "./model/IRepository";
import { IPr } from "./model/IPr";
import PullRequest from "./components/PullRequest";
import { SearchInput } from "./styled";
import "./App.css";
import { setTextBadge } from "./utils/chromeExtension";

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
  const [hasError, setHasError] = useState(false);
  const [repositories, setRepositories] = useState<IRepository[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [
    activeRepositories,
    setActiveRepositories,
    ,
    ,
    isInitialStateResolved,
  ] = storage<string[]>("activeRepositories", [])();
  const [prs, setPrs] = useState<Prs[]>([]);
  const [search, setSearch] = useState("");
  const prsCount = prs.reduce((acc, pr) => acc + pr.data.length, 0);
  setTextBadge(prsCount.toString());

  useEffect(() => {
    (async () => {
      try {
        const repoData = await getRepositories();
        setRepositories(repoData.value);
        setHasError(false);
      } catch (error) {
        setHasError(true);
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setPrs([]);
      const prDatas: Prs[] = [];

      await Promise.all(
        activeRepositories.map(async (id) => {
          const pr = await getPrs(id);
          if (pr.count > 0) {
            const prData: Prs = {
              title: pr.value[0].repository.name,
              data: pr.value,
            };
            prDatas.push(prData);
          }
        })
      );

      setPrs(prDatas);
    })();
  }, [activeRepositories, isInitialStateResolved]);

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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        padding: 32,
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          background: "#23272f",
          borderRadius: 18,
          boxShadow: "0 4px 32px 0 #0008",
          padding: 40,
          border: "1.5px solid #333a4d",
          width: 600,
        }}
      >
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
        <p style={{ color: "#b0bec5", marginBottom: 28, fontSize: 18 }}>
          Visualize e acompanhe Pull Requests dos seus repositórios.
        </p>

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
    </div>
  );
}

export default App;
