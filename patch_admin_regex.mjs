import fs from 'fs';

let adminPath = 'src/app/admin/convenciones/page.tsx';
let adminText = fs.readFileSync(adminPath, 'utf8');

// The mobile block usually looks like:
// <div className="flex items-center gap-2">
//   <Link ...> ... </Link>
//   <button ...> ... </button>
// </div>

const mobilePattern = /<div className="flex items-center gap-2">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*\)\)/g;
// actually safer: replace between `<ExternalLink className="w-4 h-4" />` and `<Trash2 className="w-4 h-4" />`

adminText = adminText.replace(
  /<Link[\s\S]*?<ExternalLink className="w-4 h-4" \/>[\s\S]*?<\/Link>\s*<button[\s\S]*?handleDeleteConvention[\s\S]*?<Trash2 className="w-4 h-4" \/>/g,
  `<Link
                      href={\`/convenciones/\${conv.slug}\`}
                      target="_blank"
                      className="inline-flex items-center justify-center p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"
                      title="Ver en el sitio web"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      href={\`/convenciones/\${conv.slug}/editar\`}
                      className="inline-flex items-center justify-center p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"
                      title="Editar convención"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteConvention(conv._id)}
                      disabled={actionLoading === conv._id}
                      className="inline-flex items-center justify-center p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"
                      title="Eliminar convención"
                    >
                      <Trash2 className="w-4 h-4" />`
);


adminText = adminText.replace(
  /<Link[\s\S]*?<ExternalLink className="w-5 h-5" \/>[\s\S]*?<\/Link>\s*<button[\s\S]*?handleDeleteConvention[\s\S]*?<Trash2 className="w-5 h-5" \/>/g,
  `<Link
                        href={\`/convenciones/\${conv.slug}\`}
                        target="_blank"
                        className="inline-flex items-center justify-center p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"
                        title="Ver en el sitio web"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                      <Link
                        href={\`/convenciones/\${conv.slug}/editar\`}
                        className="inline-flex items-center justify-center p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"
                        title="Editar convención"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteConvention(conv._id)}
                        disabled={actionLoading === conv._id}
                        className="inline-flex items-center justify-center p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"
                        title="Eliminar convención"
                      >
                        <Trash2 className="w-5 h-5" />`
);


fs.writeFileSync(adminPath, adminText, 'utf8');

console.log('Regex replace done');
