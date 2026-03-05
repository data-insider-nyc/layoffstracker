import React, { useState } from 'react';

interface LayoffTableProps {
  data: Array<Record<string, any>>; // Define the type for the data prop
  isDarkMode?: boolean;
}

const LayoffTable: React.FC<LayoffTableProps> = ({ data, isDarkMode = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const rowsPerPage = 10;

  if (data.length === 0) {
    return <div className="text-gray-900 dark:text-white">Loading...</div>;
  }

  const filteredData = search.trim()
    ? data.filter((row) =>
        row.company?.toLowerCase().includes(search.toLowerCase()) ||
        row.headquarter?.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  // Get the headers dynamically from the first row of CSV and add a new "Google Search" column
  const headers = ['date', ...Object.keys(data[0]).filter((key) => key !== 'date'), 'googleSearch'];

  // Utility function to convert strings to camel case
  const toCamelCase = (str: string) => {
    return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', '')).replace(/^[a-z]/, (group) => group.toUpperCase());
  };

  // Function to render table cell content based on the header
  const renderCellContent = (header: string, row: Record<string, any>) => {
    switch (header) {
      case 'company':
        const getLogoUrl = (company: string, headquarter: string) => {
          if (company.includes('Department')) {
            return 'https://unavatar.io/whitehouse.gov';
          }

          // Map company names to their domains
          const domainMap: Record<string, string> = {
            // Explicitly mapped to correct domains
            MITRE: 'mitre.org',
            Amazon: 'amazon.com',
            'Amazon.com': 'amazon.com',
            Meta: 'meta.com',
            'Meta Platforms': 'meta.com',
            xAI: 'x.ai',
            Rivian: 'rivian.com',
            Salesforce: 'salesforce.com',
            Oracle: 'oracle.com',
            Atlassian: 'atlassian.com',
            ScaleAI: 'scale.com',
            Intel: 'intel.com',
            Indeed: 'indeed.com',
            Microsoft: 'microsoft.com',
            Google: 'google.com',
            eBay: 'ebay.com',
            Stripe: 'stripe.com',
            Perplexity: 'perplexity.ai',
            UBS: 'ubs.com',
            TikTok: 'tiktok.com',
            OpenAI: 'openai.com',
            Apple: 'apple.com',
            Netflix: 'netflix.com',
            Spotify: 'spotify.com',
            Airbnb: 'airbnb.com',
            Uber: 'uber.com',
            Lyft: 'lyft.com',
            Twitter: 'twitter.com',
            'X (Twitter)': 'x.com',
            Snap: 'snap.com',
            LinkedIn: 'linkedin.com',
            Cisco: 'cisco.com',
            HP: 'hp.com',
            'HP Inc.': 'hp.com',
            Dell: 'dell.com',
            IBM: 'ibm.com',
            Zoom: 'zoom.us',
            PayPal: 'paypal.com',
            Paypal: 'paypal.com',
            Coinbase: 'coinbase.com',
            Robinhood: 'robinhood.com',
            DoorDash: 'doordash.com',
            Shopify: 'shopify.com',
            Expedia: 'expedia.com',
            Tesla: 'tesla.com',
            Peloton: 'onepeloton.com',
            Wayfair: 'wayfair.com',
            Block: 'block.xyz',
            Nike: 'nike.com',
            Verizon: 'verizon.com',
            'Washington Post': 'washingtonpost.com',
            UPS: 'ups.com',
            Pinterest: 'pinterest.com',
            Macy: 'macys.com',
            "Macy's": 'macys.com',
            'Home Depot': 'homedepot.com',
            Angi: 'angi.com',
            'T-Mobile': 'tmobile.com',
            Synopsys: 'synopsys.com',
            ASML: 'asml.com',
            Ericsson: 'ericsson.com',
            Microsoft: 'microsoft.com',
            Dow: 'dow.com',
            'Dow Inc.': 'dow.com',
            Lowe: 'lowes.com',
            "Lowe's": 'lowes.com',
            Dropbox: 'dropbox.com',
            Twilio: 'twilio.com',
            Zendesk: 'zendesk.com',
            Okta: 'okta.com',
            Databricks: 'databricks.com',
            Instacart: 'instacart.com',
            Klarna: 'klarna.com',
            Grab: 'grab.com',
            Canva: 'canva.com',
            Notion: 'notion.so',
            Figma: 'figma.com',
            Asana: 'asana.com',
            HubSpot: 'hubspot.com',
          };

          const domain = domainMap[company] || `${company.toLowerCase().replace(/[^a-z0-9]/gi, '')}.com`;
          return `https://unavatar.io/${domain}`;
        };

        return (
          <div className="flex items-center">
            <img
              src={getLogoUrl(row.company, row.headquarter || '')}
              alt={`${row.company} logo`}
              className="w-6 h-6 mr-2"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
              }} // Fallback to default image if not found
            />
            {row.company}
          </div>
        );
      case 'date':
        return new Date(row[header]).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'googleSearch':
        return (
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(`${row.company} ${row.headquarters || 'US'} layoffs`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 flex items-center justify-center hover:text-blue-800 dark:hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-4 7h11a2 2 0 002-2V10m-7 11H5a2 2 0 01-2-2V7a2 2 0 012-2h7" />
            </svg>
          </a>
        );
      case 'laidOff':
        return row[header]?.toLocaleString() || 'N/A';
      case 'headquarter': // Handle missing location data
        return row[header] || 'US';
      default:
        return row[header];
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="table-container my-4">
      {/* Search bar */}
      <div className="relative mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by company or location…"
          className="w-full pl-9 pr-9 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {search && (
          <button
            onClick={() => { setSearch(''); setCurrentPage(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        )}
      </div>
      {filteredData.length === 0 && search && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">No results for "{search}"</p>
      )}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className={`border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold text-gray-900 dark:text-white ${header === 'googleSearch' ? 'w-12' : ''}`}
                  style={header === 'googleSearch' ? { width: '50px' } : header === 'date' ? { width: '160px' } : undefined}
                >
                  {header === 'googleSearch'
                    ? 'Link'
                    : header === 'headquarter' // Rename "headquarters" to "City"
                    ? 'Location'
                    : toCamelCase(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                {headers.map((header) => (
                  <td key={header} className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100">
                    {renderCellContent(header, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded transition-colors duration-150 ${
            currentPage === 1
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600'
              : 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-900 dark:text-white">
          {search ? `${filteredData.length} result${filteredData.length !== 1 ? 's' : ''} · ` : ''}Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded transition-colors duration-150 ${
            currentPage === totalPages
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600'
              : 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LayoffTable;
