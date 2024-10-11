import React, { useEffect, useState, useCallback, useRef } from "react";
import { withRouter } from "react-router";
// nodejs library to set properties for components

import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import Close from "@material-ui/icons/Close";
import AddCircle from "@material-ui/icons/AddCircle";
import Publish from "@material-ui/icons/Publish";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import NotificationImportant from "@material-ui/icons/NotificationImportant";

// core components
import GridItem from "../../components/material-dashboard/Grid/GridItem.jsx";
import GridContainer from "../../components/material-dashboard/Grid/GridContainer.jsx";
import Table from "../../components/material-dashboard/Table/Table.jsx";
import Card from "../../components/material-dashboard/Card/Card.jsx";
import CardHeader from "../../components/material-dashboard/Card/CardHeader.jsx";
import CardBody from "../../components/material-dashboard/Card/CardBody.jsx";
import Button from "../../components/material-kit/CustomButtons/Button.js";
import api from "../../services/api";
import styles from "./styles.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Snackbar from "../../components/material-dashboard/Snackbar/Snackbar";

import materialKitStyles from "../../assets/material-kit/jss/material-kit-react/views/componentsSections/javascriptStyles.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

const bundleStyles = {
  ...materialKitStyles,
  ...styles
};

function BotsPage(props) {
  const { classes } = props;
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listBots, setListBots] = useState(true);
  const [deleteConfirmationOpened, setDeleteConfirmationOpened] = useState(
    false
  );
  const [botToDelete, setBotToDelete] = useState({});
  const [toasterOpened, setToasterOpened] = useState(false);
  const [toasterMessage, setToasterMessage] = React.useState({
    Message: "",
    Color: "success"
  });
  let toasterHandler = useRef(null);
  const handleNewBotButtonClick = () => {
    props.history.push("/admin/builder");
  };

  const handleEdit = useCallback(
    e => {
      props.history.push("/admin/builder", {
        id: e.currentTarget.dataset.id
      });
    },
    [props.history]
  );
  const handleDelete = useCallback(e => {
    setBotToDelete({ ...e.currentTarget.dataset });
    setDeleteConfirmationOpened(true);
  }, []);

  const handlePublish = useCallback(
    async e => {
      try {
        setLoading(true);
        await api.patch("/api/bot/publish", {
          id: e.currentTarget.dataset.id
        });
        setListBots(true);
        setToasterMessage({
          Message: "Bot published!",
          Color: "success"
        });
      } catch (err) {
        setToasterMessage({
          Message: `Error publishing bot: ${err.response.data.Message || err.message}`,
          Color: "danger"
        });
      } finally {
        setToasterOpened(true);
        setLoading(false);
      }
    },
    [setListBots]
  );

  const handleConfirmDelete = useCallback(
    async e => {
      try {
        setDeleteConfirmationOpened(false);
        setLoading(true);

        await api.patch("/api/bot/deactivate", {
          id: botToDelete.id
        });

        setListBots(true);

        setToasterMessage({
          Message: "Bot deleted!",
          Color: "success"
        });
      } catch (err) {
        setToasterMessage({
          Message: `Error deleting bot: ${err.response.data.Message || err.message}`,
          Color: "danger"
        });
      } finally {
        setToasterOpened(true);
      }
    },
    [botToDelete]
  );

  const botRow = useCallback(
    item => [
      item.Name,
      item.Published,
      {
        align: "right",
        text: (
          <div key={item.Id}>
            <Button
              data-id={item.Id}
              simple
              color="primary"
              onClick={handlePublish}
            >
              <Publish />
            </Button>
            <Button
              data-id={item.Id}
              simple
              color="primary"
              onClick={handleEdit}
            >
              <Edit />
            </Button>
            ,
            <Button
              simple
              color="primary"
              data-name={item.Name}
              data-id={item.Id}
              onClick={handleDelete}
            >
              <Delete />
            </Button>
          </div>
        )
      }
    ],
    [handleEdit, handlePublish, handleDelete]
  );

  const fetchData = useCallback(async () => {
    if (!listBots) return;
    try {
      setLoading(true);
      const response = await api.get("api/bot");
      const bots = response.data.map(botRow);
      setBots(bots);
    } catch (err) {
      setToasterMessage({
        Message: `Error listing bots: ${err.message}`,
        Color: "danger"
      });
      setToasterOpened(true);
    } finally {
      setLoading(false);
      setListBots(false);
    }
    
  }, [botRow, listBots]);

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

  useEffect(() => {
    fetchData();
  }, [fetchData, listBots]);

  return (
    <GridContainer justifyContent="flex-end">
      <GridItem xs={12} sm={12} md={12}>
        <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal
          }}
          open={deleteConfirmationOpened}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setDeleteConfirmationOpened(false)}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <IconButton
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => setDeleteConfirmationOpened(false)}
            >
              <Close className={classes.modalClose} />
            </IconButton>
            <h4 className={classes.modalTitle}>Confirm delete</h4>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={classes.modalBody}
          >
            <p>Are you sure you want to delete bot {botToDelete.name}?</p>
          </DialogContent>
          <DialogActions className={classes.modalFooter}>
            <Button color="transparent" simple onClick={handleConfirmDelete}>
              Yes
            </Button>
            <Button
              onClick={() => setDeleteConfirmationOpened(false)}
              color="danger"
              simple
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Chatbots</h4>
            <p className={classes.cardCategoryWhite}>
              Create or edit existing chat bots
            </p>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className={classes.loading}>
                <i className="fa fa-cog fa-spin" />
                &nbsp;Loading
              </div>
            ) : (
              <Table
                height="40vh"
                className={classes.botsTable}
                tableHeaderColor="primary"
                tableHead={[
                  "Name",
                  "Published",
                  { text: "Actions", align: "right" }
                ]}
                tableData={bots}
              />
            )}
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Grid container justifyContent="flex-end">
          <Button simple color="primary" onClick={handleNewBotButtonClick}>
            <AddCircle style={{ width: 30, height: 30 }} />
          </Button>
          <Snackbar
            place="br"
            color={toasterMessage.Color}
            icon={NotificationImportant}
            message={toasterMessage.Message}
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
        </Grid>
      </GridItem>
    </GridContainer>
  );
}

BotsPage.propTypes = {
  classes: PropTypes.object
};

export default withRouter(withStyles(bundleStyles)(BotsPage));
