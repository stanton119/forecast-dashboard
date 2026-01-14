import React, { useState } from 'react';

const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset "copied" status after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Optionally, provide user feedback that copying failed
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
    >
      {copied ? 'Copied!' : 'Share Permalink'}
    </button>
  );
};

export default ShareButton;
