import PropTypes from 'prop-types'
import DebounceInput from 'react-debounce-input'

class CompositionNotes extends React.Component {
  constructor(props) {
    super(props)
    this.state = { notes: props.notes }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ notes: nextProps.notes })
  }

  onCompositionNotesChange(event) {
    // TODO: actually POST this to the server to save the value,
    // but not as the user types because we don't want a request
    // going for every keystroke
    this.setState({ notes: event.target.value })
  }

  render() {
    const { isRequestOut } = this.props
    const { notes } = this.state

    return (
      <div className="composition-notes-wrapper">
        <label
          htmlFor="composition_notes"
          className="label notes-label small-fat-header"
        >Notes</label>
        <DebounceInput
          element="textarea"
          forceNotifyByEnter={false}
          debounceTimeout={500}
          id="composition_notes"
          className="textarea"
          disabled={isRequestOut}
          placeholder="Notes for this team composition"
          value={notes || ''}
          onChange={e => this.onCompositionNotesChange(e)}
        />
        <p>
          <a
            href="https://daringfireball.net/projects/markdown/syntax"
            target="_blank"
            rel="noopener noreferrer"
          >Markdown supported</a>.
        </p>
      </div>
    )
  }
}

CompositionNotes.propTypes = {
  isRequestOut: PropTypes.bool,
  notes: PropTypes.string
}

export default CompositionNotes
