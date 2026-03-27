import React from 'react';
import SEOHead from './SEOHead';

const About: React.FC = () => {
  return (
    <>
      <SEOHead
        title="About — Layoffs Tracker"
        description="Learn about Layoffs Tracker, an open-source interactive dashboard visualizing tech and corporate layoffs using React, Vite, and Recharts."
        url="https://data-insider-nyc.github.io/layoffstracker/about"
      />
      <div className="max-w-3xl mx-auto mt-8 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">About Layoffs Tracker</h1>
        <p className="text-base text-gray-700 leading-relaxed">
          Layoffs Tracker is a web application that visualizes real-time, trendy public datasets through interactive charts and dashboards. Built using modern technologies like React, Vite, and Recharts, this app provides an insightful way to explore datasets like layoffs, stock data, and more.
        </p>
      </div>
    </>
  );
};

export default About;