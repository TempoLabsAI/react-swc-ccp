export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200/50 bg-[#F5F5F7]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#1D1D1F]">Tempo React Starter</h3>
            <p className="text-base text-[#86868B] leading-relaxed">
              Launch your next project faster with our modern tech stack.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-[#1D1D1F]">Technologies</h4>
            <ul className="space-y-3">
              <li className="text-base text-[#86868B] hover:text-[#1D1D1F] transition-colors">React + Vite</li>
              <li className="text-base text-[#86868B] hover:text-[#1D1D1F] transition-colors">Clerk Auth</li>
              <li className="text-base text-[#86868B] hover:text-[#1D1D1F] transition-colors">Convex BaaS</li>
              <li className="text-base text-[#86868B] hover:text-[#1D1D1F] transition-colors">Polar.sh</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-[#1D1D1F]">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://docs.tempo.com" className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/tempoplatform" className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://tempo.com/blog" className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-[#1D1D1F]">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="/privacy" className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-neutral-200/50">
          <p className="text-center text-sm text-[#86868B]">
            © {new Date().getFullYear()} Tempo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
