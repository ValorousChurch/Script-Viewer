import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PCO } from '../utilities/pco';

const secToTime = sec => new Date(sec * 1000).toISOString().substr(14, 5);

class ItemRow extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    plan: PropTypes.object.isRequired,
  };
  state = { notes: {} };

  async componentWillMount() {
    this.setState({ notes: await PCO.getItemNotes(this.props.plan, this.props.item) });
  }

  render() {
    const length = secToTime(this.props.item.length);
    let description = this.state.notes.Vocals || '';
    if (this.props.item.details !== null) description += `<hr /> ${this.props.item.details}`;
    return (
      <tr>
        <td>{secToTime(this.props.item.clock)}</td>
        <td>{length}</td>
        <td style={{ textAlign: 'left' }}>
          <b>{this.props.item.title}</b>
          <br />
          {/* eslint-disable-next-line react/no-danger */}
          <span dangerouslySetInnerHTML={{ __html: description }} />
        </td>
        {this.props.plan.planTemplate.map(col => {
          const html = col.notes
            .map(
              noteTitle =>
                noteTitle === 'Source' && this.state.notes.Source
                  ? `<span class=source>${this.state.notes.Source}</span>`
                  : this.state.notes[noteTitle]
            )
            .reduce((o, c) => `${o ? `${o}<br />` : ''}${c || ''}`);
          /* eslint-disable-next-line react/no-danger */
          return <td className="note" key={col.title} dangerouslySetInnerHTML={{ __html: html }} />;
        })}
      </tr>
    );
  }
}

export default ItemRow;
