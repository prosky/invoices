import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {withTranslation} from 'react-i18next';

import IconButton from '@material-ui/core/IconButton';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import {TableFooter} from "@material-ui/core";
/*ICONS*/
import CloseIcon from '@material-ui/icons/Close';
import PlusIcon from '@material-ui/icons/Add';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {random} from "../utils";


const getInputs = (values) => {
  //const vat = values.invoice.type === 'vat';
  return [
    ['description', 'text', {required: true}],
    ['count', 'number', {required: true, min: 1}],
    ['unit', 'text', {}],
    ['vat', 'select', {required: true}, ['vat', 'non_vat']],
    ['price', 'text', {required: true}],
    ['price_sum', 'text', {required: true}],
  ].filter(Boolean)
};

class ItemRow extends React.Component {

  index;
  vats = [0, 0.21, 0.15, 0.10];

  constructor(props) {
    super(props);
    this.index = props.index;
    this.values = props.values;
    this.state = this.values;
  }

  change = (event) => {
    const {name, value} = event.target;
    this.values[name] = value;
    this.values.price_sum = this.values.count * this.values.price;
    this.setState(this.values);
    this.props.onChange(name, value);
  };

  delete = (event) => {
    this.props.onDelete(this.index);
  };

  render() {
    const {t} = this.props;
    return (<TableRow key={this.index}>
      <TableCell  key='description' align="right">
        <Input value={this.values.description} name='description' onChange={this.change}
               inputProps={{'aria-label': t(`items.description`)}}/>
      </TableCell>
      <TableCell   key='count' align="right">
        <Input value={this.values.count} type="number"
               name='count' onChange={this.change}
               inputProps={{'min': 1, 'aria-label': t(`items.count`)}}/>
      </TableCell>
      <TableCell  key='unit' align="right">
        <Input value={this.values.unit} name='unit' onChange={this.change}
               inputProps={{'aria-label': t(`items.unit`)}}/>
      </TableCell>
      <TableCell  key='vat' align="right">
        <Select
          name='vat'
          displayEmpty
          value={this.values.vat}
          onChange={this.change}>
          {this.vats.map((value) => <MenuItem key={value} value={value}>{(value * 100).toFixed(0)} %</MenuItem>)}
        </Select>
      </TableCell>
      <TableCell  key='price' align="right">
        <Input value={this.values.price} name={'price'} onChange={this.change}
               inputProps={{'aria-label': t(`items.price`)}}/>
      </TableCell>
      <TableCell  key='price_sum' align="right">
        <Input disabled value={this.values.price_sum} name={'price_sum'} onChange={this.change}
               inputProps={{'aria-label': t(`items.price_sum`)}}/>
      </TableCell>
      <TableCell  key='delete' align="right">
        <IconButton onClick={this.delete} color="primary" aria-label={t('delete')} title={t('delete')} component="span">
          <CloseIcon/>
        </IconButton>
      </TableCell>
    </TableRow>);
  }
}

const Item = withTranslation()(ItemRow);

const Sum = (params) => {
  const [value, onChange] = React.useState(params.value);
  params.onChange((value) => onChange(value));
  return (<span>{value}</span>);
};

class ItemList extends React.Component {

  /**
   * @property {Set} items
   */
  items;


  state = {
    items: {},
    sum: 0
  };

  constructor(props) {
    super(props);
    this.items = props.items;
    if (Object.keys(this.items).length === 0) {
      this.items[random()] = this.createRow();
    }
    this.state.items = this.items;
    let sum, vat;
    Object.assign(this.state, {
      sum: sum = this.sum(),
      vat: vat = this.vat(),
      sumVat: sum + vat
    });
  }

  createRow() {
    return {
      description: '',
      count: 1,
      unit: '',
      vat: 0,
      price: 0,
      price_vat: 0,
    };
  }

  add = () => {
    this.items[random()] = this.createRow();
    this.setState({items: this.items});
  };

  onDelete = (index, value) => {
    delete this.items[index];
    this.setState({items: this.items});
  };

  onChange = (name, value) => {
    let sum, vat;
    this.setState({
      sum: sum = this.sum(),
      vat: vat = this.vat(),
      sumVat: sum + vat
    });
    this.props.onChange(this.state);
  };

  vat = () => Object.values(this.items).map(({price, count, vat}) => Number(price) * Number(count) * Number(vat)).reduce((total, num) => total + num);
  sum = () => Object.values(this.items).map(({price, count, vat}) => Number(price) * Number(count)).reduce((total, num) => total + num);

  render() {
    const columns = getInputs(this.props.values);
    const money = new Intl.NumberFormat('cs-CZ', {style: 'currency', currency: this.props.values.options.currency});
    const {t} = this.props;
    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map(([item]) => (<TableCell key={item}>{t(`items.${item}`)}</TableCell>))}
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(this.items).map(([index, row]) => (
              <Item key={index} index={index} columns={columns} values={row} onDelete={this.onDelete}
                    onChange={this.onChange}/>))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell align="right" colSpan='100%'>
                <Button variant="text" color="primary" startIcon={<PlusIcon/>} onClick={this.add}>
                  {t('items.add')}
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <Typography align='right' component="div">
          <Typography variant="h5" component="div">{t('summary.sum')}: {money.format(this.state.sum || 0)}</Typography>
          <Typography variant="h5" component="div">{t('summary.vat')}: {money.format(this.state.vat || 0)}</Typography>
          <Typography color="primary" variant="h4"
                      component="div">{t('summary.sum_vat')}: {money.format(this.state.sumVat || 0)}</Typography>
        </Typography>
      </TableContainer>
    );
  }
}


export default withTranslation()(ItemList);
