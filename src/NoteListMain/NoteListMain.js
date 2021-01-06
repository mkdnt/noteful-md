import React from 'react'
import { Link } from 'react-router-dom'
import Note from '../Note/Note'
import CircleButton from '../CircleButton/CircleButton'
import ApiContext from '../ApiContext'
import { getNotesForFolder } from '../notes-helpers'
import './NoteListMain.css'

export default class NoteListMain extends React.Component {
  static defaultProps = {
    match: {
      params: {}
    }
  }
  static contextType = ApiContext

  render() {
    const { folderId } = this.props.match.params
    const { notes=[] } = this.context
    console.log(notes)
    const notesForFolder = getNotesForFolder(notes, parseInt(folderId))
    return (
      <section className='NoteListMain'>
        <ul>
          {notesForFolder.map(note =>
            <li key={note.id}>
              <Note
                id={note.id}
                title={note.title}
                date_published={note.date_published}
              />
            </li>
          )}
        </ul>
        <div className='NoteListMain__button-container'>
          <CircleButton
            tag={Link}
            to='/add-note'
            type='button'
            className='NoteListMain__add-note-button'
          >
            <br />
            Note
          </CircleButton>
        </div>
      </section>
    )
  }
}
