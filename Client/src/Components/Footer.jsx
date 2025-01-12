import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">
              About FinanceTracker
            </h2>
            <p className="text-sm">
              FinanceTracker helps you take control of your finances with
              powerful tools for budgeting, tracking expenses, and achieving
              your financial goals. Simplify your financial life today!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">
              Quick Links
            </h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-purple-500 transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/transactions"
                  className="hover:text-purple-500 transition-colors"
                >
                  Transactions
                </a>
              </li>
              <li>
                <a
                  href="/budgets"
                  className="hover:text-purple-500 transition-colors"
                >
                  Budgets
                </a>
              </li>
              <li>
                <a
                  href="/goals"
                  className="hover:text-purple-500 transition-colors"
                >
                  Goals
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="hover:text-purple-500 transition-colors"
                >
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">
              Contact Us
            </h2>
            <p className="text-sm">Have questions? We’re here to help.</p>
            <p className="mt-2">
              <a
                href="mailto:support@financetracker.com"
                className="text-purple-500 hover:underline"
              >
                support@financetracker.com
              </a>
            </p>
            <p className="mt-2 text-sm">
              © {new Date().getFullYear()} FinanceTracker. All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-6 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm">
            Built with ❤️ by <span className="text-purple-500">Your Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
