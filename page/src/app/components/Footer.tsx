import { Mail, Shield, FileText } from 'lucide-react';
import logo from '../../assets/OJO_RETISCAN.png';

interface FooterProps {
  onNavigateToPrivacy?: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToHIPAA?: () => void;
}

export function Footer({ onNavigateToPrivacy, onNavigateToTerms, onNavigateToHIPAA }: FooterProps) {
  return (
    <footer id="footer" className="relative bg-slate-900 dark:bg-slate-950 text-slate-300 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="bg-white dark:bg-slate-800 p-2 rounded-xl flex items-center justify-center shadow-lg transition-colors">
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
            <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Tecnología de inteligencia artificial para la detección temprana
              de retinopatía diabética. Salvando la visión de miles de pacientes.
            </p>
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-400">v1.0 — Beta</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Producto</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#descubre" className="hover:text-cyan-400 hover:translate-x-1 inline-block transition-all duration-200">Características</a></li>
              <li><a href="#beneficios" className="hover:text-cyan-400 hover:translate-x-1 inline-block transition-all duration-200">Cómo Funciona</a></li>
              <li><a href="#suscripcion" className="hover:text-cyan-400 hover:translate-x-1 inline-block transition-all duration-200">Precios</a></li>
              <li><a href="#faq" className="hover:text-cyan-400 hover:translate-x-1 inline-block transition-all duration-200">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          {/* Company — placeholder, not yet implemented */}
          <div>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3 text-sm opacity-50 pointer-events-none">
              <li><span className="hover:translate-x-1 inline-block transition-all duration-200">Sobre Nosotros</span></li>
              <li><span className="hover:translate-x-1 inline-block transition-all duration-200">Equipo Médico</span></li>
              <li><span className="hover:translate-x-1 inline-block transition-all duration-200">Blog</span></li>
              <li><span className="hover:translate-x-1 inline-block transition-all duration-200">Carreras</span></li>
            </ul>
          </div>

          {/* Legal & Contact — placeholder, not yet implemented */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal y Contacto</h3>
            <ul className="space-y-3 text-sm flex flex-col items-center md:items-start">
              <li>
                <button onClick={onNavigateToPrivacy} className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-1 transition-all duration-200">
                  <Shield className="w-4 h-4" />
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button onClick={onNavigateToTerms} className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-1 transition-all duration-200">
                  <FileText className="w-4 h-4" />
                  Términos de Uso
                </button>
              </li>
              <li>
                <button onClick={onNavigateToHIPAA} className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-1 transition-all duration-200">
                  <Shield className="w-4 h-4" />
                  Cumplimiento HIPAA
                </button>
              </li>
              <li>
                <a href="mailto:info@retiscan.app" className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-1 transition-all duration-200">
                  <Mail className="w-4 h-4" />
                  retiscan2026@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-center md:text-left">
            <p className="text-slate-500">
              © 2026 RetiScan. Todos los derechos reservados. Dispositivo médico clase II.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" aria-label="Facebook de RetiScan" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Facebook</a>
              <a href="#" aria-label="Instagram de RetiScan" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Instagram</a>
            </div>
          </div>

          {/* Medical disclaimer */}
          <div className="mt-6 p-4 bg-slate-800/30 dark:bg-slate-900/40 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-400 leading-relaxed text-center md:text-left">
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
