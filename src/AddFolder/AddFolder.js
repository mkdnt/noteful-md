import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import PropTypes from "prop-types";
import ValidationError from "../ValidationError";
import config from "../config";
import ApiContext from "../ApiContext";

export class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folderName: "",
      touched: false,
    };
  }

  static defaultProps = {
    history: {
      push: () => {},
    },
  };

  static propTypes = {
    onSubmit: PropTypes.func,
    onClick: PropTypes.func,
    folder: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
    }),
    note: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      modified: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      onDeleteNote: PropTypes.func,
    }),
  };

  static contextType = ApiContext;

  handleClickCancel = () => {
    this.props.history.push("/");
  };

  updateFolderName(name) {
    this.setState({ folderName: name, touched: true });
  }

  validateFolderName() {
    const folderName = this.state.folderName;
    if (folderName.length === 0) {
      return "Name is required";
    } else if (folderName.length < 3) {
      return "Name must be at least 3 characters long";
    }
  }
  static contextType = ApiContext;
  render() {
    console.log(this.context);
    const handleSubmit = () => {
      const folder = {
        name: this.state.folderName,
      };
      fetch(`${config.API_ENDPOINT}/folders`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(folder),
      })
        .then((res) => {
          if (!res.ok) return res.json().then((e) => Promise.reject(e));
          return res.json();
        })
        .then((folder) => {
          this.context.addFolder(folder);
          this.props.history.push(`/folder/${folder.id}`);
        })
        .catch((error) => {
          console.error({ error });
        });
    };
    return (
      <section>
        <h2>Add New Folder</h2>
        <NotefulForm onSubmit={handleSubmit}>
          <div>
            <label htmlFor="new-folder-name">Folder Name</label>
            <input
              type="text"
              id="new-folder-name"
              name="new-folder-name"
              onChange={(e) => this.updateFolderName(e.target.value.trim())}
            />
          </div>
          <div>
            {this.state.touched && (
              <ValidationError message={this.validateFolderName()} />
            )}
            <button onClick={this.handleClickCancel}>Cancel</button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}

export default AddFolder;
