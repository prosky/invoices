import React from 'react';
import {withTranslation} from 'react-i18next';
import {Breadcrumbs, Link, Typography} from "@material-ui/core";

class LanguageSelector extends React.Component {

  constructor(props) {
    super(props);
    this.i18n = props.i18n;
    this.languages = Array.from(this.i18n.languages);
  }

  changeLanguage = (language) => {
    this.i18n.changeLanguage(language).catch((err) => {
      console.error(err);
    });
  };

  render() {
    return (
      <Breadcrumbs aria-label="breadcrumb">
        {this.languages.map((language) => (
          this.i18n.language === language ?
            <Typography key={language} color="textSecondary">{language.toUpperCase()}</Typography> :
            <Link key={language} color="textPrimary" onClick={() => this.changeLanguage(language)}> {language.toUpperCase()} </Link>
        ))}
      </Breadcrumbs>
    )
  }
}

export default withTranslation()(LanguageSelector);
