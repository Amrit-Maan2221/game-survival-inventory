import { Link } from "react-router-dom";
function Home() {
  // Helper for external links
  const ExternalLink = ({ href, children }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-orange-600 hover:underline font-medium"
    >
      {children}
    </a>
  );

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <h1 className="text-6xl font-black text-gray-900 mb-6">Survival</h1>
        <p className="text-lg text-gray-600 mb-12">
          Welcome to the Survival website, a <span className="font-semibold text-gray-900">cloud native virtual game economy system.</span>
        </p>

        {/* Action Sections */}
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <section>
                <h2 className="text-xl font-bold mb-4">To get started, you can:</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    <Link to="/catalog" className="text-orange-600 hover:underline">
                    Manage the Catalog
                    </Link>
                </li>
                <li>
                    <Link to="/inventory" className="text-orange-600 hover:underline">
                    Check a user's Inventory
                    </Link>
                </li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4">Explore the Open API documentation:</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    <ExternalLink href="https://play-catalog-service.azurewebsites.net/docs">
                        Catalog service
                    </ExternalLink>
                </li>
                <li>
                    <ExternalLink href="https://play-inventory-service.azurewebsites.net/docs">
                        Inventory service
                    </ExternalLink>
                </li>
                </ul>
            </section>
            </div>


          {/* Tech Stack Section */}
          <section className="pt-10 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-500 mb-6 uppercase tracking-wider">This website was built with:</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-start gap-2">
                <span className="text-orange-500">▹</span>
                <span><ExternalLink href="https://dotnet.microsoft.com/">ASP.NET Core and C#</ExternalLink> for cross-platform server-side code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">▹</span>
                <span><ExternalLink href="https://www.docker.com/">Docker</ExternalLink> for services containerization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">▹</span>
                <span><ExternalLink href="https://www.mongodb.com/">MongoDB</ExternalLink> for database storage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">▹</span>
                <span><ExternalLink href="https://masstransit.io/">RabbitMQ and MassTransit</ExternalLink> for message-based asynchronous communication</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">▹</span>
                <span><ExternalLink href="https://react.dev/">React</ExternalLink> for client-side rendering and <ExternalLink href="https://tailwindcss.com/">Tailwind CSS</ExternalLink> for layout and styling</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Home;