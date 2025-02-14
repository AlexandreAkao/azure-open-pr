import { RepositoryContainer } from "./styled";

type RepositoryProps = {
  name: string;
  id: string;
  onCheckbox: (id: string) => void;
  isChecked: boolean;
};

function Repository({ name, id, onCheckbox, isChecked }: RepositoryProps) {
  const handleCheckbox = () => {
    onCheckbox(id);
  };

  return (
    <RepositoryContainer>
      <input
        type="checkbox"
        name={name}
        id={name}
        onChange={handleCheckbox}
        checked={isChecked}
      />
      <label htmlFor={name}>{name}</label>
    </RepositoryContainer>
  );
}

export default Repository;
