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
  const [isOpen, setIsOpen] = useState(false);
  // const [token, setToken] = useState("");
  // const [token, setToken] = storage<string>("token", "")();

  // const [token, setToken] = useChromeStorageLocal<
  //   string
  // >("token", "");
  // const [activeRepositories, setActiveRepositories] = useChromeStorageLocal<
  //   string[]
  // >("activeRepositories", []);
  const [
    activeRepositories,
    setActiveRepositories,
    ,
    ,
    isInitialStateResolved,
  ] = storage<string[]>("activeRepositories", [])();
  // const [activeRepositories, setActiveRepositories] = useState<string[]>([]);
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

      activeRepositories.forEach(async (id) => {
        const pr = await getPrs(id);
        if (pr.count > 0) {
          const prData: Prs = {
            title: pr.value[0].repository.name,
            data: pr.value,
          };
          prDatas.push(prData);
        }
      });

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

  // const handleToken = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setToken(e.target.value);
  // };

  return (
    <div>
      {/* <TokenInput
        placeholder="Coloque o token (AadAuthentication)"
        type="text"
        value={token}
        onChange={handleToken}
      /> */}
      {hasError && (
        <div>
          <p>Erro ao carregar os repositórios</p>
          <p>Por favor entrar na pagina da Azure para gerar Token</p>
        </div>
      )}
      <Collapse title="Repositorios" isOpen={isOpen} toggleOpen={setIsOpen}>
        <SearchInput
          placeholder="Buscar Repo"
          onChange={handleSearch}
          value={search}
        />
        {repositories
          ?.filter((repository) => repository.name.includes(search))
          .sort((a) => (activeRepositories.includes(a.id) ? -1 : 1))
          .map((repository) => (
            <Repository
              key={repository.id}
              name={repository.name}
              id={repository.id}
              onCheckbox={handleAddOrRemoveActive}
              isChecked={activeRepositories.includes(repository.id)}
            />
          ))}
      </Collapse>

      <div>
        {prs.map((pr) => {
          return (
            <div key={pr.title}>
              <h1>{pr.title}</h1>
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
          );
        })}
      </div>
    </div>
  );
}

export default App;
