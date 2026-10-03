import tournamentJson from '@/data/tournament.json';
import teamsJson from '@/data/teams.json';
import groupsJson from '@/data/groups.json';
import matchesJson from '@/data/matches.json';
import playersJson from '@/data/players.json';
import photosJson from '@/data/photos.json';
import awardsJson from '@/data/awards.json';
import type { Category, CategoryId, Match, Photo, Player, Row, Team } from '@/types/tournament';
export const tournament = tournamentJson;
export const categories = tournamentJson.categories as Category[];
export const teams = teamsJson as Team[];
export const groups = groupsJson as Record<CategoryId, Record<string, (string | null)[]>>;
export const matches = matchesJson as Match[];
export const players = playersJson as Player[];
export const photos = photosJson as Photo[];
export const awards = awardsJson;
export const team = (id?: string | null) => teams.find(t => t.id === id);
export const category = (id: CategoryId) => categories.find(c => c.id === id);
export const isPlayed = (m: Match) => m.result !== null && Number.isFinite(m.result.home) && Number.isFinite(m.result.away);
export const winner = (m: Match): string | undefined => {
  if (!isPlayed(m)) return;
  const score = m.result; if (!score) return;
  const h = score.home !== score.away ? score.home : m.penalties?.home;
  const a = score.home !== score.away ? score.away : m.penalties?.away;
  if (h === undefined || a === undefined || h === a) return;
  return resolve(m.categoryId, h > a ? m.home : m.away).id;
};
export const loser = (m: Match): string | undefined => {
  const winning = winner(m); if (!winning) return;
  const home = resolve(m.categoryId,m.home).id; const away = resolve(m.categoryId,m.away).id;
  return winning === home ? away : home;
};
function row(teamId: string): Row { return {teamId,played:0,wins:0,draws:0,losses:0,gf:0,ga:0,difference:0,points:0,yellows:0,reds:0,sanctions:0}; }
export function standings(cat: CategoryId, group?: string, throughDate?: string): Row[] {
  const ids = group ? groups[cat][group]?.filter((id): id is string => Boolean(id)) ?? [] : teams.filter(t=>t.categoryId===cat).map(t=>t.id);
  const rows = new Map(ids.map(id=>[id,row(id)]));
  for (const m of matches.filter(m=>m.categoryId===cat && m.phase==='Grupos' && (!throughDate || m.date<=throughDate))) {
    const h = resolve(cat,m.home).id, a = resolve(cat,m.away).id;
    for(const d of m.discipline ?? []) { const r=rows.get(d.teamId); if(r){r.yellows+=d.yellows;r.reds+=d.reds;r.sanctions+=d.sanctions;} }
    if (!isPlayed(m) || !h || !a || (!rows.has(h) && !rows.has(a))) continue;
    const hr=rows.get(h), ar=rows.get(a), score=m.result; if(!score) continue;
    if(hr){hr.played++;hr.gf+=score.home;hr.ga+=score.away;if(score.home>score.away){hr.wins++;hr.points+=3}else if(score.home<score.away){hr.losses++}else{hr.draws++;hr.points++}}
    if(ar){ar.played++;ar.gf+=score.away;ar.ga+=score.home;if(score.away>score.home){ar.wins++;ar.points+=3}else if(score.away<score.home){ar.losses++}else{ar.draws++;ar.points++}}
  }
  const list=[...rows.values()].map(r=>({...r,difference:r.gf-r.ga}));
  list.sort((a,b)=>{
    if(b.points!==a.points)return b.points-a.points;
    // Head-to-head applies only where a direct completed fixture exists.
    const direct=matches.filter(m=>m.categoryId===cat && m.phase==='Grupos' && (!throughDate || m.date<=throughDate) && isPlayed(m) && [resolve(cat,m.home).id,resolve(cat,m.away).id].sort().join('|')===[a.teamId,b.teamId].sort().join('|'));
    if(direct.length===1&&direct[0]){const w=winner(direct[0]);if(w===a.teamId)return -1;if(w===b.teamId)return 1;}
    const fair=(a.yellows+3*a.reds+3*a.sanctions)-(b.yellows+3*b.reds+3*b.sanctions);if(fair)return fair;
    return b.difference-a.difference || b.gf-a.gf || a.ga-b.ga || 0;
  });
  return list;
}
export function bestLosers(): string[] {
  const eliminations=matches.filter(m=>m.categoryId==='f8'&&m.phase==='Eliminatoria');
  if(eliminations.some(m=>!loser(m)))return [];
  return eliminations.map(m=>({id:loser(m) ?? '', m, r:standings('f8').find(r=>r.teamId===loser(m))})).sort((a,b)=>{
    const ar=a.r,br=b.r;if(!ar||!br)return 0;
    return (ar.yellows+3*ar.reds+3*ar.sanctions)-(br.yellows+3*br.reds+3*br.sanctions)||br.difference-ar.difference||br.gf-ar.gf||ar.ga-br.ga;
  }).slice(0,3).map(x=>x.id);
}
export function resolve(cat: CategoryId, ref: string): {id: string | undefined; label: string} {
  const direct=team(ref);if(direct)return {id:direct.id,label:direct.name};
  if(ref.startsWith('slot:')) {const s=ref.slice(5);const id=groups[cat][s.charAt(0)]?.[Number(s.slice(1))-1];return {id:id??undefined,label:team(id)?.name??s};}
  // Group fixtures retain the short slot notation from the PDF.
  if(/^[A-D][1-4]$/.test(ref)){const id=groups[cat][ref.charAt(0)]?.[Number(ref.charAt(1))-1];return {id:id??undefined,label:team(id)?.name??ref};}
  if(ref.startsWith('position:')){const [,g,n]=ref.split(':'); if(!g || !n)return {id:undefined,label:'Por definir'};const entries=standings(cat,g);const complete=matches.filter(m=>m.categoryId===cat&&m.phase==='Grupos'&&(m.home.startsWith(g)||m.away.startsWith(g)));const id=complete.every(isPlayed)&&entries.length>0?entries[Number(n)-1]?.teamId:undefined;return {id,label:team(id)?.name??`${n}º Grupo ${g}`};}
   if(ref.startsWith('rank:')){const n=Number(ref.split(':')[1]);const groupGames=matches.filter(m=>m.categoryId===cat&&m.phase==='Grupos');const id=groupGames.length>0&&groupGames.every(isPlayed)&&groupGames.every(m=>resolve(cat,m.home).id&&resolve(cat,m.away).id)?standings(cat)[n-1]?.teamId:undefined;return {id,label:team(id)?.name??`${n}º tabla general`};}
  if(ref.startsWith('bestLoser:')){const n=Number(ref.split(':')[1]);const id=bestLosers()[n-1];return {id,label:team(id)?.name??`${n}º mejor perdedor`};}
  const [outcome,id]=ref.split(':');const match=matches.find(m=>m.id===id);if(match && id){const resolved=outcome==='loser'?loser(match):winner(match);return {id:resolved,label:team(resolved)?.name??`${outcome==='loser'?'Perdedor':'Ganador'} ${id.split('-').slice(-2).join(' ')}`};}
  return {id:undefined,label:'Por definir'};
}
export function scorers(cat: CategoryId) {const totals=new Map<string,number>();for(const m of matches.filter(m=>m.categoryId===cat&&isPlayed(m)))for(const g of m.goals??[])totals.set(g.playerId,(totals.get(g.playerId)??0)+g.count);return [...totals].sort((a,b)=>b[1]-a[1]).map(([id,goals])=>({player:players.find(p=>p.id===id),goals})).filter(x=>x.player);}
export function cleanSheets(cat: CategoryId){const rows=standings(cat).filter(r=>r.played>0);const min=Math.min(...rows.map(r=>r.ga));return rows.filter(r=>r.ga===min);}
