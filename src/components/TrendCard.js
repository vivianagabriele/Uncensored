// src/components/TrendCard.js
// Full story card — collapsed shows headline + suppression bar + reactions.
// Expanded shows AI take, tags, and comment thread.

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, TextInput, ScrollView,
} from 'react-native';
import { colors, radius, font } from '../../theme';
import { fetchStoryDetail } from '../api/perplexity';
import { getIdentity } from '../utils/identity';

function parseBold(text) {
  if (!text) return null;
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1
      ? <Text key={i} style={styles.bold}>{p}</Text>
      : <Text key={i}>{p}</Text>
  );
}

function SuppressionBar({ score }) {
  const pct   = Math.min(score ?? 0, 100);
  const color = pct >= 70 ? colors.red : pct >= 40 ? '#EF9F27' : colors.green;
  return (
    <View style={styles.sigRow}>
      <Text style={styles.sigLabel}>Suppression</Text>
      <View style={styles.sigTrack}>
        <View style={[styles.sigFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.sigPct, { color }]}>{pct}%</Text>
    </View>
  );
}

function Avatar({ initials, avatar, size = 28 }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, backgroundColor: avatar?.bg ?? '#eee' }]}>
      <Text style={[styles.avatarText, { color: avatar?.text ?? '#333', fontSize: size * 0.38 }]}>
        {initials}
      </Text>
    </View>
  );
}

const SEED_COMMENTS = [
  { name: 'OpenEye_34', initials: 'OE', avatar: colors.avatars[0], text: 'wild that this is still happening and nobody\'s talking about it', time: '2h ago' },
  { name: 'BoldPress_77', initials: 'BP', avatar: colors.avatars[3], text: 'been following this for weeks — it\'s way bigger than the headlines say', time: '4h ago' },
];

