import fs from 'fs';
let c = fs.readFileSync('src/app/admin/convenciones/page.tsx', 'utf8');

const targetMobile = `<ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteConvention(conv._id)}`;

const replacementMobile = `<ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={\`/convenciones/\${conv.slug}/editar\`}
                        className="p-2 text-black border-2 border-black bg-white hover:bg-gray-100 transition-all"
                        title="Editar convención"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteConvention(conv._id)}`;

const targetDesktop = `<ExternalLink className="w-5 h-5" />
                        </Link>
  
                        <button
                          onClick={() => handleDeleteConvention(conv._id)}`;

const replacementDesktop = `<ExternalLink className="w-5 h-5" />
                        </Link>
  
                        <Link
                          href={\`/convenciones/\${conv.slug}/editar\`}
                          className="p-3 text-black border-2 border-transparent hover:border-black hover:bg-white transition-all"
                          title="Editar convención"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>

                        <button
                          onClick={() => handleDeleteConvention(conv._id)}`;

c = c.replace(targetMobile, replacementMobile);
c = c.replace(targetDesktop, replacementDesktop);
fs.writeFileSync('src/app/admin/convenciones/page.tsx', c, 'utf8');
