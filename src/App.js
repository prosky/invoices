import React, {Suspense} from 'react';
import InvoiceForm from './pages/InvoiceForm';
import Home from './pages/Home';
import logo from './logo.svg';
import LanguageSelector from "./components/LanguageSelector";
import './i18n';
import {useTranslation} from 'react-i18next';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import {AppBar, Button, Toolbar, useMediaQuery} from "@material-ui/core";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

function Navigation() {
  const {t} = useTranslation();
  return [
    <Button key="home" href="/">{t('nav.home')}</Button>,
    <Button key="invoice" href="/invoice">{t('nav.invoice')}</Button>
  ];
}

function App() {
  let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  prefersDarkMode = true;
  const theme = React.useMemo(
    () =>
      prefersDarkMode ?
        createMuiTheme({
          palette: {
            type: 'dark',
            primary: {
              main: '#54e6b3',
            },
            background: {
              paper: "#1d2026",
              default: "#1d2026"
            },
          },
          root: {
            background: {
              default: "#1d2026"
            },
          }
        }) :
        createMuiTheme({
          palette: {
            type: 'light',
            primary: {
              main: '#54e6b3',
            },
            background: {
              default: "#ccc"
            },
          },
        })
    ,
    [prefersDarkMode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Suspense fallback={null}>
        <div className="App">
          <BrowserRouter>
            <AppBar position="static">
              <Toolbar>
                <Link to="/">
                  <img src={logo} width="30" height="30" className="App-logo" alt="Logo"/>
                </Link>
                <Navigation/>
                <LanguageSelector/>
              </Toolbar>
            </AppBar>
            <Switch>
              <Route path="/invoice">
                <InvoiceForm/>
              </Route>
              <Route path="/">
                <Home/>
              </Route>
            </Switch>
          </BrowserRouter>
        </div>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
