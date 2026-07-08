import type { NewsCardItem } from '../types/news'

// Placeholder data for the 0.4 shell. Replaced by real API data in 0.5.
export interface PlaceholderFeed {
    id: string
    name: string
    hasUnread: boolean
}

export const placeholderFeeds: PlaceholderFeed[] = [
    { id: 'tech', name: 'Tecnologia', hasUnread: false },
    { id: 'futebol', name: 'Futebol', hasUnread: true },
    { id: 'ciencia', name: 'Ciência', hasUnread: false },
    { id: 'economia', name: 'Economia', hasUnread: false },
]

export const placeholderNews: NewsCardItem[] = [
    {
        id: '1',
        title: 'Novo modelo de IA supera benchmarks de raciocínio em testes de múltiplas etapas',
        body: 'Pesquisadores apresentaram um sistema que melhora resultados em testes de lógica e matemática, com ganhos consistentes em tarefas longas e encadeadas de raciocínio.',
        minutesAgo: 12,
        createdAtLabel: '07 jul 2026, 14:32',
        sourceName: 'TechFeed',
        isRead: false,
    },
    {
        id: '2',
        title: 'Startup brasileira levanta rodada série B',
        body: 'O aporte será usado para expansão regional e contratação de times de engenharia e produto ao longo do próximo ano.',
        minutesAgo: 180,
        createdAtLabel: '07 jul 2026, 11:10',
        sourceName: 'Mercado Hoje',
        isRead: true,
    },
    {
        id: '3',
        title: 'Pesquisa avança em baterias de estado sólido',
        body: 'Novo eletrólito promete maior densidade de energia e carregamento mais rápido, ainda em fase de testes de durabilidade.',
        minutesAgo: 480,
        createdAtLabel: '07 jul 2026, 06:40',
        sourceName: 'Ciência Diária',
        isRead: true,
    },
]
