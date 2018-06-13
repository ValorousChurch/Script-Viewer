import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { PCO } from '../utilities/pco';
import HeaderRow from './headerRow';
import ItemRow from './itemRow';

const planTemplates = {
  default: [
    {
      title: 'Side Screens',
      notes: ['Sides'],
    },
    {
      title: 'Center Screen',
      notes: ['Center'],
    },
    {
      title: 'Other',
      notes: ['Other', 'Source'],
    },
  ],
  audio: [
    {
      title: 'Side Screens',
      notes: ['Sides'],
    },
    {
      title: 'Audio',
      notes: ['Audio', 'Source'],
    },
  ],
  video: [
    {
      title: 'Side Screens',
      notes: ['Sides'],
    },
    {
      title: 'Center Screen',
      notes: ['Center'],
    },
    {
      title: 'Video',
      notes: ['Video', 'Source'],
    },
  ],
  lighting: [
    {
      title: 'Side Screens',
      notes: ['Sides'],
    },
    {
      title: 'Lighting',
      notes: ['Lighting'],
    },
  ],
  stage: [
    {
      title: 'Stage',
      notes: ['Stage'],
    },
  ],
};

class Plan extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  state = {};

  componentWillMount = async () => {
    const plan = await PCO.getPlan(
      this.props.match.params.serviceType,
      this.props.match.params.planId
    );
    const planItems = PCO.calculateTimes(await PCO.getPlanItems(plan));

    this.setState({
      planTemplate: planTemplates[this.props.match.params.type] || planTemplates.default,
      ...plan,
      planItems,
    });
  };

  componentWillReceiveProps = newProps => {
    this.setState({
      planTemplate: planTemplates[newProps.match.params.type] || planTemplates.default,
    });
  };

  render = () => {
    if (this.state.planId == null) return <p>loading...</p>;

    const version =
      this.state.planVersion === 'NONE'
        ? '** PLAN IS UNFINALIZED **'
        : `** INFORMATION ${this.state.planVersion} **`;
    const title =
      (this.state.planTitle !== null ? `${this.state.planTitle} - ` : '') + this.state.planDates;

    const items = this.state.planItems.map(item => {
      if (item.type === 'header') return <HeaderRow item={item} key={item.id} />;

      const plan = {
        planId: this.state.planId,
        planTemplate: this.state.planTemplate,
        serviceType: this.state.serviceType,
      };
      return <ItemRow item={item} key={item.id} plan={plan} />;
    });

    const templateLinks = Object.keys(planTemplates).map(template => (
      <NavLink
        activeClassName="active"
        exact
        key={template}
        style={{
          width: `calc(${100 / Object.keys(planTemplates).length}% - 10px)`,
        }}
        to={`/plan/${this.props.match.params.serviceType}/${this.props.match.params.planId}${
          template === 'default' ? '' : `/${template}`
        }`}
      >
        {template[0].toUpperCase() + template.substr(1)}
      </NavLink>
    ));

    return (
      <React.Fragment>
        <div className="page templateSelector">
          <p>Select the plan template you would like to view.</p>
          {templateLinks}
        </div>
        <div className="page">
          <header>
            <small>{version}</small>
            <br />
            <b>PRODUCTION SCRIPT: {title}</b>
          </header>
          <table>
            <thead>
              <tr>
                <th width="5%">Clock</th>
                <th width="5%">Time</th>
                <th width="45%" style={{ textAlign: 'left' }}>
                  Element
                </th>
                {this.state.planTemplate.map(col => (
                  <th key={col.title} width={`${45 / this.state.planTemplate.length}%`}>
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{items}</tbody>
          </table>
        </div>
      </React.Fragment>
    );
  };
}

export default Plan;
