import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-content">
        <p>
          We use cookies to enhance your cinematic experience. By continuing to visit this site you agree to our use of cookies.
        </p>
        <button onClick={handleAccept} className="btn-accept">Accept</button>
      </div>
    </div>
  );
};

export default CookieConsent;
