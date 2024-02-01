import React, { useState, useEffect } from 'react';

interface Quote {
  quote: string;
  author: string;
}

interface QuotesData {
  quotes: Quote[];
}

const QuoteMachine: React.FC = () => {
  const [quotesData, setQuotesData] = useState<QuotesData | null>(null);
  const [currentQuote, setCurrentQuote] = useState<string>('');
  const [currentAuthor, setCurrentAuthor] = useState<string>('');
  const [currentColor, setCurrentColor] = useState<number>(0);

  const colors: string[] = [
    '#16a085',
    '#27ae60',
    '#2c3e50',
    '#f39c12',
    '#e74c3c',
    '#9b59b6',
    '#FB6964',
    '#342224',
    '#472E32',
    '#BDBB99',
    '#77B1A9',
    '#73A857',
  ];

  const fetchQuotes = async () => {
    try {
      const response = await fetch(
        'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json'
      );
      const jsonQuotes = await response.json();
      setQuotesData(jsonQuotes);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const getRandomQuote = (): Quote => {
    return quotesData!.quotes[
      Math.floor(Math.random() * quotesData!.quotes.length)
    ];
  };

  const updateQuote = () => {
    if (!quotesData) return;

    const randomQuote = getRandomQuote();

    setCurrentQuote(randomQuote.quote);
    setCurrentAuthor(randomQuote.author);

    const color = Math.floor(Math.random() * colors.length);
    setCurrentColor(color);

    updateBackgroundAndText(color);
    updateSocialMediaLinks(randomQuote);
  };

  const updateBackgroundAndText = (color: number) => {
    document.documentElement.style.backgroundColor = colors[color];
    document.documentElement.style.color = colors[color];
  };

  const updateSocialMediaLinks = (quote: Quote) => {
    const tweetUrl =
      'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' +
      encodeURIComponent('"' + quote.quote + '" ' + quote.author);

    const tumblrUrl =
      'https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=' +
      encodeURIComponent(quote.author) +
      '&content=' +
      encodeURIComponent(quote.quote) +
      '&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button';

    (document.getElementById('tweet-quote') as HTMLAnchorElement).href = tweetUrl;
    (document.getElementById('tumblr-quote') as HTMLAnchorElement).href = tumblrUrl;
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (quotesData) {
      updateQuote();
    }
  }, [quotesData]);

  if (!quotesData) {
    return <div>Loading...</div>; // Add a loading state or component if quotesData is still null
  }

  return (
    <div id="quote-box">
      <div id="text" className="quote-text">
        {currentQuote}
      </div>
      <div id="author" className="quote-author">
        {currentAuthor}
      </div>
      <button id="new-quote" className="button" onClick={updateQuote}>
        New Quote
      </button>
      <a id="tweet-quote" target="_blank" rel="noopener noreferrer">
        Tweet Quote
      </a>
      <a id="tumblr-quote" target="_blank" rel="noopener noreferrer">
        Tumblr Quote
      </a>
    </div>
  );
};

export default QuoteMachine;
