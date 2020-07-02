import React from "react";
import PropTypes from "prop-types";
import CreatableSelect from 'react-select/creatable';
import {components} from "react-select";

const Select = props => {
  if (props.allowSelectAll) {
    return (
      <CreatableSelect
        {...props}
        options={[props.allOption, ...props.options]}
        onChange={(selected, event) => {
          if (selected !== null && selected.length > 0) {
            if (selected[selected.length - 1].value === props.allOption.value) {
              // console.log("...props.options.filter(word => word.color !== '#363636').length: " + props.options.filter(word => word.color !== '#363636').length);
              return props.onChange([props.allOption, ...props.options.filter(word => word.color !== '#363636')]);
            }
            let result = [];
            if (selected.length === props.options.filter(word => word.color !== '#363636').length) {
              if (selected.includes(props.allOption)) {
                result = selected.filter(
                  option => option.value !== props.allOption.value
                );
              } else if (event.action === "select-option") {
                result = [props.allOption, ...props.options];
              }
              return props.onChange(result);
            }
          }

          return props.onChange(selected);
        }}
      />
    );
  }

  return <CreatableSelect {...props} />;
};

Select.propTypes = {
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  allowSelectAll: PropTypes.bool,
  allOption: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
    contact: PropTypes.string,
  })
};

Select.defaultProps = {
  allOption: {
    label: "Select all affected",
    value: "*",
    contact: "Email",
  }
};

const Option = props => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        {props.label}
      </components.Option>
    </div>
  );
};

const MultiValue = props => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);

// export default Select;
export {Select, Option, MultiValue};
