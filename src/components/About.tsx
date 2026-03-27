import React, { useState } from 'react';
import SEOHead from './SEOHead';

const GITHUB_REPO = 'data-insider-nyc/layoffstracker';

const About: React.FC = () => {
  const [company, setCompany] = useState('');
  const [layoffs, setLayoffs] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [source, setSource] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      `**Company:** ${company}`,
      `**Layoffs:** ${layoffs}`,
      `**Date:** ${date}`,
      `**Location (HQ):** ${location || 'N/A'}`,
      `**Source / Link:** ${source || 'N/A'}`,
      '',
      '_Please verify this data before merging._',
    ].join('\n');
    const title = encodeURIComponent(`[Data] ${company} – ${layoffs} layoffs on ${date}`);
    const encodedBody = encodeURIComponent(body);
    window.open(
      `https://github.com/${GITHUB_REPO}/issues/new?title=${title}&body=${encodedBody}&labels=data-submission`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1.5px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color .15s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    marginBottom: 6,
  };

  return (
    <>
      <SEOHead
        title="About — Layoffs Tracker"
        description="Learn about Layoffs Tracker, an open-source interactive dashboard visualizing tech and corporate layoffs. Submit layoff data or reach out to the author."
        url="https://data-insider-nyc.github.io/layoffstracker/about"
      />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Header */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: 16 }}>
          About Layoffs Tracker
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
          Layoffs Tracker is an open-source dashboard that visualizes tech and corporate layoff data through
          interactive charts and company timelines. Built with React, Vite, and Recharts — data is sourced
          from publicly available reports and updated continuously.
        </p>

        {/* Author card */}
        <div className="card" style={{ padding: '20px 24px', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 4 }}>Built by</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)' }}>Karl Kwon</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/karlkwonphd/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Karl Kwon on LinkedIn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-10h3v1.765c1.396-2.586 7-2.777 7 2.476v5.759z"/></svg>
              LinkedIn
            </a>
            {/* X / Twitter */}
            <a
              href="https://x.com/karlkwonphd"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Karl Kwon on X (Twitter)"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X
            </a>
            {/* GitHub */}
            <a
              href="https://github.com/data-insider-nyc/layoffstracker"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Layoffs Tracker on GitHub"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-body)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 32 }} />

        {/* Submit data form */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 6 }}>
          Submit Layoff Data
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
          Know of a layoff that's missing? Fill in the details below — it opens a pre-filled GitHub Issue.
          No account? <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Sign up free</a>, or{' '}
          <a href="https://x.com/karlkwonphd" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>DM on X</a>.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Company *</label>
              <input
                required
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Layoffs (headcount) *</label>
              <input
                required
                type="number"
                min="1"
                value={layoffs}
                onChange={e => setLayoffs(e.target.value)}
                placeholder="e.g. 250"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Date *</label>
              <input
                required
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>HQ Location</label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. SF Bay Area"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Source / Link</label>
            <input
              value={source}
              onChange={e => setSource(e.target.value)}
              placeholder="e.g. https://techcrunch.com/..."
              style={inputStyle}
            />
          </div>

          <div>
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--accent)',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              Open GitHub Issue
            </button>
          </div>
        </form>

      </div>
    </>
  );
};

export default About;