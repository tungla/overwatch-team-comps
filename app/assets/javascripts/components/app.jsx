import CompositionForm from './composition-form.jsx'
import HeroPoolForm from './hero-pool-form.jsx'
import MainNav from './main-nav.jsx'

class App extends React.Component {
  constructor(props) {
    super(props)

    let activeView = 'composition-form'
    if (window.location.pathname === '/hero-pool') {
      activeView = 'hero-pool-form'
    }

    this.state = { activeView }
  }

  renderActiveView() {
    if (this.state.activeView === 'hero-pool-form') {
      return <HeroPoolForm battletag={this.props.battletag} />
    }

    return <CompositionForm />
  }

  render() {
    const { battletag, authPath } = this.props
    return (
      <div>
        <MainNav
          battletag={battletag}
          authPath={authPath}
          activeView={this.state.activeView}
        />
        {this.renderActiveView()}
      </div>
    )
  }
}

App.propTypes = {
  battletag: React.PropTypes.string.isRequired,
  authPath: React.PropTypes.string.isRequired
}

export default App
