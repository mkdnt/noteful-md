import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import PropTypes from 'prop-types';
import ApiContext from '../ApiContext';
import ValidationError from '../ValidationError';
import config from '../config';

export class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
          noteName: '',
          touched: false
        }
  };
    static defaultProps = {
        history: {
            push: () => {}
        }
    }

static propTypes = {
    onSubmit: PropTypes.func,
    onClick: PropTypes.func,
    folder: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired
    }),
    note: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      modified: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      onDeleteNote: PropTypes.func
    })
  }

static contextType = ApiContext;

handleClickCancel = () => {
  this.props.history.push('/')
}

updateNoteName(name) {
  this.setState({noteName: name, touched: true})
}

validateNoteName(){
  const noteName = this.state.noteName;
    if (noteName.length === 0) {
      return "Name is required";
    } else if (noteName.length < 3) {
      return "Name must be at least 3 characters long";
    }
}


    render() {
        const {folders = []} = this.context;
        const handleSubmit= (event) =>{
          const newNote = {
              name: event.target['new-note-name'].value,
              content: event.target['new-note-content'].value,
              folderId: event.target['note-folder-select'].value,
              modified: new Date()
          }
          fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(newNote),
          })
            .then(res => {
              if (!res.ok)
                return res.json().then(e => Promise.reject(e))
              return res.json()
            })
            .then(note => {
              this.context.addNote(note)
              this.props.history.push(`/folder/${note.folderId}`)
            })
            .catch(error => {
              console.error({ error })
            })
      }
          return (
            <section>
                <h2>Add New Note</h2>
                <NotefulForm onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="new-note-name">Name</label>
                        <input type='text' 
                        id='new-note-name' 
                        name='new-note-name' 
                        onChange = {e=> this.updateNoteName(e.target.value.trim())}/>
                    </div>
                    <div>
                        <label htmlFor="new-note-content">Content</label>
                        <textarea id='new-note-content' name='new-note-content' />
                    </div>
                    <div>
                        <label htmlFor="note-folder-select">Choose Folder</label>
                        <select id='note-folder-select' name='note-folder-select'>
                            <option value={null}>...</option>
                            {folders.map(folder =>
                                <option key={folder.id} value={folder.id}>
                                {folder.name}
                                </option>
                            )}
                        </select>
                    </div>
                    <div>
                        {this.state.touched && <ValidationError message={this.validateNoteName()} />}
                        <button onClick={this.handleClickCancel}>
                          Cancel
                        </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}

export default AddNote
