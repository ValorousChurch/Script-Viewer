import React from 'react';
import { Link } from 'react-router-dom';

const PlanSelector = () => (
  <div className="page">
    <div className="typeSelector">
      <p>To begin, please select a service type.</p>
      <Link to="/list/41396">Morning Experience</Link>
      <Link to="/list/804451">Evening Experience</Link>
    </div>
  </div>
);

export default PlanSelector;
