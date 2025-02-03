export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tempo React Starter</h3>
            <p className="text-gray-600">
              Launch your next project faster with our modern tech stack.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-900">Technologies</h4>
            <ul className="space-y-2 text-gray-600">
              <li>React + Vite</li>
              <li>Clerk Auth</li>
              <li>Convex BaaS</li>
              <li>Polar.sh</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-900">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://docs.tempo.com" className="text-gray-600 hover:text-gray-900">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/tempoplatform" className="text-gray-600 hover:text-gray-900">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://tempo.com/blog" className="text-gray-600 hover:text-gray-900">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-900">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} Tempo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
