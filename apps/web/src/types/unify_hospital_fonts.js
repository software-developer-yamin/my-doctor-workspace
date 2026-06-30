const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/app-primary/hospital-details-page/hospital-profile-tabs.tsx',
  'src/components/app-primary/hospital-details-page/hospital-info-tab.tsx'
];

const replacements = [
  // Formatting
  { find: /from"@/g, replace: 'from "@' },

  // Tabs - Align with Doctor Profile Tabs
  { find: /text-sm font-semibold text-muted-foreground/g, replace: 'text-[13px] font-medium text-muted-foreground' },
  { find: /text-\[10px\] font-semibold group-data-\[state=active\]:bg-primary\/20/g, replace: 'text-[10px] font-medium group-data-[state=active]:bg-primary/20' },
  { find: /after:h-1/g, replace: 'after:h-1.5' },

  // Info Tab - Pure white foreground in dark mode already handled by CSS, 
  // but let's fix labeling fonts to be consistent (11px font-medium)
  { find: /<h3 className="text-sm font-semibold text-foreground">About the Organization<\/h3>/g, replace: '<h3 className="text-[11px] font-medium text-muted-foreground">About the Organization</h3>' },
  { find: /<h4 className="mb-4 text-xs font-semibold text-foreground">Our Mission<\/h4>/g, replace: '<h4 className="mb-4 text-[11px] font-medium text-muted-foreground">Our Mission</h4>' },
  { find: /<h4 className="mb-4 text-xs font-semibold text-foreground">Our Vision<\/h4>/g, replace: '<h4 className="mb-4 text-[11px] font-medium text-muted-foreground">Our Vision</h4>' },
  { find: /<span className="text-xs font-semibold">Quality Standard<\/span>/g, replace: '<span className="text-[11px] font-medium text-muted-foreground">Quality Standard</span>' }
];

filesToFix.forEach(relPath => {
  const fullPath = path.join('/home/yamin/Documents/smartechedge/my_doctor_frontend', relPath);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  replacements.forEach(r => {
    content = content.replace(r.find, r.replace);
  });
  
  fs.writeFileSync(fullPath, content);
  console.log('Unified fonts in ' + relPath);
});
