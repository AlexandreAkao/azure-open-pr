import { ReactNode } from "react";
import { CollapseContainer } from "./styleds";

type CollapseProps = {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  toggleOpen: (isOpen: boolean) => void;
};

function Collapse({ children, title, isOpen, toggleOpen }: CollapseProps) {
  const handleToggleOpen = () => {
    toggleOpen(!isOpen);
  };

  return (
    <CollapseContainer>
      <h2 onClick={handleToggleOpen}>{title}</h2>
      {isOpen && children}
    </CollapseContainer>
  );
}

export default Collapse;
