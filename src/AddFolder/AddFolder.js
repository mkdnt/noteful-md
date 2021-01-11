import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import ValidationError from '../ValidationError'
import './AddFolder.css'

export default class AddFolder extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  handleSubmit = e => {
    e.preventDefault()
    const folder = {
      title: e.target['folder-name'].value
    }
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(folder => {
        this.context.addFolder(folder)
        this.props.history.push(`/folder/${folder.id}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  updateFolderName(name) {
  this.setState({folderName: {value: name, touched: false}})
    }

  validateFolderName(){
    const folderName = this.state.folderName.value.trim();
      if (folderName.length === 0) {
        return "Name is required";
      } else if (folderName.length < 3) {
        return "Name must be at least 3 characters long";
      }
  }

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input 
            type='text' 
            id='folder-name-input' 
            name='folder-name' 
            onChange = {e=> this.updateFolderName(e.target.value)}/>
            {this.state.folderName.touched && <ValidationError message={this.validateFolderName} />}
          </div>
          <div className='buttons'>
            <button type='submit'
            disabled= {this.validateFolderName()}>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
