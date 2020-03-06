import React from 'react';
import {withTranslation} from 'react-i18next';
import Container from "@material-ui/core/Container";

class Home extends React.Component {

  render() {
    return (
        <header className='py-5'>
          <Container>
            <h1>HOME</h1>
          </Container>
        </header>
    )
  };
}

export default withTranslation()(Home);
