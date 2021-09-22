import React from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';
import { GREY, BLUE } from './ColourStyles';

const SelectAffected = props => {
  const { allowSelectAll } = props;

  if (allowSelectAll) {
    return (
      <CreatableSelect
        {...props}
        options={[props.allOption, ...props.options]}
        onChange={(selected, event) => {
          if (selected !== null && selected.length > 0) {
            if (event.action == 'select-option') {
              if (selected[selected.length - 1].value === props.allOption.value) {
                const otherSelected = selected.filter(
                  option => option.value !== props.allOption.value && option.color !== BLUE
                );
                return props.onChange([
                  props.allOption,
                  ...props.options.filter(option => option.color !== GREY),
                  ...otherSelected
                ]);
              }
            }
            if (event.action === 'deselect-option' && event.option.value === props.allOption.value) {
              const otherSelected = selected.filter(
                option => (option.value !== props.allOption.value) & (option.color !== BLUE)
              );
              return props.onChange([...otherSelected]);
            }
          }
          return props.onChange(selected);
        }}
      />
    );
  }

  return <CreatableSelect {...props} />;
};

SelectAffected.propTypes = {
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  allowSelectAll: PropTypes.bool,
  allOption: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
    contact: PropTypes.string
  })
};

SelectAffected.defaultProps = {
  allOption: {
    label: 'Select all affected',
    value: '*'
  }
};

const Option = props => (
  <div>
    <components.Option {...props}>
      <input type="checkbox" checked={props.isSelected} onChange={() => null} /> {props.label}
    </components.Option>
  </div>
);

const MultiValue = props => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);

export { SelectAffected, Option, MultiValue };
