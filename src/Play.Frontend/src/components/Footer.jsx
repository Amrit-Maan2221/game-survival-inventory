function Footer() {
  const currentYear = new Date().getFullYear(); // Get current year dynamically

  return (
    <footer className="bg-white border-t border-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <p>© {currentYear} Survival Game Economy. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="https://github.com/Amrit-Maan2221/game-survival-inventory"
            target="_blank"
            className="hover:text-orange-600"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
