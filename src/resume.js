16:55:46.298 Running build in Washington, D.C., USA (East) – iad1
16:55:46.299 Build machine configuration: 2 cores, 8 GB
16:55:46.456 Cloning github.com/Guruprasad-Chougule/New-Portfolio (Branch: main, Commit: c94dddf)
16:55:47.219 Cloning completed: 763.000ms
16:55:47.351 Restored build cache from previous deployment (2PX2jSkX9YYUabbn8UKmzb21ieFU)
16:55:47.607 Running "vercel build"
16:55:47.632 Vercel CLI 54.4.1
16:55:48.487 Installing dependencies...
16:55:51.875 
16:55:51.875 up to date in 3s
16:55:51.876 
16:55:51.876 30 packages are looking for funding
16:55:51.876   run `npm fund` for details
16:55:51.919 Running "npm run build"
16:55:52.053 
16:55:52.054 > guru-portfolio@1.0.0 build
16:55:52.054 > vite build
16:55:52.055 
16:55:52.356 vite v5.4.21 building for production...
16:55:52.437 transforming...
16:55:54.915 ✓ 357 modules transformed.
16:55:54.918 x Build failed in 2.53s
16:55:54.920 error during build:
16:55:54.920 src/games/index.jsx (17:9): "RockPaperScissorsGame" is not exported by "src/games/RockPaperScissorsGame.jsx", imported by "src/games/index.jsx".
16:55:54.920 file: /vercel/path0/src/games/index.jsx:17:9
16:55:54.921 
16:55:54.921 15: import { MemoryGame } from "./MemoryGame.jsx";
16:55:54.921 16: import { WhackABugGame } from "./WhackABugGame.jsx";
16:55:54.922 17: import { RockPaperScissorsGame } from "./RockPaperScissorsGame.jsx";
16:55:54.922              ^
16:55:54.922 18: import { DiceDuelGame } from "./DiceDuelGame.jsx";
16:55:54.922 19: import { HigherLowerGame } from "./HigherLowerGame.jsx";
16:55:54.922 
16:55:54.923     at getRollupError (file:///vercel/path0/node_modules/rollup/dist/es/shared/parseAst.js:406:41)
16:55:54.923     at error (file:///vercel/path0/node_modules/rollup/dist/es/shared/parseAst.js:402:42)
16:55:54.923     at Module.error (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:17390:16)
16:55:54.923     at Module.traceVariable (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:17823:29)
16:55:54.924     at ModuleScope.findVariable (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:15413:39)
16:55:54.924     at FunctionScope.findVariable (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:5682:38)
16:55:54.924     at FunctionBodyScope.findVariable (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:5682:38)
16:55:54.925     at Identifier.bind (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:5449:40)
16:55:54.925     at CallExpression.bind (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:2827:28)
16:55:54.925     at CallExpression.bind (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:12522:15)
16:55:54.955 Error: Command "npm run build" exited with 1
