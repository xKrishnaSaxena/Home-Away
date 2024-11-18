import { createContext, useContext, useState, ReactNode, MouseEvent } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";


const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul<{ position: { x: number; y: number } | null }>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => (props.position ? props.position.x : 0)}px;
  top: ${(props) => (props.position ? props.position.y : 0)}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;


interface MenusContextType {
  openId: string;
  close: () => void;
  open: (id: string) => void;
  posi: { x: number; y: number } | null;
  setPosi: (position: { x: number; y: number } | null) => void;
}

const MenusContext = createContext<MenusContextType | undefined>(undefined);

interface MenusProps {
  children: ReactNode;
}

function Menus({ children }: MenusProps) {
  const [openId, setOpenId] = useState<string>("");
  const [posi, setPosi] = useState<{ x: number; y: number } | null>(null);
  const close = () => setOpenId("");
  const open = (id: string) => setOpenId(id);

  return (
    <MenusContext.Provider value={{ openId, close, open, posi, setPosi }}>
      {children}
    </MenusContext.Provider>
  );
}


interface ToggleProps {
  id: string;
}

function Toggle({ id }: ToggleProps) {
  const context = useContext(MenusContext);
  if (!context) throw new Error("Toggle must be used within Menus");

  const { openId, close, open, setPosi } = context;

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const rect = (e.target as HTMLButtonElement).closest("button")!.getBoundingClientRect();
    setPosi({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 10,
    });
    openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}


interface ListProps {
  id: string;
  children: ReactNode;
}

function List({ id, children }: ListProps) {
  const context = useContext(MenusContext);
  if (!context) throw new Error("List must be used within Menus");

  const { openId, posi } = context;

  if (openId !== id) return null;

  return createPortal(
    <StyledList position={posi}>{children}</StyledList>,
    document.body
  );
}


interface ButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?:boolean
}

function Button({ children, icon, onClick ,disabled}: ButtonProps) {
  const context = useContext(MenusContext);
  if (!context) throw new Error("Button must be used within Menus");

  const { close } = context;

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick} disabled={disabled}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}


Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
