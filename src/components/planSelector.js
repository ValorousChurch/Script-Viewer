import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PCO } from '../utilities/pco';

class PlanSelector extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  state = {
    plans: <p style={{ marginTop: 0 }}>loading...</p>,
  };

  componentWillMount = async () => {
    const planData = await PCO.getFuturePlans(this.props.match.params.serviceType, 6);
    const plans = planData.map(plan => (
      <Link
        key={plan.id}
        value={plan.id}
        to={`/plan/${this.props.match.params.serviceType}/${plan.id}`}
      >
        {plan.attributes.dates}
      </Link>
    ));
    this.setState({ plans });
  };

  render = () => (
    <div className="page">
      <div className="planSelector">
        <p>Please select a plan.</p>
        {this.state.plans}
      </div>
    </div>
  );
}

export default PlanSelector;
