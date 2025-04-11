import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">About Trendboard</h1>
      <p className="text-base text-gray-700 leading-relaxed">
        Trendboard is a web application that visualizes real-time, trendy public datasets through interactive charts and dashboards. Built using modern technologies like React, Vite, and Recharts, this app provides an insightful way to explore datasets like layoffs, stock data, and more.
      </p>
    </div>
  );
};

export default About;