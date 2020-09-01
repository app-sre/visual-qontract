import React from "react";
import PropTypes from "prop-types";
import CreatableSelect from 'react-select/creatable';
import {components} from "react-select";
import {RED, GREY} from "./ColourStyles.js";

const Select = props => {
  if (props.allowSelectAll) {
    return (
      <CreatableSelect
        {...props}
        options={[props.allOption, ...props.options]}
        onChange={(selected, event) => {
          if (selected !== null && selected.length > 0) {
            if (selected[selected.length - 1].value === props.allOption.value) {
              return props.onChange([props.allOption, ...props.options.filter(option => option.color !== GREY)]);
            }
            let result = [];
            if (selected.length === props.options.filter(option => option.color !== GREY).length) {
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

const SelectService = props => {
  return (
    <CreatableSelect
      {...props}
      options={[props.allServiceOption, ...props.options]}
      onChange={(selected, event) => {
        if (selected !== null && selected.length > 0) {
          if (selected[selected.length - 1].value === props.allServiceOption.value) {
            return props.onChange([props.allServiceOption, ...props.options.filter(option => option.color !== GREY)]);
          }
          let result = [];
          if (selected.length === props.options.filter(option => option.color !== GREY).length) {
            if (selected.includes(props.allServiceOption)) {
              result = selected.filter(
                option => option.value !== props.allServiceOption.value
              );
            } else if (event.action === "select-option") {
              result = [props.allServiceOption, ...props.options];
            }
            return props.onChange(result);
          }
        }

        return props.onChange(selected);
      }}
    />
  );
};

SelectService.defaultProps = {
  allServiceOption: {
    label: "Select all affected services",
    value: "**"
  }
};

const SelectRecepient = props => {
  return (
    <CreatableSelect
      {...props}
      options={[props.allOption, props.allEmailOption, props.allSlackOption, ...props.options]}
      onChange={(selected, event) => {
        if (selected !== null && selected.length > 0) {
          if (selected[selected.length - 1].value === props.allOption.value) {
            return props.onChange([props.allOption, props.allEmailOption, props.allSlackOption, ...props.options]);
          }
          if (selected[selected.length - 1].value === props.allEmailOption.value) {
            return props.onChange([props.allEmailOption, ...props.options.filter(option => option.contact === "Email")]);
          }
          if (selected[selected.length - 1].value === props.allSlackOption.value) {
            return props.onChange([props.allSlackOption, ...props.options.filter(option => option.contact === "Slack")]);
          }
          let result = [];
          if (selected.length === props.options.filter(option => option.contact !== "Email").length) {
            if (selected.includes(props.allEmailOption)) {
              result = selected.filter(
                option => option.value !== props.allEmailOption.value
              );
            } else if (event.action === "select-option") {
              result = [props.allEmailOption, ...props.options];
            }
            return props.onChange(result);
          }
          if (selected.length === props.options.filter(option => option.contact !== "Slack").length) {
            if (selected.includes(props.allSlackOption)) {
              result = selected.filter(
                option => option.value !== props.allSlackOption.value
              );
            } else if (event.action === "select-option") {
              result = [props.allSlackOption, ...props.options];
            }
            return props.onChange(result);
          }
        }

        return props.onChange(selected);
      }}
    />
  );
};

SelectRecepient.defaultProps = {
  allOption: {
    label: "Select all affected recepients - Email + Slack",
    value: "**",
    contact: "Email + Slack"
  },
  allEmailOption: {
    label: "Select all affected recepients - Email",
    value: "***",
    contact: "Email"
  },
  allSlackOption: {
    label: "Select all affected recepients - Slack",
    value: "****",
    contact: "Slack"
  }
};

export {Select, SelectService, SelectRecepient, Option, MultiValue};
