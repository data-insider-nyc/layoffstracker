import React from "react";
import ReactMarkdown from "react-markdown";
import aboutContent from "../content/About.md?raw"; // Import the Markdown file as raw text

const About = () => {
  return (
    <div className="p-8 text-center">
      <ReactMarkdown className="prose mx-auto">{aboutContent}</ReactMarkdown>
    </div>
  );
};

export default About;