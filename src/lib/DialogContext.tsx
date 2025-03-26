import { createContext, useState, useContext, ReactNode } from "react";

interface DialogContextType {
  isPlayerDialogOpen: boolean;
  setIsPlayerDialogOpen: (open: boolean) => void;
  isTeamDialogOpen: boolean;
  setIsTeamDialogOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isPlayerDialogOpen, setIsPlayerDialogOpen] = useState(false);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);

  return (
    <DialogContext.Provider
      value={{
        isPlayerDialogOpen,
        setIsPlayerDialogOpen,
        isTeamDialogOpen,
        setIsTeamDialogOpen,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function useDialogContext() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }
  return context;
}
