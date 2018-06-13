import React from 'react';
import PropTypes from 'prop-types';

const HeaderRow = props => (
  <tr>
    <td className="header" colSpan="2" />
    <td className="header">{props.item.title}</td>
    <td className="header" colSpan="3" />
  </tr>
);

HeaderRow.propTypes = {
  item: PropTypes.object.isRequired,
};

export default HeaderRow;
