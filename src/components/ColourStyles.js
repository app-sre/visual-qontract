import chroma from 'chroma-js';

const ColourStyles = {
  control: styles => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    
    if (data.color) {
      var color = chroma(data.color);
    } else {
      var color = chroma('#363636');
    }
    
    return {
      ...styles,
      color: 
        isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
        ? "white"
        : "black"
        : data.color
    };
  },
  multiValue: (styles, { data }) => {
    if (data.color) {
      var color = chroma(data.color);
    } else {
      var color = chroma('#363636');
    }
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css()
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ":hover": {
      backgroundColor: data.color,
      color: "white"
    }
  })
};

const RED = chroma('#DE350B');
const GREY = chroma('#363636');

export {ColourStyles, RED, GREY};
