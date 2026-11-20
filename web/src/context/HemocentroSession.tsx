import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import type { SessaoHemocentro } from '@/types/hemocentro';

type SessionContext = {
  sessao: SessaoHemocentro | null;
  definirSessao: (sessao: SessaoHemocentro | null) => void;
};

const HemocentroSessionContext = createContext<SessionContext | null>(null);

export function HemocentroSessionProvider({ children }: PropsWithChildren) {
  const [sessao, definirSessao] = useState<SessaoHemocentro | null>(null);
  return (
    <HemocentroSessionContext.Provider value={{ sessao, definirSessao }}>
      {children}
    </HemocentroSessionContext.Provider>
  );
}

export function useHemocentroSession() {
  const contexto = useContext(HemocentroSessionContext);
  if (!contexto) throw new Error('Sessão do hemocentro indisponível');
  return contexto;
}
