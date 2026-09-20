import type { FaqItem } from '@/types/domain';

export const faqsMock: FaqItem[] = [
  {
    id: 'requirements',
    title: 'Requisitos para doar sangue',
    description: 'Tenha entre 16 e 69 anos, pese mais de 50kg e esteja em boas condições de saúde.',
    icon: 'clipboard',
  },
  {
    id: 'can-donate',
    title: 'Quem pode doar?',
    description: 'Pessoas saudáveis, descansadas e alimentadas podem doar após triagem clínica.',
    icon: 'person-add',
  },
  {
    id: 'cannot-donate',
    title: 'Quem não pode doar?',
    description: 'Quem teve febre recente, infecções ativas ou realizou procedimentos impeditivos deve aguardar.',
    icon: 'person-remove',
  },
  {
    id: 'before',
    title: 'Cuidados antes da doação',
    description: 'Durma bem, evite alimentos gordurosos e leve um documento oficial com foto.',
    icon: 'refresh',
  },
  {
    id: 'after',
    title: 'Cuidados depois da doação',
    description: 'Hidrate-se, evite esforço físico intenso e mantenha o curativo por algumas horas.',
    icon: 'time',
  },
  {
    id: 'benefits',
    title: 'Benefícios da doação',
    description: 'Cada doação pode ajudar mais de uma pessoa e ainda gera pontos no VITTA.',
    icon: 'heart',
  },
];
