import { useState, useEffect } from "react";
import { useConfig } from "../../context/useConfig";

const { VITE_ORGANIZATION, VITE_BOARD_NAME, VITE_PROJECT_NAME } = import.meta
  .env;

type SettingsProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const {
    projectName,
    organization,
    setProjectName,
    setOrganization,
    boardName,
    setBoardName,
  } = useConfig();

  const [localProjectName, setLocalProjectName] = useState(projectName ?? "");
  const [localOrg, setLocalOrg] = useState(organization ?? "");
  const [localBoardName, setLocalBoardName] = useState(boardName ?? "");

  useEffect(() => {
    setLocalProjectName(projectName ?? "");
    setLocalOrg(organization ?? "");
    setLocalBoardName(boardName ?? "");
  }, [isOpen, projectName, organization, boardName]);

  const handleSave = () => {
    setProjectName(localProjectName);
    setOrganization(localOrg);
    setBoardName(localBoardName);
    onClose();
  };

  const handleResetWms = () => {
    // set local state
    setLocalProjectName(VITE_PROJECT_NAME);
    setLocalOrg(VITE_ORGANIZATION ?? "");
    setLocalBoardName(VITE_BOARD_NAME ?? "");

    // persist to storage via context setters
    setProjectName(VITE_PROJECT_NAME);
    setOrganization(VITE_ORGANIZATION ?? "");
    setBoardName(VITE_BOARD_NAME ?? "");
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-backdrop">
      <div className="settings-modal">
        <h2 style={{ marginTop: 0 }}>Configurações</h2>

        <label className="form-label">
          Project Name
          <input
            className="form-input"
            value={localProjectName}
            onChange={(e) => setLocalProjectName(e.target.value)}
          />
        </label>

        <label className="form-label">
          Organization
          <input
            className="form-input"
            value={localOrg}
            onChange={(e) => setLocalOrg(e.target.value)}
          />
        </label>

        <label className="form-label">
          Board Name
          <input
            className="form-input"
            value={localBoardName}
            onChange={(e) => setLocalBoardName(e.target.value)}
          />
        </label>

        <div className="form-actions">
          <button onClick={onClose} className="btn btn-ghost">
            Cancelar
          </button>
          <button onClick={handleResetWms} className="btn btn-reset">
            Reset WMS
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
