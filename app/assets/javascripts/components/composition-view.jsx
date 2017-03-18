import OverwatchTeamCompsApi from '../models/overwatch-team-comps-api'

class CompositionView extends React.Component {
  static onCompositionFetchError(error) {
    console.error('failed to load composition data', error)
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { slug } = this.props.params
    const api = new OverwatchTeamCompsApi()
    api.getComposition(slug).
      then(comp => this.onCompositionFetched(comp)).
      catch(err => CompositionView.onCompositionFetchError(err))
  }

  onCompositionFetched(composition) {
    this.setState({ composition })
  }

  compositionCreator() {
    const battletag = this.state.composition.user.battletag
    if (typeof battletag !== 'string' || battletag.length < 1) {
      return null
    }
    return (
      <div className="composition-creator">
        By <span>{battletag}</span>
      </div>
    )
  }

  render() {
    const { composition } = this.state

    if (typeof composition === 'undefined') {
      return <p className="container">Loading...</p>
    }

    return (
      <header className="composition-header">
        <div className="container">
          <div className="map-photo-container" />
          <div className="composition-meta">
            <div className="composition-map-name">
              {composition.map.name}
            </div>
            <div className="composition-name">
              {composition.name}
            </div>
            {this.compositionCreator()}
          </div>
        </div>
      </header>
    )
  }
}

CompositionView.propTypes = {
  params: React.PropTypes.object.isRequired
}

export default CompositionView
