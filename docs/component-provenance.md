# Component adaptation and access record

Live registry discovery was attempted through the web tool and the installed BLANK helper at `/home/qvost/.local/share/maynkudu-dotfiles/bin/blank`. Searches: `terminal tabs`, `comparison slider`, and `quiet text reveal`. All helper discovery requests failed with DNS resolution errors. Authenticated source attempts for `tabs-subtle`, `line-rise-text`, and `minimap-scrubber` also failed because the helper's credential file is absent. No live component source was downloaded or installed. The empty temporary fetch files are not vendored.

The following local adaptations are implemented, without claiming they are exact registry copies:

- Integration tabs: `components/research-controls.tsx`, informed by the installed animation skill's documented `tabs-subtle.tsx` mechanism: measure selected-tab geometry and move one persistent indicator. Uses existing GSAP rather than adding a spring dependency. Supports arrow keys, Home/End, roving focus, resize observation, interruption, and reduced motion.
- Budget scrubber: `components/research-controls.tsx`, an original native-range implementation. Continuous budget changes update the figure; presets select useful thresholds. No magnetic pointer displacement. Dimensions stay fixed while values update.
- Thesis reveals: `components/shell.tsx`, using the saved Otis Valen source's SplitText mechanism and installed R1 masked-line recipe. Font-ready initialization, automatic responsive re-splitting, scoped GSAP cleanup, and static reduced-motion output.

Local recipe references: `/home/qvost/.agents/skills/animation-fundamentals/references/construction-recipes.md` (R1) and `source-patterns.md` (measured tabs).

The site uses #e5e3dc paper, #141414 text, tone-on-tone borders and #121214 code panels. Decorative footer packets, arrows, animated dashed wires and neon glows were removed. Data-flow arrows remain where they explain the compiler.

Production compilation is checked with npm. Live font requests, browser input/scroll verification, and exact registry-source integration require a working network and browser-capable environment.