export default function TrendCard({ trend, rank }) {
  const [open, setOpen]         = useState(false);
  const [detail, setDetail]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [detailErr, setDetailErr] = useState(null);
  const [upvoted, setUpvoted]   = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [upvotes, setUpvotes]   = useState(Math.floor(Math.random() * 800 + 100));
  const [confirms, setConfirms] = useState(Math.floor(Math.random() * 150 + 20));
  const [comments, setComments] = useState(SEED_COMMENTS);
  const [draft, setDraft]       = useState('');

  const identity = getIdentity();
  const cat      = colors.cat[trend.category] ?? { bg: '#F5F4F0', text: '#666', border: '#DDD' };

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next && !detail) {
      setLoading(true);
      setDetailErr(null);
      try {
        const d = await fetchStoryDetail(trend.title);
        setDetail(d);
      } catch (e) {
        setDetailErr('couldn\'t load the AI take — check your API key 🙈');
      } finally {
        setLoading(false);
      }
    }
  }

  function postComment() {
    if (!draft.trim()) return;
    setComments(prev => [{
      name: identity.name,
      initials: identity.initials,
      avatar: identity.avatar,
      text: draft.trim(),
      time: 'just now',
    }, ...prev]);
    setDraft('');
  }

  const blockedIn = detail?.blockedIn ?? trend.blockedIn ?? [];
  const openIn    = detail?.openIn    ?? trend.openIn    ?? [];

  return (
    <TouchableOpacity
      style={[styles.card, open && styles.cardOpen]}
      onPress={handleOpen}
      activeOpacity={0.88}
    >
      {/* ── Collapsed top ── */}
      <View style={styles.top}>
        <View style={styles.metaRow}>
          <Text style={styles.rank}>#{rank}</Text>
          <View style={[styles.cat, { backgroundColor: cat.bg, borderColor: cat.border }]}>
            <Text style={[styles.catText, { color: cat.text }]}>{trend.category}</Text>
          </View>
          {trend.isLive && (
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>{trend.liveLabel ?? 'Live'}</Text>
            </View>
          )}
          <Text style={styles.chev}>{open ? '▲' : '▼'}</Text>
        </View>

        <Text style={styles.title}>{trend.title}</Text>
        <Text style={styles.summary}>{trend.summary}</Text>

        <View style={styles.bottomRow}>
          <SuppressionBar score={trend.suppressionScore} />
          <View style={styles.rxns}>
            <TouchableOpacity
              style={[styles.rxn, upvoted && styles.rxnOn]}
              onPress={(e) => { e.stopPropagation?.(); setUpvoted(true); setUpvotes(v => v + 1); }}
            >
              <Text style={styles.rxnText}>↑ {upvotes}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rxn, confirmed && styles.rxnOn]}
              onPress={(e) => { e.stopPropagation?.(); setConfirmed(true); setConfirms(v => v + 1); }}
            >
              <Text style={styles.rxnText}>✓ {confirms}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Expanded ── */}
      {open && (
        <View style={styles.expanded}>
          {/* AI take */}
          <View style={styles.aiBox}>
            <View style={styles.aiHeader}>
              <View style={styles.aiDot} />
              <Text style={styles.aiLabel}>AI TAKE</Text>
            </View>
            {loading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={colors.green} />
                <Text style={styles.loadingText}>thinking…</Text>
              </View>
            )}
            {detailErr && <Text style={styles.errText}>{detailErr}</Text>}
            {detail && <Text style={styles.aiText}>{parseBold(detail.aiTake)}</Text>}
            {!detail && !loading && !detailErr && (
              <Text style={styles.aiText}>tap to load AI analysis…</Text>
            )}
          </View>

          {/* Tags */}
          {(blockedIn.length > 0 || openIn.length > 0) && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
              {blockedIn.map((c, i) => (
                <View key={`b${i}`} style={styles.tagRed}>
                  <Text style={styles.tagRedText}>🚫 {c}</Text>
                </View>
              ))}
              {openIn.map((c, i) => (
                <View key={`o${i}`} style={styles.tagGreen}>
                  <Text style={styles.tagGreenText}>✅ {c}</Text>
                </View>
              ))}
              {detail?.whySuppressed && (
                <View style={styles.tagNeutral}>
                  <Text style={styles.tagNeutralText}>💡 {detail.whySuppressed}</Text>
                </View>
              )}
            </ScrollView>
          )}

          {/* Comments */}
          <Text style={styles.cmtHeader}>{comments.length} comment{comments.length !== 1 ? 's' : ''}</Text>
          {comments.map((c, i) => (
            <View key={i} style={styles.comment}>
              <Avatar initials={c.initials} avatar={c.avatar} />
              <View style={styles.cmtRight}>
                <View style={styles.cmtMeta}>
                  <Text style={styles.cmtName}>{c.name}</Text>
                  <Text style={styles.cmtTime}>{c.time}</Text>
                </View>
                <Text style={styles.cmtText}>{c.text}</Text>
              </View>
            </View>
          ))}

          {/* Compose */}
          <View style={styles.compose}>
            <Avatar initials={identity.initials} avatar={identity.avatar} />
            <View style={styles.composeRight}>
              <TextInput
                style={styles.composeInput}
                placeholder="say something…"
                placeholderTextColor={colors.textTertiary}
                value={draft}
                onChangeText={setDraft}
                multiline
              />
              <View style={styles.composeFtr}>
                <Text style={styles.anonLabel}>{identity.name}</Text>
                <TouchableOpacity
                  style={[styles.postBtn, draft.trim() && styles.postBtnReady]}
                  onPress={postComment}
                >
                  <Text style={styles.postBtnText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 8,
    overflow: 'hidden',
  },
  cardOpen: { borderColor: colors.dark },
  top: { padding: 14 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  rank: { fontSize: 11, fontWeight: font.bold, color: colors.textTertiary, minWidth: 20 },
  cat: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.sm, borderWidth: 1 },
  catText: { fontSize: 10, fontWeight: font.bold, letterSpacing: 0.3 },
  livePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.red, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.sm,
  },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,200,200,0.9)' },
  liveText: { fontSize: 10, fontWeight: font.bold, color: '#fff' },
  chev: { marginLeft: 'auto', fontSize: 11, color: colors.textTertiary },
  title: { fontSize: 15, fontWeight: font.bold, color: colors.text, lineHeight: 21, marginBottom: 4 },
  summary: { fontSize: 12, color: colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sigRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  sigLabel: { fontSize: 10, fontWeight: font.semibold, color: colors.textTertiary },
  sigTrack: { flex: 1, height: 4, backgroundColor: '#F0EEE8', borderRadius: 2, overflow: 'hidden' },
  sigFill: { height: '100%', borderRadius: 2 },
  sigPct: { fontSize: 10, fontWeight: font.bold, minWidth: 30, textAlign: 'right' },
  rxns: { flexDirection: 'row', gap: 5 },
  rxn: {
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.sm,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface,
  },
  rxnOn: { backgroundColor: colors.dark, borderColor: colors.dark },
  rxnText: { fontSize: 11, fontWeight: font.bold, color: colors.textSecondary },

  expanded: { borderTopWidth: 1.5, borderTopColor: colors.border, backgroundColor: '#FAFAF8', padding: 14 },
  aiBox: { backgroundColor: colors.dark, borderRadius: radius.md, padding: 13, marginBottom: 10 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  aiDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green },
  aiLabel: { fontSize: 10, fontWeight: font.bold, letterSpacing: 1.5, color: colors.green, textTransform: 'uppercase' },
  aiText: { fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 20 },
  bold: { fontWeight: font.bold, color: colors.yellow },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' },
  errText: { fontSize: 13, color: '#FF6B6B' },

  tags: { gap: 5, paddingBottom: 10 },
  tagRed: { backgroundColor: colors.redBg, borderWidth: 1, borderColor: colors.redBorder, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  tagRedText: { fontSize: 11, fontWeight: font.semibold, color: colors.redText },
  tagGreen: { backgroundColor: colors.greenBg, borderWidth: 1, borderColor: colors.greenBorder, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  tagGreenText: { fontSize: 11, fontWeight: font.semibold, color: colors.greenText },
  tagNeutral: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3, maxWidth: 260 },
  tagNeutralText: { fontSize: 11, color: colors.textSecondary },

  cmtHeader: { fontSize: 11, fontWeight: font.bold, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  comment: { flexDirection: 'row', gap: 9, marginBottom: 10 },
  avatar: { borderRadius: 50, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  avatarText: { fontWeight: font.bold },
  cmtRight: { flex: 1 },
  cmtMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  cmtName: { fontSize: 12, fontWeight: font.bold, color: colors.text },
  cmtTime: { fontSize: 11, color: colors.textTertiary },
  cmtText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  compose: { flexDirection: 'row', gap: 8, marginTop: 10, paddingTop: 12, borderTopWidth: 1.5, borderTopColor: colors.border, alignItems: 'flex-start' },
  composeRight: { flex: 1 },
  composeInput: {
    borderBottomWidth: 1.5, borderBottomColor: colors.border,
    paddingVertical: 4, paddingBottom: 6,
    fontSize: 13, color: colors.text, fontFamily: 'System',
  },
  composeFtr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  anonLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: font.medium },
  postBtn: { backgroundColor: colors.dark, paddingHorizontal: 16, paddingVertical: 6, borderRadius: radius.full, opacity: 0.25 },
  postBtnReady: { opacity: 1 },
  postBtnText: { fontSize: 12, fontWeight: font.bold, color: '#fff' },
});
