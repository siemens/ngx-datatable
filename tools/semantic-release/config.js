// To reorder the types, simply change the order of the items
export const commitTypes = [
  { type: 'feat', section: 'Features' },
  { type: 'fix', section: 'Bug Fixes' },
  { type: 'perf', section: 'Performance Improvements' },
  { type: 'revert', section: 'Reverts' },
  { type: 'fixup', hidden: true },
  { type: 'docs', hidden: true },
  { type: 'style', hidden: true },
  { type: 'refactor', hidden: true },
  { type: 'test', hidden: true },
  { type: 'build', hidden: true },
  { type: 'ci', hidden: true },
  { type: 'chore', hidden: true }
];

export const releaseRules = [
  { breaking: true, release: 'major' },
  { revert: true, release: 'patch' },
  { type: 'feat', release: 'minor' },
  { type: 'fix', release: 'patch' },
  { type: 'perf', release: 'patch' }
];

// To reorder the notes, simply change the order of the items
export const noteTitleMap = {
  'NOTE': 'NOTES',
  'BREAKING CHANGE': 'BREAKING CHANGES',
  'DEPRECATED': 'DEPRECATIONS'
};

export const noteTitles = Object.values(noteTitleMap);
