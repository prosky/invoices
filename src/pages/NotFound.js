import React from 'react';
import {withTranslation} from 'react-i18next';
import Container from "@material-ui/core/Container";

class NotFound extends React.Component {

  render() {
    let {t} = this.props;
    return (
      <header className='py-5'>
        <Container>
          <h1>{t('not_fount.title')}</h1>
        </Container>
      </header>
    )
  };
}

export default withTranslation()(NotFound);
