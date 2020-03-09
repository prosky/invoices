import React from 'react';
import Storage from "../model/Storage";
import {random} from "../utils";
import Container from "@material-ui/core/Container";
import InvoiceForm from "../components/InvoiceForm";
import {Redirect} from "react-router-dom";
import {withTranslation} from "react-i18next";

class Invoice extends React.Component {

  storage = Storage;

  invoice = null;

  constructor(params) {
    super(params);
    this.id = params.match.params.id;
    if (this.id) {
      this.invoice = this.storage.load(this.id);
    }
  }

  load() {
    return this.storage.load(this.id);
  }

  save(values) {
    this.storage.save(this.id, values);
  }

  onChange = (values) => {
    this.save(values);
  };

  render() {
    if (this.invoice) {
      return [
        <header className='py-5'>
          <Container>
            <h1>Invoice</h1>
          </Container>
        </header>,
        <InvoiceForm values={this.invoice} onChange={this.onChange}/>
      ];
    }
    return <Redirect to={`/`} push={true}/>;
  }
}

export default withTranslation()(Invoice);
