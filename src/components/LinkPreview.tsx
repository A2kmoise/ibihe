import React, { useState, useEffect } from 'react';
import './LinkPreview.css';

interface LinkPreviewProps {
  url: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const html = data.contents;

        if (html) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          const getMetaTag = (name: string) => {
            const meta = doc.querySelector(`meta[name="${name}"]`) || doc.querySelector(`meta[property="og:${name}"]`);
            return meta ? meta.getAttribute('content') : null;
          };

          const title = getMetaTag('title') || doc.querySelector('title')?.innerText;
          const description = getMetaTag('description');
          const image = getMetaTag('image');
          const siteName = getMetaTag('site_name');

          setMetadata({
            title,
            description,
            image,
            siteName,
          });
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!metadata) {
    return null;
  }

  return (
    <div className="link-preview-card">
      <img src={metadata.image || "/menya_favicon.png"} alt={metadata.title} className="link-preview-image" />
      <div className="link-preview-content">
        <div className="link-preview-title">{metadata.title}</div>
        <div className="link-preview-description">{metadata.description}</div>
        <div className="link-preview-site-name">{metadata.siteName}</div>
      </div>
    </div>
  );
};

export default LinkPreview;