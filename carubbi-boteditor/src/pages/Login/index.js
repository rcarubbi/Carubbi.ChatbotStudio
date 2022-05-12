import React, { useEffect, useState, useRef } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import NotificationImportant from "@material-ui/icons/NotificationImportant";
// core components
import GridContainer from "../../components/material-kit/Grid/GridContainer.js";
import GridItem from "../../components/material-kit/Grid/GridItem.js";
import Button from "../../components/material-kit/CustomButtons/Button.js";
import Card from "../../components/material-kit/Card/Card.js";
import CardBody from "../../components/material-kit/Card/CardBody.js";
import CardHeader from "../../components/material-kit/Card/CardHeader.js";
import CardFooter from "../../components/material-kit/Card/CardFooter.js";
import CustomInput from "../../components/material-kit/CustomInput/CustomInput.js";
import Snackbar from "../../components/material-dashboard/Snackbar/Snackbar";


import api from "../../services/api";
import { login } from "../../services/auth";

import styles from "../../assets/material-kit/jss/material-kit-react/views/loginPage";

import "../../assets//material-kit/scss/material-kit-react.scss";

import image from "../../assets/material-kit/img/bg7.jpg";

const useStyles = makeStyles(styles);

function LoginPage(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [loading, setLoading] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [toasterOpened, setToasterOpened] = useState(false);
  const [toasterMessage, setToasterMessage] = React.useState({
    message: "",
    color: "success"
  });

  let toasterHandler = useRef(null);

  const showError = message => {
    setToasterMessage({ color: "danger", message });
    setToasterOpened(true);
  };
  const handleUsernameChanged = e => {
    setUsername(e.target.value);
  };
  const handlePasswordChanged = e => {
    setPassword(e.target.value);
  };

  const handleAuthenticateButtonClick = async e => {
    e.preventDefault();
    setLoading(true);
    if (!username || !password) {
      showError("Preencha e-mail e senha para continuar!");
      setLoading(false);
    } else {
      try {
        const params = new URLSearchParams();
        params.append("username", username);
        params.append("password", password);
        params.append("client_id", process.env.REACT_APP_CLIENT_ID);
        params.append("grant_type", "password");
        params.append("client_secret", process.env.REACT_APP_CLIENT_SECRET);
        const response = await api.post("/token", params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });

        login(response.data.access_token);

        props.history.push("/admin");
      } catch (err) {
        if (Axios.isCancel(toasterMessage.message)) {
          // request cancelled
        } else {
          showError(
            "Houve um problema com o login, verifique suas credenciais"
          );
        }
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (toasterOpened) {
      toasterHandler.current = setTimeout(() => {
        setToasterOpened(false);
      }, 3000);
    }

    return function cleanUp() {
      if (toasterHandler && toasterHandler.current) {
        clearTimeout(toasterHandler.current);
      }
    };
  }, [toasterOpened]);

  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
 
  return (
    <div>
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>
                      Carubbi <br />
                      Chatbot Studio
                    </h4>
                    <div className={classes.socialLine}></div>
                  </CardHeader>
                  <p className={classes.divider}>Login</p>
                  <CardBody>
                    <CustomInput
                      labelText="Nome de usuário..."
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "email",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        onChange: handleUsernameChanged,
                        value: username
                      }}
                    />
                    <CustomInput
                      labelText="Senha"
                      id="pass"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                        onChange: handlePasswordChanged,
                        value: password
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button
                      simple
                      color="primary"
                      size="lg"
                      disabled={loading}
                      onClick={handleAuthenticateButtonClick}
                    >
                      {!loading ? (
                        "Autenticar"
                      ) : (
                        <>
                          <i className="fa fa-cog fa-spin" />
                          &nbsp;Carregando
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              <Snackbar
                place="bc"
                color="danger"
                icon={NotificationImportant}
                message={toasterMessage.message}
                open={toasterOpened}
                closeNotification={() => setToasterOpened(false)}
                close
                onMouseEnter={() => {
                  clearTimeout(toasterHandler.current);
                }}
                onMouseLeave={() => {
                  toasterHandler.current = setTimeout(() => {
                    setToasterOpened(false);
                  }, 3000);
                }}
              />
            </GridItem>
          </GridContainer>
        </div>
        {/* <Footer whiteFont /> */}
      </div>
    </div>
  );
}

export default withRouter(LoginPage);
