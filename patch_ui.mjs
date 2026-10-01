import fs from 'fs';

// --- Fix Admin Alignment ---
let adminPath = 'src/app/admin/convenciones/page.tsx';
let adminText = fs.readFileSync(adminPath, 'utf8');

// Fix Desktop Actions
adminText = adminText.replace(
  'className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"\n                          title="Editar convención"',
  'className="inline-flex items-center justify-center p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"\n                          title="Editar convención"'
);

adminText = adminText.replace(
  'className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"\n                        title="Eliminar convención"',
  'className="inline-flex items-center justify-center p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"\n                        title="Eliminar convención"'
);

adminText = adminText.replace(
  'className="px-6 py-4 text-right space-x-2"',
  'className="px-6 py-4 flex justify-end gap-2"'
);

// Fix Mobile Actions
adminText = adminText.replace(
  'className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"\n                    >',
  'className="inline-flex items-center justify-center p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"\n                    >'
);

adminText = adminText.replace(
  'className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"\n                      title="Editar convención"',
  'className="inline-flex items-center justify-center p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"\n                      title="Editar convención"'
);

adminText = adminText.replace(
  'className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"\n                    >\n                      <Trash2',
  'className="inline-flex items-center justify-center p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"\n                    >\n                      <Trash2'
);

fs.writeFileSync(adminPath, adminText, 'utf8');

// --- Fix Card Border ---
let cardPath = 'src/components/ui/ConventionCard.tsx';
let cardText = fs.readFileSync(cardPath, 'utf8');

cardText = cardText.replace(
  'className="mt-auto pt-16 flex items-center justify-end gap-3 border-t-4 border-black"',
  'className="mt-auto pt-6 flex items-center justify-end gap-3 border-t-4 border-black"'
);

fs.writeFileSync(cardPath, cardText, 'utf8');

console.log('UI Patched!');
