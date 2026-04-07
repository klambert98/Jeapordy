# Jeapordy Web Board

A browser-based Jeapordy-style game board with:

- 5 categories x 5 clue values
- Clickable clue modal flow
- Two Daily Double spots with custom sound + animation
- Disabled clues after they are marked answered
- Admin panel to edit categories/questions/answers
- Reset board progress or restore default board

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown in terminal.

## Admin features

- Click **Open Admin** to edit any category/clue content.
- Click **Save Changes** to persist updates to localStorage.
- Click **Re-roll Daily Doubles** to randomly choose two Daily Doubles.
- Click **Reset Board Progress** to make all clues selectable again.
- Click **Restore Default Categories/Questions** to wipe custom content and reset to defaults.

## Notes

- Sounds are synthesized in-browser using the Web Audio API (no external audio files required).
- Game state persists in localStorage under `jeapordy-board-v1`.
