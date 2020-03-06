import React from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Radio from '@material-ui/core/Radio';
import {KeyboardDatePicker} from "@material-ui/pickers";
import FormLabel from "@material-ui/core/FormLabel";
import Chip from '@material-ui/core/Chip';

class InputFactory {

  static definitions = {
    text: {
      Component: TextField
    },
    number: {
      Component: TextField
    },
    select: {
      Label: InputLabel,
      Component: Select,
      makeChild(key, entries) {
        return entries.map(([value, label]) => (<MenuItem key={`${key}-${value}`} value={value}>{label}</MenuItem>));
      }
    },
    chip: {
      Label: InputLabel,
      Component: Select,
      makeChild(key, entries) {
        return entries.map(([value, label]) => (<Chip key={`${key}-${value}`} value={value} label={label}/>));
      }
    },
    checkbox: {
      Component: Checkbox
    },
    radio: {
      Label: FormLabel,
      Component: RadioGroup,
      makeChild(key, entries) {
        return entries.map(([value, label]) => (
          <FormControlLabel key={`${key}-${value}`} value={value} control={<Radio/>} label={label}/>));
      }
    },
    date: {
      Component: KeyboardDatePicker,
      update(options) {
        let original = options.handleChange;
        options.handleChange = (date) => {
          return original({[options.section]: {[options.name]: date}});
        }
      }
    }
  };

  static update(options) {
    let original = options.handleChange;
    options.handleChange = (event) => {
      let {value} = event.target;
      return original({[options.section]: {[options.name]: value}});
    };
  }

  /**
   *
   * @param {string} type
   * @param {object} options
   * @returns {FormControl}
   */
  static create(type, options) {
    const {Label, Component, makeChild, update} = InputFactory.definitions[type];
    (update || InputFactory.update)(options);
    const {handleChange, id, name, label, attrs, values} = options;
    return (<FormControl key={id} fullWidth={true}>
      {label && Label && <Label>{label}</Label>}
      <Component onChange={handleChange} id={id} label={label} name={name} {...attrs}>
        {makeChild && values && makeChild(id, values)}
      </Component>
    </FormControl>)
  }
}

export default InputFactory;
