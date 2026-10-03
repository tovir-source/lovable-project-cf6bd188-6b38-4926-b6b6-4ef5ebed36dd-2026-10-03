export type CategoryId = 'f9' | 'f8';
export type Category = { id: CategoryId; name: string; description: string; groups: { id: string; slots: string[] }[]; qualification: string };
export type Team = { id: string; categoryId: CategoryId; name: string; crest: string | null };
export type Match = { id: string; categoryId: CategoryId; date: string; time: string; phase: string; home: string; away: string; result: { home: number; away: number } | null; penalties: { home: number; away: number } | null; discipline: { teamId: string; yellows: number; reds: number; sanctions: number }[]; goals: { playerId: string; teamId: string; count: number }[] };
export type Player = { id: string; teamId: string; name: string };
export type Photo = { id: string; date: string; src: string; width: number; height: number; alt: string; categoryId?: CategoryId; matchId?: string; teamId?: string; event?: string };
export type Row = { teamId: string; played: number; wins: number; draws: number; losses: number; gf: number; ga: number; difference: number; points: number; yellows: number; reds: number; sanctions: number };
