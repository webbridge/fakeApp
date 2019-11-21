import React, { useState, useEffect, Fragment } from "react";
import useForm from "react-hook-form";
import moment from "moment";

import { fakeQuery } from "./fakeApi/fakeQuery";
import { fakeMutation } from "./fakeApi/fakeMutation";
import { ApiReadModel, ApiUpdateModel, StatusEnum } from "./fakeApi/models";

import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

const App: React.FC = () => {
  const { register, handleSubmit, errors, formState } = useForm();
  const [messages, setMessage] = useState<ApiReadModel[]>([]);

  useEffect(() => {
    fakeQuery()
      .then(res => {
        setMessage([res]);
      })
      .catch(err => {
        console.error("Something went wrong", err);
      });
  }, []);

  const onSubmit = (values: any): void => {
    const result: ApiUpdateModel = {
      ...values,
      status: StatusEnum.Completed,
      id: Number(
        new Date()
          .valueOf()
          .toString()
          .substr(5)
      )
    };

    fakeMutation(result)
      .then(res => {
        setMessage([...messages, res]);
      })
      .catch(err => {
        console.error("Something went wrong", err);
      });
  };

  return (
    <div className="App">
      <Container maxWidth="sm">
        <h1>Fake app</h1>

        <List>
          {messages.map(({ id, name, comment, status, lastUpdatedDate }) => (
            <Fragment key={id}>
              <ListItem>
                <ListItemText primary={name} secondary={comment} />
                <ListItemText
                  primary={StatusEnum[status]}
                  secondary={moment(lastUpdatedDate).format("DD MMMM, YYYY")}
                />
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Enter your name"
            name="name"
            fullWidth
            inputRef={register({
              required: "Is must be required",
              validate: value =>
                (value.length >= 4 && value.length <= 30) || "Field should between 4 and 30",
              pattern: {
                value: /^\w+$/,
                message: "Field should between alphanumeric"
              }
            })}
            helperText={errors.name && errors.name.message}
          />
          <TextField
            label="Enter your comment"
            multiline
            fullWidth
            rows="5"
            name="comment"
            margin="normal"
            variant="outlined"
            inputRef={register({
              maxLength: { value: 100, message: "Comment cannot have more than 100 characters" }
            })}
            helperText={errors.comment && errors.comment.message}
          />
          <ButtonGroup size="small" fullWidth>
            <Button color="primary" type="submit">
              Add comment
            </Button>
            <Button color="secondary" type="reset">
              Reset form
            </Button>
          </ButtonGroup>
        </form>

        <pre>{JSON.stringify(formState, null, 2)}</pre>
      </Container>
    </div>
  );
};

export default App;
