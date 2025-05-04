// src/components/EncoderForm.jsx
import React, { useState } from 'react';
import {client } from '../../sanityClient.js';
import { QRCodeCanvas } from 'qrcode.react';

const EncoderForm = () => {
  const [form, setForm] = useState({
    title: '',
    ipAddress: '',
    port: '',
    circuit: '',
    location: '',
    purpose: ''
  });

  const [slug, setSlug] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const generatedSlug = form.title.toLowerCase().replace(/\s+/g, '-');
    setSlug(generatedSlug);

    const doc = {
      _type: 'encoder',
      title: form.title,
      slug: { _type: 'slug', current: generatedSlug },
      ipAddress: form.ipAddress,
      port: form.port,
      circuit: form.circuit,
      location: form.location,
      purpose: form.purpose
    };

    try {
      await client.create(doc);
      setSubmitted(true);
    } catch (err) {
      console.error('Error writing to Sanity:', err);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {['title', 'ipAddress', 'port', 'circuit', 'location', 'purpose'].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full p-2 border"
          />
        ))}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create & Generate QR</button>
      </form>

      {submitted && slug && (
        <div className="mt-6 text-center">
          <QRCodeCanvas value={`http://qrcode-ma833xyha-nicobazzonis-projects.vercel.app/${slug}`} />
          <p className="mt-2">Scan this QR code for encoder info.</p>
          <button onClick={() => window.print()} className="mt-4 p-2 bg-green-500 text-white">Print QR</button>
        </div>
      )}
    </div>
  );
};

export default EncoderForm;