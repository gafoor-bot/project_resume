import React, { useState } from 'react';
import axios from 'axios';
import './JobAnalysis.css'; // Import the CSS file for styling

const JobAnalysis = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle resume file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log('Selected file:', file);  // Log the selected file
    setResumeFile(file);
  };

  // Handle job description input
  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  // Function to submit the resume and job description to the backend for analysis
  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription) {
      alert('Please upload a resume and provide a job description.');
      return;
    }
  
    console.log('Resume File:', resumeFile);  // Log resume file before sending request
    setLoading(true);
  
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);
  
    try {
      // Make the POST request
      const response = await axios.post('http://localhost:8082/api/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const parsedResponse = JSON.parse(response.data[0]);  // Assuming response data is a stringified JSON
      setAnalysisResult(parsedResponse);
    } catch (error) {
      console.error('Error during analysis:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    

  // Convert the analysis response into user-friendly text
  const convertAnalysisToText = (data) => {
    const labels = data.labels;
    const scores = data.scores;
  
    const descriptions = labels.map((label, index) => {
      const score = scores[index];
      let matchDescription;
  
      // Qualifications - Fair Match
      if (label === "qualifications") {
        if (score > 0.5) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} strongly aligns with the resume.`;
        } else if (score > 0.4) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} shows a fair match with the resume.`;
        } else if (score > 0.02) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} has a minor match in the resume.`;
        } else {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} is not closely aligned with the resume.`;
        }
      }
      // Responsibilities - Minor Match
      else if (label === "responsibilities") {
        if (score > 0.5) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} matches strongly with the resume.`;
        } else if (score > 0.3) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} shows a fair match with the resume.`;
        } else if (score > 0.02) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} has a minor match in the resume.`;
        } else {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} is not closely aligned with the resume.`;
        }
      }
      // Skills - Should be more aligned with the resume (Adjusted threshold)
      else if (label === "skills") {
        if (score > 0.6) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} strongly matches with the resume.`;
        } else if (score > 0.09) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} shows a fair match with the resume.`;
        } else if (score > 0.08) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} has a minor match in the resume.`;
        } else {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} is not closely aligned with the resume.`;
        }
      }
      // Experience - Should have higher match
      else if (label === "experience") {
        if (score > 0.5) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} shows a strong match with the resume.`;
        } else if (score > 0.09) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} has a fair match in the resume.`;
        } else {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} does not closely align with the resume.`;
        }
      }
      // Technologies - Should be aligned better
      else if (label === "technologies") {
        if (score > 0.018) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} matches well with the resume.`;
        } else if (score > 0.001) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} shows a minor match in the resume.`;
        } else {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} is not closely aligned with the resume.`;
        }
      }
      // Default case for any other labels
      else {
        if (score > 0.5) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} matches strongly with the resume.`;
        } else if (score > 0.09) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} shows a fair match with the resume.`;
        } else if (score > 0.01) {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} has a minor match in the resume.`;
        } else {
          matchDescription = `${label.charAt(0).toUpperCase() + label.slice(1)} is not closely aligned with the resume.`;
        }
      }
  
      return matchDescription;
    });
  
    return descriptions.join(' ');
  };
  
  return (
    <div className="container">
      <h3 className="header">Job Description Analysis</h3>

      {/* Resume Upload */}
      <div className="form-group">
        <label htmlFor="resume" className="form-label">Upload Resume:</label>
        <input type="file" id="resume" onChange={handleFileChange} className="form-input" />
      </div>

      {/* Job Description Input */}
      <div className="form-group">
        <label htmlFor="jobDescription" className="form-label">Enter Job Description:</label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={handleJobDescriptionChange}
          rows="5"
          cols="50"
          className="form-input"
        />
      </div>

      {/* Submit Button */}
      <div className="form-group">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {/* Display Analysis Result */}
      {analysisResult && (
        <div className="result-container">
          <h4 className="result-header">Analysis Result:</h4>
          <p className="result-text">
            {convertAnalysisToText(analysisResult)}
          </p>
        </div>
      )}
    </div>
  );
};

export default JobAnalysis;