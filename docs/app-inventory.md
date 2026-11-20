# Packaged application inventory

This file tracks the version of each independent application **deployed through Tutor Hub**. The repository currently contains built app directories, but historical source commits and deployed versions have not been verified. Do not infer a source version from a hashed JS bundle name.

| App folder | Source / maintainer | Pinned source commit or release | Last verified deployed | Notes |
| --- | --- | --- | --- | --- |
| `cat-burglar` | To verify | Unknown | Not verified | Existing packaged game |
| `creative` | To verify | Unknown | Not verified | Existing packaged tool |
| `multiplication` | To verify | Unknown | Not verified | Existing packaged app |
| `ridiculous` | To verify | Unknown | Not verified | Existing packaged app |
| `story-symphony` | To verify | Unknown | Not verified | Existing packaged app |
| STEM Figures collection | [teacher.dev upstream](https://github.com/teacherdotdev/stem-figures) | Not yet deployed | Not yet deployed | Planned; preserve Apache-2.0 notices and teacher.dev credit |

When updating a row, record the exact upstream tag/commit, build command, expected `/apps/<slug>/` base path, test result, and preview URL in a short note or linked PR. Keep separate source repositories independent of Tutor Hub.
