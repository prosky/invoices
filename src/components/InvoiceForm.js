import React from 'react';
import {withTranslation} from 'react-i18next';
import inputFactory from "../forms/InputFactory";
import {Container, Grid,} from "@material-ui/core";
import ItemList from "../components/ItemList";

const getInputs = (values) => {
  const vat = values.invoice.type === 'vat';
  return {
    invoice: [
      ['type', 'select', {
        required: true,
      }, ['vat', 'non_vat']],
      ['number', 'text', {
        required: true
      }],
      ['date', 'date', {
        variant: 'inline',
        format: "d. M. yyyy",
        required: true
      }],
      ['maturity', 'date', {
        variant: 'inline',
        format: "d. M. yyyy",
        required: true
      }],
    ],
    options: [
      ['currency', 'select', {
        required: true,
      }, ['czk', 'eur']],
      vat && ['vat', 'radio', {
        required: true,
        row: true,
      }, ['with', 'without']],
    ].filter(Boolean),

    supplier: [
      ['id', 'text', {required: true}],
      vat && ['did', 'text', {required: true}],
      ['company', 'text', {required: true}],

      //['mobile', 'text'],
      //['fax', 'text'],
      //['email', 'text'],

      ['city', 'text', {required: true}],
      ['street', 'text', {required: true}],
      ['zip', 'text', {required: true}],
      ['country', 'text', {required: true}]
    ].filter(Boolean),
    buyer: [
      ['id', 'text', {required: true}],
      vat && ['did', 'text', {required: true}],
      ['company', 'text', {required: true}],


      //['zip', 'text'],
      //['mobile', 'text'],
      //['fax', 'text'],
      //['email', 'text'],

      ['city', 'text', {required: true}],
      ['street', 'text', {required: true}],
      ['zip', 'text', {required: true}],
      ['country', 'text', {required: true}]
    ].filter(Boolean),
    payment: [
      ['account_number', 'number'],
      ['variable_symbol', 'text'],
      ['constant_symbol', 'text'],
      ['payment_method', 'select', {
        required: true,
      }, ['cash', 'bank', 'credit', 'office']],
    ],
  }
};


class InvoiceForm extends React.Component {

  values = {};

  defaultValues = {
    invoice: {
      type: 'non_vat',
      date: new Date(),
    },
    payment: {
      payment_method: 'bank',
    },
    options: {
      vat: 'without',
      currency: 'czk'
    },
    items: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      validated: false,
    };
    Object.assign(this.values, this.defaultValues, props.values);
  }

  handleChange = (value) => {
    Object.assign(this.values, value);
    this.props.onChange(this.values);
  };

  handleChangeItems = (value) => {
    Object.assign(this.values, value);
    this.props.onChange(this.values);
  };


  render() {
    //console.log(getInputs(this.values));
    const {t} = this.props;
    return (
      <Container maxWidth={false}>
        <header className="py-5">
          <h1>{t('invoice.header.title')}</h1>
        </header>
        <div className="InvoiceForm">
          <Grid container spacing={2}>
            <Grid container item spacing={2} xs={12} md={6}>
              {Object.entries(getInputs(this.values)).map(([section, inputs]) => (
                <Grid key={section} item xs={12} md={6}>
                  {inputs.map(([name, type, attrs, values]) => (
                    inputFactory.create(type,
                      {
                        handleChange: this.handleChange,
                        section: section,
                        id: `invoice-form-${section}-${name}`,
                        name,
                        label: t(`invoice.${name}`),
                        attrs: {...attrs, value: this.values[section]?.[name]},
                        values: values && values.map((value) => [value, t(`invoice.${name}_values.${value}`)])
                      })
                  ))}
                </Grid>))}
            </Grid>
            <Grid item xs={12} md={6}>
              <h2>{t(`items.header`)}</h2>
              <ItemList values={this.values} items={this.values.items} onChange={this.handleChangeItems}/>
            </Grid>
          </Grid>
        </div>
      </Container>
    )
  };
}

export default withTranslation()(InvoiceForm);
