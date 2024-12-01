import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-header">
        <div className="button-group">
          <Link to="/login" className="btn-login">LOG IN</Link>
          <Link to="/register" className="btn-register">REGISTER</Link>
        </div>
      </div>
      <div className="landing-main">
        <h1 className="landing-title font-bold">Welcome Lorem Ipsum</h1>
        <div className="landing-line-break"></div>
        <p className="landing-slogan">
        Lorem ipsum odor amet, consectetuer adipiscing elit. Quam ridiculus posuere vitae turpis mauris mus sit amet. 
        Ex proin per primis; nam netus porta.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
