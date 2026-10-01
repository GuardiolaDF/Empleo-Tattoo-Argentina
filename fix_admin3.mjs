import fs from 'fs';
let c = fs.readFileSync('src/app/admin/convenciones/page.tsx', 'utf8');

c = c.replace(
  '<ExternalLink className="w-4 h-4" />\r\n                    </Link>\r\n                    <button',
  '<ExternalLink className="w-4 h-4" />\r\n                    </Link>\r\n                    <Link href={`/convenciones/${conv.slug}/editar`} className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"><Edit className="w-4 h-4" /></Link>\r\n                    <button'
);

c = c.replace(
  '<ExternalLink className="w-4 h-4" />\n                    </Link>\n                    <button',
  '<ExternalLink className="w-4 h-4" />\n                    </Link>\n                    <Link href={`/convenciones/${conv.slug}/editar`} className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"><Edit className="w-4 h-4" /></Link>\n                    <button'
);

c = c.replace(
  '<ExternalLink className="w-5 h-5" />\r\n                      </Link>\r\n\r\n                      <button',
  '<ExternalLink className="w-5 h-5" />\r\n                      </Link>\r\n                      <Link href={`/convenciones/${conv.slug}/editar`} className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all" title="Editar"><Edit className="w-5 h-5" /></Link>\r\n\r\n                      <button'
);

c = c.replace(
  '<ExternalLink className="w-5 h-5" />\n                      </Link>\n\n                      <button',
  '<ExternalLink className="w-5 h-5" />\n                      </Link>\n                      <Link href={`/convenciones/${conv.slug}/editar`} className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all" title="Editar"><Edit className="w-5 h-5" /></Link>\n\n                      <button'
);

fs.writeFileSync('src/app/admin/convenciones/page.tsx', c, 'utf8');
