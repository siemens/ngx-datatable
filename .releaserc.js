import writerOpts from './tools/semantic-release/writer-opts.js';
import { commitTypes, releaseRules } from './tools/semantic-release/config.js';

export default {
  tagFormat: '${version}',
  branches: [
    {
      name: 'maintenance/+([0-9])?(.{+([0-9]),x}).x',
      channel: "${name.replace(/^maintenance\\\\//g, '')}"
    },
    'main',
    {
      name: 'next',
      channel: 'next',
      prerelease: true
    }
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules,
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE']
        },
        presetConfig: {
          types: commitTypes
        }
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'NOTE', 'DEPRECATED']
        },
        writerOpts
      }
    ],
    '@semantic-release/changelog',
    // Packages to be pushed
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'dist/ngx-datatable'
      }
    ],
    // Only update remaining package.json that are not directly published
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'projects/ngx-datatable',
        npmPublish: false
      }
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json', 'projects/*/package.json'],
        message: 'chore(release): ${nextRelease.version}'
      }
    ],
    '@semantic-release/github'
  ]
};
