import PlayerPosition from '../types/playerPosition';

export function processName(name: string): string {
  switch (name) {
    case 'Dele Alli':
      return 'Dele';
    default: return name;
  }
}

export function processPosition(position: PlayerPosition): string {
  switch (position) {
    case 'attacking mid':
      return 'Attacking Mid/Winger';
    case 'center back':
      return 'Center Back';
    case 'forward':
      return 'Forward';
    case 'fullback':
      return 'Fullback';
    case 'midfield':
      return 'Midfielder';
    default: return 'Unknown';
  }
}
