import { noteTitleMap, noteTitles, commitTypes } from './config.js';

const COMMIT_HASH_LENGTH = 7;

const commitGroups = commitTypes.map(t => t.section).filter(Boolean);
const hiddenTypeCommitNotes = [];

const hiddenTypes = new Set();
const visibleTypes = {};

commitTypes.forEach(({ type, section, hidden }) => {
  if (hidden) {
    hiddenTypes.add(type);
  } else if (section) {
    visibleTypes[type] = section;
  }
});

function transform(commit) {
  const hasNotes = Array.isArray(commit.notes) && commit.notes.length > 0;

  const normalizedNotes = hasNotes
    ? commit.notes.map(note => ({
        title: noteTitleMap[note.title],
        text: note.text.replace(/\n/g, '\n  ')
      }))
    : [];

  if (hiddenTypes.has(commit.type)) {
    if (normalizedNotes.length > 0) {
      normalizedNotes.map(note => ({
        text: `${commit.scope ? `**${commit.scope}:** ` : ''}${note.text}`
      }));
      // Add to the hiddenTypeCommitNotes if there are notes and the type is hidden
      // The notes will be added to the context in finalizeContext
      hiddenTypeCommitNotes.push(...normalizedNotes);
    }
    return;
  }

  const shortHash =
    typeof commit.hash === 'string'
      ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
      : commit.shortHash;

  return {
    ...commit,
    notes: normalizedNotes,
    type: visibleTypes[commit.type],
    shortHash
  };
}

/**
 *  Append collected notes that have a hidden type to the matching noteGroups
 */
function finalizeContext(context) {
  for (const note of hiddenTypeCommitNotes) {
    let group = context.noteGroups.find(g => g.title === note.title);
    if (!group) {
      group = { title: note.title, notes: [] };
      const insertIndex = noteTitles.findIndex(t => t === note.title);
      context.noteGroups.splice(insertIndex, 0, group);
    }
    group.notes.push(note);
  }
  return context;
}

export default {
  transform,
  finalizeContext,
  commitGroupsSort(a, b) {
    return commitGroups.indexOf(a.title) - commitGroups.indexOf(b.title);
  },
  commitsSort: ['scope', 'subject'],
  noteGroupsSort(a, b) {
    return noteTitles.indexOf(a.title) - noteTitles.indexOf(b.title);
  },
  notesSort(a, b) {
    return a.title.localeCompare(b.title);
  }
};
