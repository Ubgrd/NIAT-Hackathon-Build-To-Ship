const fs = require('fs');

const files = [
  'frontend/src/components/ArchitectView.jsx',
  'frontend/src/components/BrainView.jsx'
];

const replacements = [
  // Order matters: do hover variants first
  { regex: /hover:text-zinc-950(?! dark:)/g, replace: 'hover:text-zinc-950 dark:hover:text-white' },
  { regex: /hover:border-zinc-400(?! dark:)/g, replace: 'hover:border-zinc-400 dark:hover:border-zinc-600' },
  // General text
  { regex: /(?<!hover:)text-zinc-950(?! dark:)/g, replace: 'text-zinc-950 dark:text-white' },
  { regex: /(?<!hover:)text-zinc-800(?! dark:)/g, replace: 'text-zinc-800 dark:text-zinc-300' },
  { regex: /(?<!hover:)text-zinc-500(?! dark:)/g, replace: 'text-zinc-500 dark:text-zinc-400' },
  // Backgrounds
  { regex: /bg-zinc-100(?! dark:)/g, replace: 'bg-zinc-100 dark:bg-zinc-900' },
  { regex: /bg-zinc-50(?! dark:)/g, replace: 'bg-zinc-50 dark:bg-zinc-800' },
  { regex: /bg-white(?! dark:)/g, replace: 'bg-white dark:bg-zinc-800' },
  // Borders
  { regex: /(?<!hover:)border-zinc-200(?! dark:)/g, replace: 'border-zinc-200 dark:border-zinc-700' },
  { regex: /(?<!hover:)border-zinc-300(?! dark:)/g, replace: 'border-zinc-300 dark:border-zinc-700' },
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(({regex, replace}) => {
    content = content.replace(regex, replace);
  });
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
