// src/utils/identity.js
// Generates and persists a playful anonymous identity for the session.
// No accounts, no tracking — just a fun throwaway name per install.

import { colors } from '../theme';

const ADJECTIVES = [
  'Free','Open','Bold','Clear','True','Sharp','Keen','Brave','Wise','Calm',
  'Loud','Quick','Dark','Quiet','Wild','Real','Raw','Slick','Cold','Deep',
];
const NOUNS = [
  'Press','Voice','Pen','Eye','Watch','Word','Note','Lens','Mind','Read',
  'Post','Feed','View','Take','Drop','Tip','Byte','Wire','Pulse','Signal',
];

let _identity = null;

export function getIdentity() {
  if (_identity) return _identity;

  const adj  = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num  = Math.floor(Math.random() * 90 + 10);
  const name = `${adj}${noun}_${num}`;
  const initials = (adj[0] + noun[0]).toUpperCase();
  const avatar = colors.avatars[Math.floor(Math.random() * colors.avatars.length)];

  _identity = { name, initials, avatar };
  return _identity;
}
