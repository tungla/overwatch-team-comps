import OverwatchTeamCompsApi from '../models/overwatch-team-comps-api'

class CompositionHeader extends React.Component {
  static onMapsError(error) {
    console.error('failed to load maps', error)
  }

  constructor(props) {
    super(props)
    this.state = { name: props.name, editingName: false }
  }

  componentDidMount() {
    const api = new OverwatchTeamCompsApi()

    api.getMaps().then(maps => this.onMapsFetched(maps)).
      catch(err => CompositionHeader.onMapsError(err))
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ name: nextProps.name, editingName: false })
  }

  onNameChange(event) {
    this.setState({ name: event.target.value })
  }

  onMapsFetched(maps) {
    this.setState({ maps })
  }

  onMapChange(event) {
    this.props.onMapChange(event.target.value)
  }

  saveNewName(event) {
    event.preventDefault()
    event.target.closest('button').blur() // defocus the button
    const { name } = this.state
    if (name.trim().length < 1) {
      return
    }
    this.props.onNameChange(name)
  }

  nameEditArea() {
    const { editingName, name } = this.state
    const { disabled } = this.props
    let pencilIcon = null
    let saveButton = null

    if (editingName) {
      saveButton = (
        <button
          disabled={disabled}
          type="button"
          className="button save-composition-name-button"
          onClick={e => this.saveNewName(e)}
        ><i className="fa fa-check" aria-hidden="true" /></button>
      )
    } else if (!disabled) {
      pencilIcon = (
        <i
          className="fa fa-pencil-square-o"
          aria-hidden="true"
        />
      )
    }

    return (
      <div className={`composition-name-container ${editingName ? 'editing' : ''}`}>
        {pencilIcon}
        <input
          type="text"
          className="input composition-name-input"
          placeholder="Composition name"
          id="composition_name"
          value={name || ''}
          disabled={disabled}
          onChange={e => this.onNameChange(e)}
          onFocus={() => this.setState({ editingName: true })}
          aria-label="Name of this team composition"
        />
        {saveButton}
      </div>
    )
  }

  shareLink() {
    const { slug } = this.props
    if (typeof slug !== 'string' || slug.length < 1) {
      return null
    }

    return (
      <div className="composition-link-container">
        <a
          href={`/comp/${slug}`}
          className="composition-link"
        >
          <i
            className="fa fa-link"
            aria-hidden="true"
          />
          Share this composition
        </a>
      </div>
    )
  }

  render() {
    const { maps } = this.state
    if (typeof maps === 'undefined') {
      return null
    }

    const { mapID, mapSlug, mapImage, disabled } = this.props
    return (
      <header className={`composition-header gradient-${mapSlug}`}>
        <div className="container">
          <div className={`map-photo-container background-${mapSlug}`}>
            {mapImage ? (
              <img
                src={mapImage}
                alt={mapSlug}
                className="map-photo"
              />
            ) : ''}
          </div>
          <div className="composition-meta">
            <div>
              <span
                className={`select map-select ${disabled ? 'is-disabled' : ''}`}
              >
                <select
                  aria-label="Choose a map"
                  id="composition_map_id"
                  value={mapID}
                  onChange={e => this.onMapChange(e)}
                  disabled={disabled}
                >
                  {maps.map(map =>
                    <option
                      key={map.id}
                      value={map.id}
                    >{map.name}</option>
                  )}
                </select>
              </span>
            </div>
            {this.nameEditArea()}
            {this.shareLink()}
          </div>
        </div>
      </header>
    )
  }
}

CompositionHeader.propTypes = {
  name: React.PropTypes.string,
  slug: React.PropTypes.string,
  mapID: React.PropTypes.number.isRequired,
  mapSlug: React.PropTypes.string.isRequired,
  mapImage: React.PropTypes.string,
  onMapChange: React.PropTypes.func.isRequired,
  onNameChange: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool.isRequired
}

export default CompositionHeader
