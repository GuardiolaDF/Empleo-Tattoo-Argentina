import fs from 'fs';

let adminPath = 'src/app/admin/convenciones/page.tsx';
let adminText = fs.readFileSync(adminPath, 'utf8');

adminText = adminText.replace(
  `className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"`,
  `className="inline-flex items-center justify-center p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"`
);
adminText = adminText.replace(
  `className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"`,
  `className="inline-flex items-center justify-center p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"`
);
adminText = adminText.replace(
  `className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"`,
  `className="inline-flex items-center justify-center p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"`
);

adminText = adminText.replace(
  `className="px-6 py-4 text-right space-x-2"`,
  `className="px-6 py-4 flex justify-end gap-2"`
);

adminText = adminText.replace(
  `className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"`,
  `className="inline-flex items-center justify-center p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"`
);
adminText = adminText.replace(
  `className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"`,
  `className="inline-flex items-center justify-center p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"`
);

fs.writeFileSync(adminPath, adminText, 'utf8');

console.log('Safe replace done');
