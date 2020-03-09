import React from 'react';
import {withTranslation} from 'react-i18next';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Storage from "../model/Storage";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import {Link} from "react-router-dom";
import {random} from "../utils";

class Home extends React.Component {

  storage = Storage;


  create(){

  };

  render() {
    return (
      <header className='py-5'>
        <Container>
          <h1>HOME</h1>
          <Grid container spacing={5} xs={12}>
            {this.storage.keys().map((key) => {
              let invoice = this.storage.load(key);
              console.log(key,invoice);
              return (<Grid item>
                <Link to={`/invoice/${invoice.id}`}>
                  <Card>
                    <CardActionArea>
                      <CardContent>
                        <Typography color="textPrimary" gutterBottom>
                          {invoice.number}
                        </Typography>
                        <Typography variant="h5" component="h2">
                          {invoice.date}
                        </Typography>
                        <Typography color="textSecondary">
                          {invoice.note}
                        </Typography>
                        <Typography variant="body2" component="p">
                          {invoice.created}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </Grid>)
            })}
          </Grid>
        </Container>
      </header>
    )
  };
}

export default withTranslation()(Home);
