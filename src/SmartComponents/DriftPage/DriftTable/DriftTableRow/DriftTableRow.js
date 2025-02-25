import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';

import StateIcon from '../../../StateIcon/StateIcon';
import RowFact from './RowFact';

function DriftTableRow(props) {
    const { expandedRows, expandRow, fact, masterList, referenceId, stateSort, type } = props;

    const findSystem = (systems, id) => {
        return systems.find(system => system.id === id);
    };

    const renderState = () => {
        return <td className='fact-state sticky-column fixed-column-2'>
            <StateIcon fact={ fact } stateSort={ stateSort ? stateSort : null } />
        </td>;
    };

    const createClassname = (system) => {
        let className = [ 'comparison-cell' ];

        if (system?.is_obfuscated) {
            className.push('obfuscated');
        }

        if (referenceId && system?.state === 'DIFFERENT') {
            className.push('highlight');
            className.push('different-fact-cell');
        } else if (!referenceId && fact.state === 'DIFFERENT') {
            className.push('highlight');
        }

        return className;
    };

    const createCells = () => {
        let cell = [];
        let system;

        for (let i = 0; i < masterList.length; i++) {
            if (fact.systems) {
                system = findSystem(fact.systems, masterList[i].id);
            }

            let className = createClassname(system);

            cell.push(<td className={ className.join(' ') }>
                { system?.value === null ? 'No Data' : system?.value }
                { system?.is_obfuscated ?
                    <span
                        style={{ float: 'right' }}
                    >
                        <Tooltip
                            position='top'
                            content={ <div>This data has been redacted from the insights-client upload.</div> }
                        >
                            <LockIcon color="#737679"/>
                        </Tooltip>
                    </span> : ''
                }
            </td>);
        }

        return cell;
    };

    const createRow = () => {
        let row = [];

        row.push(<RowFact expandedRows={ expandedRows } expandRow={ expandRow } factName={ fact.name } type={ type } />);
        row.push(renderState());

        row = row.concat(createCells());
        return row;
    };

    return (
        <tr
            data-ouia-component-type='PF4/TableRow'
            data-ouia-component-id={ 'comparison-table-row-' + fact.name }
            className={ fact.state === 'DIFFERENT' || fact.state === 'INCOMPLETE_DATA_OBFUSCATED' ? 'unexpected-row' : '' }>
            { createRow() }
        </tr>
    );
}

DriftTableRow.propTypes = {
    expandedRows: PropTypes.array,
    expandRow: PropTypes.func,
    fact: PropTypes.object,
    masterList: PropTypes.array,
    referenceId: PropTypes.string,
    stateSort: PropTypes.string,
    type: PropTypes.string
};

export default DriftTableRow;
