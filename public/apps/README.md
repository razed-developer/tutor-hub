# Tutor Hub apps

This directory contains **built static output** for games, tools, and small sites that Tutor Hub serves directly.

Each app gets its own folder:

```text
public/apps/
  cat-burglar/
    index.html
    assets/
  another-game/
  another-tool/
```

A deployed app is available at:

```text
https://tutor-razed-hub.pages.dev/apps/<app-name>/
```

## Rules

- Put only the built/deployable files here, not the project's source repository.
- Keep every app self-contained inside its own folder.
- Build browser apps with their base/public path set to `/apps/<app-name>/` so asset URLs resolve correctly.
- The Tutor Hub catalogue remains independent. Add or edit the catalogue card in `/admin` and point its Destination URL to `/apps/<app-name>/`.
- Replacing an app means replacing the contents of its folder; it should not require changes to Tutor Hub itself.

## First app

C-A-T Burglar will live at:

```text
/apps/cat-burglar/
```
