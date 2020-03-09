
import 'date-fns';
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
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import FormLabel from "@material-ui/core/FormLabel";
import Chip from '@material-ui/core/Chip';
import DateFnsUtils from '@date-io/date-fns';

const DatePicker = (params) => {
  const [selectedDate, setSelectedDate] = React.useState(params.value);
  const handleChange = (date) => {
    setSelectedDate(date);
    params.onChange(date);
  };
  return (<MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardDatePicker {...params}  value={selectedDate} onChange={handleChange}/>
  </MuiPickersUtilsProvider>);
};

class InputFactory {

  definitions = {
    text: {
      Component: TextField
    },
    number: {
      Component: TextField
    },
    checkbox: {
      Component: Checkbox
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
    radio: {
      Label: FormLabel,
      Component: RadioGroup,
      makeChild(key, entries) {
        return entries.map(([value, label]) => (
          <FormControlLabel key={`${key}-${value}`} value={value} control={<Radio/>} label={label}/>));
      }
    },
    date: {
      Component: DatePicker,
      update(options) {
        let original = options.handleChange;
        options.handleChange = (date) => {
          return original({[options.section]: {[options.name]: date}});
        };
        return options;
      }
    }
  };

  defaults = {
    update(options) {
      let original = options.handleChange;
      options.handleChange = (event) => {
        let {value} = event.target;
        return original({[options.section]: {[options.name]: value}});
      };
      return options;
    },
  };

  constructor() {
    for (const key in this.definitions) {
      this.definitions[key] = Object.assign({}, this.defaults, this.definitions[key]);
    }
  }

  /**
   *
   * @param {string} type
   * @param {object} options
   * @returns {FormControl}
   */
  create(type, options) {
    const {Label, Component, makeChild, update} = this.definitions[type];
    const {handleChange, id, name, label, attrs, values} = update(options);
    return (<FormControl key={id} fullWidth={true}>
      {label && Label && <Label>{label}</Label>}
      <Component onChange={handleChange} id={id} label={label} name={name} {...attrs}>
        {makeChild && values && makeChild(id, values)}
      </Component>
    </FormControl>)
  }
}

export default new InputFactory();
