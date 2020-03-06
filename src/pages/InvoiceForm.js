import React from 'react';
import {withTranslation} from 'react-i18next';
import InputFactory from "../forms/InputFactory";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {Button, Container, Grid,} from "@material-ui/core";
import {MuiPickersUtilsProvider} from '@material-ui/pickers';

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
  };

  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      ...this.defaultValues
    };
  }


  handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() !== false) {
      console.log(this.state.values);
      this.setState({validated: true});
    } else {
      console.log('invalid', this.state.values);
    }
    event.preventDefault();
    event.stopPropagation();
  };

  handleChange = (value) => {
    console.log(value);
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState(value);
    }, 500);
  };

  render() {
    //console.log(getInputs(this.values));
    const {t} = this.props;
    return (
      <Container>
        <header className="py-5">
          <h1>{t('invoice.header.title')}</h1>
        </header>
        <div className="InvoiceForm">
          <form noValidate onSubmit={this.handleSubmit}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container spacing={2}>
                {Object.entries(getInputs(this.state)).map(([section, inputs]) => (
                  <Grid key={section} item xs={12} md={6}>
                    {inputs.map(([name, type, attrs, values]) => (
                      InputFactory.create(type,
                        {
                          handleChange: this.handleChange,
                          section: section,
                          id: `invoice-form-${section}-${name}`,
                          name,
                          label: t(`invoice.${name}`),
                          attrs: {...attrs, value: this.state[section]?.[name]},
                          values: values && values.map((value) => [value, t(`invoice.${name}_values.${value}`)])
                        })
                    ))}
                  </Grid>))}
              </Grid>

            </MuiPickersUtilsProvider>
          </form>
        </div>
      </Container>
    )
  };
}

export default withTranslation()(InvoiceForm);
