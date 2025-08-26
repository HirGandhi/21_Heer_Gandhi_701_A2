// for function - treact
// tsrce for class

// SessionStorageExample.js
import React, { useState, useEffect } from 'react';

const SessionStorageExample = () => {
  const [email, setEmail] = useState('');
  const [storedEmail, setStoredEmail] = useState('');

  useEffect(() => {
    // Load stored name on component mount
    const saved = sessionStorage.getItem('sessionEmail');
    if (saved) setStoredName(saved);
  }, []);

  const handleSave = () => {
    sessionStorage.setItem('sessionEmail', email);
    setStoredName(email);
    setName('');
  };

  return (
    <div>
      <h2>sessionStorage Example</h2>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      <button onClick={handleSave}>Save</button>
      {storedEmail && <p>Stored Name: {storedEmail}</p>}
    </div>
  );
};


export default SessionStorageExample;
