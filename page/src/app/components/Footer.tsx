import { Mail, Shield, FileText } from 'lucide-react';
import logo from '../../assets/logo_sin_fondo.png';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Footer() {
  const brand = useScrollReveal('fade-up', { delay: 100 });
  const col1 = useScrollReveal('fade-up', { delay: 200 });
  const col2 = useScrollReveal('fade-up', { delay: 300 });
  const col3 = useScrollReveal('fade-up', { delay: 400 });

  return (
    <footer className="relative bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div ref={brand.ref} style={brand.style} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
                <img
                  src={logo}
                  className="h-8 w-auto object-contain"
                  alt="RetiScan Logo"
                />
              </div>
              <span className="text-2xl font-bold text-white">
                RetiScan
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Tecnología de inteligencia artificial para la detección temprana
              de retinopatía diabética. Salvando la visión de miles de pacientes.
            </p>
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-400">Sistema Operativo</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div ref={col1.ref} style={col1.style}>
            <h3 className="text-white font-semibold mb-4">Producto</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#producto" className="hover:text-cyan-400 hover:translate-x-1 inline-block transition-all duration-200">Características</a></li>
              <li><a href="#como-funciona" className="hover:text-cyan-400 hover:translate-x-1 inline-block transition-all duration-200">Cómo Funciona</a></li>
              <li><a href="#suscripcion" className="hover:text-cyan-400 hover:translate-x-1 inline-block transition-all duration-200">Precios</a></li>
              <li><a href="#demo" className="hover:text-cyan-400 hover:translate-x-1 inline-block transition-all duration-200">Demo en Vivo</a></li>
            </ul>
          </div>

          {/* Company */}
          <div ref={col2.ref} style={col2.style}>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#nosotros" className="hover:text-cyan-400 hover:translate-x-1 inline-block transition-all duration-200">Sobre Nosotros</a></li>
              <li><a href="#equipo" className="hover:text-cyan-400 hover:translate-x-1 inline-block transition-all duration-200">Equipo Médico</a></li>
              <li><a href="#blog" className="hover:text-cyan-400 hover:translate-x-1 inline-block transition-all duration-200">Blog</a></li>
              <li><a href="#carreras" className="hover:text-cyan-400 hover:translate-x-1 inline-block transition-all duration-200">Carreras</a></li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div ref={col3.ref} style={col3.style}>
            <h3 className="text-white font-semibold mb-4">Legal y Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#privacidad" className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-1 transition-all duration-200">
                  <Shield className="w-4 h-4" />
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#terminos" className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-1 transition-all duration-200">
                  <FileText className="w-4 h-4" />
                  Términos de Uso
                </a>
              </li>
              <li>
                <a href="#hipaa" className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-1 transition-all duration-200">
                  <Shield className="w-4 h-4" />
                  Cumplimiento HIPAA
                </a>
              </li>
              <li>
                <a href="mailto:info@retiscan.app" className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-1 transition-all duration-200">
                  <Mail className="w-4 h-4" />
                  info@retiscan.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-slate-500">
              © 2026 RetiScan. Todos los derechos reservados. Dispositivo médico clase II.
            </p>
            <div className="flex gap-6">
              <a href="#facebook" className="hover:text-cyan-400 transition-colors">Facebook</a>
              <a href="#twitter" className="hover:text-cyan-400 transition-colors">Twitter</a>
              <a href="#linkedin" className="hover:text-cyan-400 transition-colors">LinkedIn</a>
              <a href="#youtube" className="hover:text-cyan-400 transition-colors">YouTube</a>
            </div>
          </div>

          {/* Medical disclaimer */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Aviso Médico:</strong> RetiScan es una herramienta de apoyo diagnóstico
              y no sustituye la consulta con un profesional de la salud. Los resultados deben ser interpretados
              por un oftalmólogo certificado. Este servicio no está destinado para emergencias médicas.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}