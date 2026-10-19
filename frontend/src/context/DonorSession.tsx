import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import type { DonorProfile, DonorSession } from '@/types/donor';

type SessionContext = {
  sessao: DonorSession | null;
  definirSessao: (sessao: DonorSession | null) => void;
};

const DonorSessionContext = createContext<SessionContext | null>(null);

export function DonorSessionProvider({ children }: PropsWithChildren) {
  const [sessao, definirSessao] = useState<DonorSession | null>(null);
  return <DonorSessionContext.Provider value={{ sessao, definirSessao }}>{children}</DonorSessionContext.Provider>;
}

export function useDonorSession() {
  const contexto = useContext(DonorSessionContext);
  if (!contexto) throw new Error('Sessão do doador indisponível');
  return contexto;
}

export function iniciaisDoador(doador?: DonorProfile | null) {
  return doador?.nome.split(' ').filter(Boolean).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase() ?? '';
}
