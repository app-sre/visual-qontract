import chroma from 'chroma-js';

const RED = chroma('#DE350B');
const GREY = chroma('#363636');
const BLUE = chroma('#06c');

const ColourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isSelected }) => {
    let color = data.color || GREY;
    const selectedColor = chroma.contrast(color, 'white') > 2 ? 'white' : 'black';
    color = isSelected ? selectedColor : color.hex();

    return {
      // define option color
      ...styles,
      color: isDisabled ? '#ccc' : color
    };
  },
  multiValue: (styles, { data }) => {
    const color = data.color || GREY;

    return {
      // define selected options label background color
      ...styles,
      backgroundColor: color.alpha(0.1).css()
    };
  },
  multiValueLabel: (styles, { data }) => {
    const color = data.color || GREY;

    return {
      // define selected options label color
      ...styles,
      color: color.hex()
    };
  },
  multiValueRemove: (styles, { data }) => {
    const color = data.color || GREY;

    return {
      // define selected options remove label color
      ...styles,
      color: color.hex(),
      ':hover': {
        backgroundColor: color.hex(),
        color: 'white'
      }
    };
  }
};

export { ColourStyles, RED, GREY, BLUE };
